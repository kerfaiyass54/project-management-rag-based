from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    query: str = Field(min_length=3, max_length=2000)
    conversation_id: Optional[str] = None
    top_k: int = Field(default=8, ge=1, le=50)
    team_id: Optional[int] = None


class RetrievedSource(BaseModel):
    source_id: str
    content: str
    score: float
    retrieval_method: str


class AnalysisResponse(BaseModel):
    answer: str
    rewritten_queries: List[str]
    sources: List[RetrievedSource]
    confidence: float
    self_check_passed: bool
    follow_up_queries: List[str] = Field(default_factory=list)
    trace: Dict[str, Any] = Field(default_factory=dict)
    conversation_id: Optional[str] = None


class FeedbackRequest(BaseModel):
    conversation_id: Optional[str] = None
    query: str
    answer: str
    rating: int = Field(ge=-1, le=1)
    correction: Optional[str] = None


class FeedbackResponse(BaseModel):
    stored: bool
    feedback_id: str


class EvaluationRequest(BaseModel):
    query: str
    answer: str
    contexts: List[str] = Field(default_factory=list)
    reference_answer: Optional[str] = None


class EvaluationResponse(BaseModel):
    faithfulness: float
    answer_relevancy: float
    context_precision: float
    context_recall: float
    overall: float
    details: Dict[str, Any] = Field(default_factory=dict)
