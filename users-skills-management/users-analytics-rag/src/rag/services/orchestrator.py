import uuid
from collections import Counter
from typing import Any, Dict, List
from src.infrastructure.postgres import fetch_skill_data
from src.rag.stages.preparation import QueryRewriter, records
from src.rag.stages.quality import ConfidenceScorer, ConversationMemory, SelfChecker
from src.rag.stages.retrieval import HybridRetriever, Reranker

class RagOrchestrator:
    def __init__(self):
        self.rewriter, self.retriever, self.reranker = QueryRewriter(), HybridRetriever(), Reranker()
        self.memory, self.confidence, self.checker = ConversationMemory(), ConfidenceScorer(), SelfChecker()

    def _answer(self, query: str, data: Dict[str, Any], sources: List[Dict[str, Any]]) -> str:
        engineers, skills = records(data, "engineers"), records(data, "skill") + records(data, "skills")
        assignments = records(data, "engineer_skill") + records(data, "engineer_skills")
        usage = Counter(str(row.get("skill_id", row.get("skillId", ""))) for row in assignments)
        names = {str(row.get("id")): row.get("skillName", row.get("skill_name", row.get("name", row.get("id")))) for row in skills}
        normalized = query.lower()
        if any(word in normalized for word in ("missing", "gap", "imbalance")):
            missing = [str(names.get(str(row.get("id")), row.get("name", row.get("id")))) for row in skills if str(row.get("id")) not in usage]
            return f"Coverage analysis found {len(missing)} skills without an assignment: {', '.join(missing[:10]) or 'none detected'}."
        if "skill" in normalized or "used" in normalized:
            ranking = ", ".join(f"{names.get(key, key)} ({count})" for key, count in usage.most_common(5))
            return f"Top skill usage by assignment count: {ranking or 'no assignments found'}."
        return f"The dataset contains {len(engineers)} engineers, {len(skills)} skills, and {len(assignments)} assignments."

    def analyze(self, request: Dict[str, Any]) -> Dict[str, Any]:
        data = fetch_skill_data()
        rewritten = self.rewriter.rewrite(request["query"])
        first_pass = self.retriever.retrieve(rewritten, self.retriever.build_documents(data), request.get("top_k", 8) * 2)
        sources = self.reranker.rerank(request["query"], first_pass, request.get("top_k", 8))
        conversation_id = request.get("conversation_id") or str(uuid.uuid4())
        prior = self.memory.load(conversation_id)
        answer = self._answer(request["query"], data, sources)
        checked = self.checker.check(answer, sources)
        self.memory.append(conversation_id, request["query"], answer)
        return {"answer": answer, "rewritten_queries": rewritten, "sources": sources, "confidence": self.confidence.score(sources, answer), "self_check_passed": checked, "follow_up_queries": ["Group this result by field", "Explain the largest gap"], "conversation_id": conversation_id, "trace": {"retrieval_steps": len(rewritten), "retrieved_count": len(first_pass), "memory_turns": len(prior), "hybrid": True, "reranked": True, "self_checked": True}}
