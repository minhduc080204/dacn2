# import pandas as pd
# from sklearn.metrics.pairwise import cosine_similarity
# from services.db import get_engine, get_connection


# def train_recommendations():

#     engine = get_engine()
#     conn = get_connection()
#     cursor = conn.cursor()

#     # ================================
#     # 1. Lấy dữ liệu từ product_views
#     # ================================
#     views = pd.read_sql("""
#         SELECT user_id, product_id, COUNT(*) AS interactions
#         FROM product_views
#         WHERE user_id IS NOT NULL
#         GROUP BY user_id, product_id
#     """, engine)

#     print("\n=== RAW VIEWS ===")
#     print(views.head())

#     # Nếu không có dữ liệu thì stop
#     if views.empty:
#         return {"status": "no_view_data"}

#     # ================================
#     # 2. Làm sạch dữ liệu
#     # ================================
#     views = views.dropna(subset=["user_id", "product_id"])

#     views["user_id"] = views["user_id"].astype(int)
#     views["product_id"] = views["product_id"].astype(int)
#     views["interactions"] = views["interactions"].astype(int)

#     print("\n=== CLEANED VIEWS ===")
#     print(views.head())

#     # Nếu số user < 2 → không train được CF
#     if views["user_id"].nunique() < 2:
#         return {"status": "need_more_users"}

#     # ================================
#     # 3. Tạo ma trận User × Product
#     # ================================
#     pivot = views.pivot_table(
#         index="user_id",
#         columns="product_id",
#         values="interactions",
#         fill_value=0
#     )

#     print("\n=== USER × PRODUCT MATRIX ===")
#     print(pivot)

#     # ================================
#     # 4. Tính Cosine Similarity
#     # ================================
#     sim_matrix = cosine_similarity(pivot)
#     sim_df = pd.DataFrame(sim_matrix, index=pivot.index, columns=pivot.index)

#     print("\n=== USER SIMILARITY ===")
#     print(sim_df)

#     recommendations_to_save = []

#     # ================================
#     # 5. Tạo gợi ý cho từng user
#     # ================================
#     for user in pivot.index:

#         # Top 4 user giống nhất (bỏ chính nó)
#         similar_users = sim_df[user].sort_values(ascending=False)[1:5].index

#         # Tổng hợp điểm
#         scores = pivot.loc[similar_users].sum()

#         # Loại sản phẩm user đã xem
#         seen = pivot.loc[user]
#         scores = scores[seen == 0]

#         # Lấy top 5 sản phẩm
#         top5 = scores.sort_values(ascending=False).head(5)

#         for product_id, score in top5.items():
#             recommendations_to_save.append({
#                 "user_id": int(user),
#                 "product_id": int(product_id),
#                 "score": float(score)
#             })

#     # ================================
#     # 6. Versioning – Không ghi đè dữ liệu cũ
#     # ================================
#     cursor.execute("SELECT MAX(version) AS ver FROM recommendations")
#     row = cursor.fetchone()
#     current_version = row["ver"] or 0
#     new_version = current_version + 1

#     # ================================
#     # 7. Lưu database
#     # ================================
#     for rec in recommendations_to_save:
#         cursor.execute("""
#             INSERT INTO recommendations (user_id, product_id, score, version)
#             VALUES (%s, %s, %s, %s)
#         """, (rec["user_id"], rec["product_id"], rec["score"], new_version))

#     conn.commit()
#     conn.close()

#     return {
#         "status": "done",
#         "version": new_version,
#         "count": len(recommendations_to_save)
#     }


import pandas as pd
import json
from sklearn.metrics.pairwise import cosine_similarity
from services.db import get_engine, get_connection


# ======== WEIGHT CONFIG ==========
VIEW_WEIGHT = 1
FAVORITE_WEIGHT = 3
ORDER_WEIGHT = 5
# =================================


def train_recommendations():

    engine = get_engine()
    conn = get_connection()
    cursor = conn.cursor()

    # =============================================================
    # 1. PRODUCT VIEW (tương tác yếu)
    # =============================================================
    views = pd.read_sql("""
        SELECT user_id, product_id, COUNT(*) AS interactions
        FROM product_views
        WHERE user_id IS NOT NULL
        GROUP BY user_id, product_id
    """, engine)

    if not views.empty:
        views["interactions"] *= VIEW_WEIGHT

    print("\n=== VIEWS ===")
    print(views.head())


    # =============================================================
    # 2. FAVORITES (tương tác trung bình)
    # =============================================================
    favorites = pd.read_sql("""
        SELECT user_id, product_id, COUNT(*) AS interactions
        FROM favorites
        WHERE user_id IS NOT NULL
        GROUP BY user_id, product_id
    """, engine)

    if not favorites.empty:
        favorites["interactions"] *= FAVORITE_WEIGHT

    print("\n=== FAVORITES ===")
    print(favorites.head())


    # =============================================================
    # 3. ORDERS (product_id dạng JSON)
    # =============================================================
    orders_raw = pd.read_sql("""
        SELECT user_id, product_id
        FROM orders
        WHERE user_id IS NOT NULL
    """, engine)

    order_rows = []

    for _, row in orders_raw.iterrows():
        try:
            product_ids = json.loads(row["product_id"])
        except:
            continue

        if isinstance(product_ids, list):
            for pid in product_ids:
                order_rows.append({
                    "user_id": int(row["user_id"]),
                    "product_id": int(pid),
                    "interactions": ORDER_WEIGHT
                })

    orders = pd.DataFrame(order_rows)

    print("\n=== ORDERS ===")
    print(orders.head())


    # =============================================================
    # 4. GỘP 3 NGUỒN
    # =============================================================
    df_list = [df for df in [views, favorites, orders] if not df.empty]

    if len(df_list) == 0:
        return {"status": "no_data"}

    df = pd.concat(df_list, ignore_index=True)

    # Gộp tương tác cho user + product
    df = df.groupby(["user_id", "product_id"])["interactions"].sum().reset_index()

    # Làm sạch
    df = df.dropna(subset=["user_id", "product_id"])
    df["user_id"] = df["user_id"].astype(int)
    df["product_id"] = df["product_id"].astype(int)
    df["interactions"] = df["interactions"].astype(int)

    print("\n=== MERGED INTERACTIONS ===")
    print(df.head(10))


    if df["user_id"].nunique() < 2:
        return {"status": "need_more_users"}


    # =============================================================
    # 5. MA TRẬN USER × PRODUCT
    # =============================================================
    pivot = df.pivot_table(
        index="user_id",
        columns="product_id",
        values="interactions",
        fill_value=0
    )

    print("\n=== USER × PRODUCT MATRIX ===")
    print(pivot)


    # =============================================================
    # 6. USER SIMILARITY
    # =============================================================
    sim_matrix = cosine_similarity(pivot)
    sim_df = pd.DataFrame(sim_matrix, index=pivot.index, columns=pivot.index)

    print("\n=== USER SIMILARITY ===")
    print(sim_df)


    # =============================================================
    # 7. TẠO GỢI Ý
    # =============================================================
    recommendations_to_save = []

    for user in pivot.index:
        similar_users = sim_df[user].sort_values(ascending=False)[1:5].index

        scores = pivot.loc[similar_users].sum()

        seen = pivot.loc[user]
        scores = scores[seen == 0]

        top5 = scores.sort_values(ascending=False).head(5)

        for product_id, score in top5.items():
            recommendations_to_save.append({
                "user_id": int(user),
                "product_id": int(product_id),
                "score": float(score)
            })


    # =============================================================
    # 8. VERSIONING
    # =============================================================
    cursor.execute("SELECT MAX(version) AS ver FROM recommendations")
    row = cursor.fetchone()
    current_version = row["ver"] or 0
    new_version = current_version + 1


    # =============================================================
    # 9. LƯU VÀO DATABASE
    # =============================================================
    for rec in recommendations_to_save:
        cursor.execute("""
            INSERT INTO recommendations (user_id, product_id, score, version)
            VALUES (%s, %s, %s, %s)
        """, (rec["user_id"], rec["product_id"], rec["score"], new_version))


    conn.commit()
    conn.close()

    return {
        "status": "done",
        "version": new_version,
        "count": len(recommendations_to_save)
    }
