from typing import Any, Dict, List
from src.rag.stages.preparation import record_text, records, tokens

class HybridRetriever:
    def build_documents(self, data: Dict[str, Any]) -> List[Dict[str, str]]:
        groups = (("engineer", records(data, "engineers")), ("skill", records(data, "skill") + records(data, "skills")), ("assignment", records(data, "engineer_skill") + records(data, "engineer_skills")))
        documents = []
        for prefix, rows in groups:
            for row in rows:
                documents.append({"id": f"{prefix}:{row.get('id', len(documents))}", "text": record_text(row)})
        return documents

    def retrieve(self, queries: List[str], documents: List[Dict[str, str]], top_k: int) -> List[Dict[str, Any]]:
        found: Dict[str, Dict[str, Any]] = {}
        for query in queries:
            query_terms = tokens(query)
            for document in documents:
                document_terms = tokens(document["text"])
                overlap = len(query_terms & document_terms)
                score = 0.65 * overlap / max(len(query_terms), 1) + 0.35 * overlap / max(len(query_terms | document_terms), 1)
                if score and (document["id"] not in found or score > found[document["id"]]["score"]):
                    found[document["id"]] = {"source_id": document["id"], "content": document["text"], "score": score, "retrieval_method": "hybrid"}
        return sorted(found.values(), key=lambda item: item["score"], reverse=True)[:top_k]

class Reranker:
    def rerank(self, query: str, sources: List[Dict[str, Any]], top_k: int) -> List[Dict[str, Any]]:
        terms = tokens(query)
        for source in sources:
            source["score"] = round(0.75 * source["score"] + 0.25 * len(terms & tokens(source["content"])) / max(len(terms), 1), 4)
            source["retrieval_method"] = "hybrid+rereanked"
        return sorted(sources, key=lambda item: item["score"], reverse=True)[:top_k]
