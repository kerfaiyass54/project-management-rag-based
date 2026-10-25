from typing import Any, Dict, List
from src.rag.stages.preparation import tokens

def evaluate(query: str, answer: str, contexts: List[str], reference_answer: str | None = None) -> Dict[str, Any]:
    answer_terms, context_terms, query_terms = tokens(answer), tokens(" ".join(contexts)), tokens(query)
    faithfulness = len(answer_terms & context_terms) / max(len(answer_terms), 1)
    relevancy = len(answer_terms & query_terms) / max(len(query_terms), 1)
    precision = sum(bool(tokens(context) & answer_terms) for context in contexts) / max(len(contexts), 1)
    recall = len(tokens(reference_answer) & context_terms) / max(len(tokens(reference_answer)), 1) if reference_answer else precision
    values = [faithfulness, relevancy, precision, recall]
    return {"faithfulness": round(min(faithfulness, 1), 3), "answer_relevancy": round(min(relevancy, 1), 3), "context_precision": round(min(precision, 1), 3), "context_recall": round(min(recall, 1), 3), "overall": round(sum(values) / 4, 3), "details": {"contexts_evaluated": len(contexts), "reference_used": bool(reference_answer)}}
