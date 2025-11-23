import pandas as pd
import json
from datetime import datetime, timedelta
from services.db import get_engine, get_connection

VIEW_W = 1
FAV_W  = 3
ORDER_W = 5

# Chỉ tính dữ liệu 7 ngày gần nhất (giống Shopee/GrabFood)
DAYS_RANGE = 7


def train_top_trending():

    engine = get_engine()
    conn = get_connection()
    cursor = conn.cursor()

    # ============================
    # 1. Lấy mốc thời gian 7 ngày
    # ============================
    date_limit = (datetime.now() - timedelta(days=DAYS_RANGE)).strftime('%Y-%m-%d %H:%M:%S')
    print("DATE LIMIT =", date_limit)

    # ============================
    # 2. Lượt xem (product_views)
    # ============================
    views = pd.read_sql(f"""
        SELECT product_id, COUNT(*) AS view_score
        FROM product_views
        WHERE viewed_at >= '{date_limit}'
        GROUP BY product_id
    """, engine)

    views["view_score"] *= VIEW_W

    # ============================
    # 3. Favorites
    # ============================
    fav = pd.read_sql(f"""
        SELECT product_id, COUNT(*) AS fav_score
        FROM favorites
        WHERE favorited_at >= '{date_limit}'
        GROUP BY product_id
    """, engine)

    fav["fav_score"] *= FAV_W

    # ============================
    # 4. Orders (product_id = JSON array)
    # ============================
    orders_raw = pd.read_sql(f"""
        SELECT product_id
        FROM orders
        WHERE created_at >= '{date_limit}'
    """, engine)

    order_list = []

    for _, row in orders_raw.iterrows():
        try:
            pids = json.loads(row["product_id"])
            for pid in pids:
                order_list.append({"product_id": pid, "order_score": ORDER_W})
        except:
            continue

    orders = pd.DataFrame(order_list)

    # ============================
    # 5. Gộp tất cả lại
    # ============================
    df_list = []

    if not views.empty:
        df_list.append(views)

    if not fav.empty:
        df_list.append(fav)

    if not orders.empty:
        df_list.append(orders)

    if len(df_list) == 0:
        return {"status": "no_data"}

    df = pd.concat(df_list, axis=0, ignore_index=True)

    # Rolling sum theo product_id
    df = df.groupby("product_id").sum().reset_index()

    # Tính điểm Trending
    df["score"] = df.sum(axis=1)

    print("\n=== TRENDING SCORE ===")
    print(df.sort_values("score", ascending=False).head(10))

    # ============================
    # 6. Lưu top trend vào DB
    # ============================
    cursor.execute("SELECT MAX(version) as ver FROM trending_products")
    row = cursor.fetchone()
    version = (row["ver"] or 0) + 1

    for _, row in df.sort_values("score", ascending=False).iterrows():
        cursor.execute("""
            INSERT INTO trending_products (product_id, score, version)
            VALUES (%s, %s, %s)
        """, (
            int(row["product_id"]),
            float(row["score"]),
            version
        ))

    conn.commit()
    conn.close()

    return {
        "status": "done",
        "version": version,
        "top_products_count": len(df)
    }
