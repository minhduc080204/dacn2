import pymysql
from sqlalchemy import create_engine

# ĐỌC TỪ .env hoặc sửa cứng tại đây
DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = ""
DB_NAME = "dine_hub"

def get_engine():
    return create_engine(
        f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}",
        pool_pre_ping=True
    )

def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )
