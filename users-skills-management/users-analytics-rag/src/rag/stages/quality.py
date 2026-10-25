import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List
from src.rag.stages.preparation import tokens

class ConversationMemory:
    def __init__(self, path: str = ".rag_memory.jsonl"):
        self.path = Path(path)
    def load(self, conversation_id: str | None) -> List[Dict[str, Any]]:
        if not conversation_id or not self.path.exists():
            return []
        result = []
        for line in self.path.read_text(encoding="utf-8").splitlines():
            try:
                item = json.loads(line)
                if item.get("conversation_id") == conversation_id:
                    result.append(item)
            except json.JSONDecodeError:
                continue
        return result[-5:]
    def append(self, conversation_id: str, query: str, answer: str) -> None:
        with self.path.open("a", encoding="utf-8") as stream:
            stream.write(json.dumps({"conversation_id": conversation_id, "query": query, "answer": answer, "created_at": datetime.now(timezone.utc).isoformat()}) + "\n")

class ConfidenceScorer:
    def score(self, sources: List[Dict[str, Any]], answer: str) -> float:
        if not sources or not answer:
            return 0.0
        evidence, answer_terms = tokens(" ".join(item["content"] for item in sources)), tokens(answer)
        return round(min(1.0, 0.55 * len(evidence & answer_terms) / max(len(answer_terms), 1) + 0.45 * sum(item["score"] for item in sources) / len(sources)), 3)

class SelfChecker:
    def check(self, answer: str, sources: List[Dict[str, Any]]) -> bool:
        if not answer or not sources:
            return False
        claims = tokens(answer)
        return len(claims & tokens(" ".join(item["content"] for item in sources))) / max(len(claims), 1) >= 0.2
