import json
import re
from typing import Any, Dict, List

def tokens(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", value.lower()))

def records(data: Dict[str, Any], table: str) -> List[Dict[str, Any]]:
    raw = data.get(table, [])
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return []
    return raw if isinstance(raw, list) else []

def record_text(row: Dict[str, Any]) -> str:
    return " ".join(f"{key} {value}" for key, value in row.items())

class QueryRewriter:
    def rewrite(self, query: str) -> List[str]:
        query = re.sub(r"\s+", " ", query.strip().lower())
        expansions = {"most used": "skill usage assignments frequency", "skillful engineers": "engineer proficiency experience assignments", "imbalance": "skill distribution gap coverage", "missing": "missing skills coverage gap", "gap": "difference distribution shortage"}
        queries = [query]
        for phrase, expansion in expansions.items():
            if phrase in query:
                queries.append(f"{query} {expansion}")
        if "top" in query or "highest" in query:
            queries.append(f"{query} rank descending aggregate")
        return list(dict.fromkeys(queries))
