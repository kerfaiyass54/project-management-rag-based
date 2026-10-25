from typing import Dict
import pandas as pd
import psycopg2
from psycopg2 import sql
from src.infrastructure.config import config

def fetch_skill_data() -> Dict[str, str]:
    settings = config["data_sources"]["postgresql"]
    connection = psycopg2.connect(host=settings["host"], port=settings["port"], dbname=settings["database"], user=settings["user"], password=settings["password"])
    try:
        result: Dict[str, str] = {}
        with connection.cursor() as cursor:
            for table in settings["tables"]:
                cursor.execute(sql.SQL("SELECT * FROM {}").format(sql.Identifier(table)))
                columns = [column.name for column in cursor.description]
                result[table] = pd.DataFrame(cursor.fetchall(), columns=columns).to_json(orient="records")
        return result
    finally:
        connection.close()
