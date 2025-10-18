from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import mysql.connector
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow frontend access (adjust origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with your frontend domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    """Create and return a secure connection to DigitalOcean MySQL."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        database=os.getenv("DB_NAME"),
        ssl_ca=os.getenv("CA_CERT_PATH"),
    )

@app.get("/source_sales")
def stream_source_sales(
    limit: int = Query(100, ge=1, le=1000, description="Number of rows to return"),
    offset: int = Query(0, ge=0, description="Starting offset"),
):
    """
    Stream rows from source_sales table with pagination.
    Example: /source_sales?limit=200&offset=400
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch the total count once for frontend pagination
    cursor.execute("SELECT COUNT(*) AS total FROM source_sales;")
    total_rows = cursor.fetchone()["total"]

    # Main data query
    cursor.execute("SELECT * FROM source_sales LIMIT %s OFFSET %s;", (limit, offset))

    def row_generator():
        yield '{"total": ' + str(total_rows) + ', "data": ['
        first = True
        for row in cursor:
            if not first:
                yield ','
            else:
                first = False
            yield json.dumps(row, default=str)
        yield ']}'
        cursor.close()
        conn.close()

    return StreamingResponse(row_generator(), media_type="application/json")


@app.get("/")
def root():
    return {"message": "FastAPI connected to DigitalOcean MySQL successfully!"}
