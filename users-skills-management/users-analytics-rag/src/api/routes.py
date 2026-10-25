from fastapi import APIRouter, HTTPException
from src.api.feedback import FeedbackStore
from src.api.schemas import AnalysisRequest, AnalysisResponse, EvaluationRequest, EvaluationResponse, FeedbackRequest, FeedbackResponse
from src.rag.services.evaluation import evaluate
from src.rag.services.orchestrator import RagOrchestrator

def create_router(orchestrator: RagOrchestrator, feedback: FeedbackStore) -> APIRouter:
    router = APIRouter()

    @router.post("/analysis", response_model=AnalysisResponse)
    async def analysis(request: AnalysisRequest):
        try:
            return orchestrator.analyze(request.model_dump())
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"RAG analysis failed: {exc}") from exc

    @router.post("/feedback", response_model=FeedbackResponse)
    async def submit_feedback(request: FeedbackRequest):
        return feedback.save(request)

    @router.post("/evaluation", response_model=EvaluationResponse)
    async def evaluation(request: EvaluationRequest):
        return evaluate(request.query, request.answer, request.contexts, request.reference_answer)

    return router
