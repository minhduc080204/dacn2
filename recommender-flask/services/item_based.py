import pandas as pd
import json
from sklearn.metrics.pairwise import cosine_similarity
from services.db import get_engine, get_connection

VIEW_W = 1
FAV_W  = 3
ORDER_W = 5
SIMILARITY_THRESHOLD = 0.20

def train_item_based():
    engine = get_engine()
    conn = get_connection()
    cursor = conn.cursor()

    # ============================
    # 1. VIEW MATRIX
    # ============================
    views = pd.read_sql("""
        SELECT user_id, product_id, COUNT(*) AS interactions
        FROM product_views
        WHERE user_id IS NOT NULL
        GROUP BY user_id, product_id
    """, engine)
    views["interactions"] *= VIEW_W

    # ============================
    # 2. FAVORITES
    # ============================
    fav = pd.read_sql("""
        SELECT user_id, product_id, COUNT(*) AS interactions
        FROM favorites
        GROUP BY user_id, product_id
    """, engine)
    fav["interactions"] *= FAV_W

    # ============================
    # 3. ORDERS (JSON)
    # ============================
    order_raw = pd.read_sql("""
        SELECT user_id, product_id
        FROM orders
    """, engine)

    o_list = []
    for _, row in order_raw.iterrows():
        try:
            ids = json.loads(row["product_id"])
        except:
            continue

        for pid in ids:
            o_list.append({
                "user_id": row["user_id"],
                "product_id": pid,
                "interactions": ORDER_W
            })

    orders = pd.DataFrame(o_list)

    # ============================
    # 4. MERGE INTERACTIONS
    # ============================
    df = pd.concat([views, fav, orders], ignore_index=True)
    df = df.groupby(["user_id", "product_id"])["interactions"].sum().reset_index()

    # ============================
    # 5. CREATE MATRIX product × user
    # ============================
    pivot = df.pivot_table(
        index="product_id",
        columns="user_id",
        values="interactions",
        fill_value=0
    )

    # ============================
    # 6. PRODUCT SIMILARITY
    # ============================
    sim = cosine_similarity(pivot)
    sim_df = pd.DataFrame(sim, index=pivot.index, columns=pivot.index)

    # ============================
    # 7. SAVE TO DB
    # ============================
    cursor.execute("SELECT MAX(version) as ver FROM similar_products")
    row = cursor.fetchone()
    version = (row["ver"] or 0) + 1

    for pid in sim_df.index:
        related = (
            sim_df.loc[pid]
            .sort_values(ascending=False)[1:20]  # lấy nhiều trước, rồi lọc
        )

        for rid, score in related.items():
            # Chỉ lưu nếu score >= threshold và khác chính nó
            if score >= SIMILARITY_THRESHOLD:
                cursor.execute("""
                    INSERT INTO similar_products (product_id, similar_id, score, version)
                    VALUES (%s, %s, %s, %s)
                """, (int(pid), int(rid), float(score), version))


    conn.commit()
    conn.close()

    return {"status": "done", "version": version}
