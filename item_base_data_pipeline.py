import os
from datetime import datetime
import numpy as np
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import requests
from sklearn.metrics.pairwise import cosine_similarity
from prefect import flow, task, get_run_logger

# Cấu hình mặc định (có thể ghi đè qua biến môi trường)
API_URL = os.getenv(
    "ITEM_BASED_API_URL",
    "http://localhost:8000/api/ml-data/recommend-system-item-based"
)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:123456@localhost:5432/shopmrkin"
)


@task(name="1. Extract Order Interaction Data", retries=2, retry_delay_seconds=5)
def extract_interaction_data(api_url: str = API_URL) -> pd.DataFrame:
    """
    Gọi API từ Express Server để lấy dữ liệu tương tác mua hàng:
    Columns: ['user_id', 'item_id', 'item_name', 'total_quantity']
    """
    logger = get_run_logger()
    logger.info(f"Đang tải dữ liệu mua hàng từ API: {api_url}")

    response = requests.get(api_url, timeout=30)
    response.raise_for_status()

    data = response.json()
    df = pd.DataFrame(data)

    if df.empty:
        logger.warning("Dữ liệu trả về từ API đang trống!")
        return pd.DataFrame(columns=["user_id", "item_id", "item_name", "total_quantity"])

    logger.info(
        f"Đã tải {len(df)} dòng tương tác từ {df['user_id'].nunique()} users "
        f"và {df['item_id'].nunique()} sản phẩm."
    )
    return df


@task(name="2. Compute Item-Item Similarity Matrix")
def compute_item_based_similarity(
    df: pd.DataFrame,
    top_k: int = 12,
    use_binary: bool = True
) -> pd.DataFrame:
    """
    Xây dựng ma trận User x Item, sau đó tính Cosine Similarity giữa các cột (Item x Item)
    và lọc ra Top-K sản phẩm thường được mua kèm nhất cho mỗi sản phẩm.

    :param df: DataFrame ['user_id', 'item_id', 'item_name', 'total_quantity']
    :param top_k: Số lượng sản phẩm gợi ý tối đa cho mỗi sản phẩm
    :param use_binary:
        - True: Ma trận nhị phân 0/1 (User có mua sản phẩm đó hay không)
        - False: Dùng log(1 + total_quantity) để tính trọng số mua nhiều lần
    """
    logger = get_run_logger()

    if df.empty:
        logger.warning("DataFrame đầu vào trống, bỏ qua bước tính ma trận.")
        return pd.DataFrame(columns=["product_id", "recommended_product_id", "score"])

    # Bước 1: Tạo ma trận User x Item (index = user_id, columns = item_id)
    user_item_matrix = df.pivot_table(
        index="user_id",
        columns="item_id",
        values="total_quantity",
        aggfunc="sum",
        fill_value=0
    )

    if use_binary:
        # Chuyển về 1 (đã mua) hoặc 0 (chưa mua)
        interaction_matrix = (user_item_matrix > 0).astype(float)
        logger.info(f"Đã tạo ma trận nhị phân User x Item kích thước: {interaction_matrix.shape}")
    else:
        # Dùng log(1 + quantity) làm trọng số
        interaction_matrix = np.log1p(user_item_matrix)
        logger.info(f"Đã tạo ma trận log-weight User x Item kích thước: {interaction_matrix.shape}")

    # Bước 2: Chuyển vị sang Item x User để mỗi dòng là vector mua hàng của 1 sản phẩm
    item_user_matrix = interaction_matrix.T
    item_ids = item_user_matrix.index.tolist()

    # Bước 3: Tính Cosine Similarity giữa tất cả các cặp sản phẩm (Item x Item)
    sim_matrix = cosine_similarity(item_user_matrix.values)

    # Bước 4: Với mỗi sản phẩm, lấy Top-K sản phẩm có điểm tương đồng > 0 cao nhất
    records = []
    for idx, product_id in enumerate(item_ids):
        scores = sim_matrix[idx]
        # Sắp xếp giảm dần theo điểm tương đồng
        sorted_indices = np.argsort(scores)[::-1]

        count = 0
        for sim_idx in sorted_indices:
            if sim_idx == idx:
                continue  # Bỏ qua chính nó

            score = float(scores[sim_idx])
            if score <= 0:
                break  # Chỉ lấy các sản phẩm có tương quan mua kèm (> 0)

            records.append({
                "product_id": product_id,
                "recommended_product_id": item_ids[sim_idx],
                "score": round(score, 6)
            })
            count += 1
            if count >= top_k:
                break

    result_df = pd.DataFrame(records)
    logger.info(f"Đã tính xong {len(result_df)} cặp sản phẩm mua kèm (Top-{top_k}/sản phẩm).")
    return result_df


@task(name="3. Save Item-Based Similarities to DB")
def save_similarities_to_postgres(
    sim_df: pd.DataFrame,
    db_url: str = DATABASE_URL
) -> int:
    """
    Tạo bảng (nếu chưa có) và lưu danh sách độ tương đồng Item-Based vào PostgreSQL.
    """
    logger = get_run_logger()

    if sim_df.empty:
        logger.warning("Không có dữ liệu tương đồng nào để lưu vào DB.")
        return 0

    # Chuẩn hóa DATABASE_URL nếu có query ?schema=public của Prisma
    clean_db_url = db_url.split("?")[0]

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS public.item_based_similarities (
        product_id varchar(50) NOT NULL,
        recommended_product_id varchar(50) NOT NULL,
        score float8 NOT NULL,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
        CONSTRAINT item_based_similarities_pkey PRIMARY KEY (product_id, recommended_product_id),
        CONSTRAINT item_based_similarities_product_id_fkey
            FOREIGN KEY (product_id) REFERENCES public."Products"(id) ON DELETE CASCADE,
        CONSTRAINT item_based_similarities_recommended_product_id_fkey
            FOREIGN KEY (recommended_product_id) REFERENCES public."Products"(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_item_based_sim
        ON public.item_based_similarities USING btree (product_id, score DESC);
    """

    insert_sql = """
    INSERT INTO public.item_based_similarities (product_id, recommended_product_id, score, updated_at)
    VALUES %s;
    """

    now = datetime.utcnow()
    rows = [
        (row.product_id, row.recommended_product_id, float(row.score), now)
        for row in sim_df.itertuples(index=False)
    ]

    conn = psycopg2.connect(clean_db_url)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(create_table_sql)
                # TRUNCATE + INSERT nằm trong cùng 1 transaction:
                # 1. Xóa sạch các cặp Top-K cũ không còn phù hợp
                # 2. Nhanh hơn nhiều so với UPDATE/UPSERT từng dòng
                # 3. Nhờ transaction của PostgreSQL, API đọc dữ liệu không bao giờ bị trống giữa chừng
                cur.execute("TRUNCATE TABLE public.item_based_similarities;")
                execute_values(cur, insert_sql, rows, page_size=1000)
        logger.info(f"Đã TRUNCATE và lưu mới {len(rows)} bản ghi vào bảng public.item_based_similarities.")
    finally:
        conn.close()

    return len(rows)


@flow(name="Item-Based Recommendation Data Pipeline")
def item_based_recommendation_flow(
    api_url: str = API_URL,
    db_url: str = DATABASE_URL,
    top_k: int = 12,
    use_binary: bool = True
):
    """
    Prefect Flow chính:
    1. Lấy dữ liệu đơn hàng từ API Server
    2. Xây dựng ma trận User x Item và tính Cosine Similarity (Item x Item)
    3. Lưu Top-K sản phẩm mua kèm vào bảng public.item_based_similarities
    """
    interaction_df = extract_interaction_data(api_url=api_url)
    similarity_df = compute_item_based_similarity(
        df=interaction_df,
        top_k=top_k,
        use_binary=use_binary
    )
    saved_count = save_similarities_to_postgres(
        sim_df=similarity_df,
        db_url=db_url
    )
    return {
        "interactions": len(interaction_df),
        "saved_similarity_pairs": saved_count
    }


if __name__ == "__main__":
    # Chạy và đăng ký deployment lên Prefect Server để theo dõi định kỳ
    item_based_recommendation_flow.serve(
        name="build item-based matrix",
        interval=60
    )
