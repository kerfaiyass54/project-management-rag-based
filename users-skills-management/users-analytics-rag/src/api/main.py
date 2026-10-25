from fastapi import FastAPI
from src.api.feedback import FeedbackStore
from src.api.routes import create_router
from src.rag.services.orchestrator import RagOrchestrator

app = FastAPI(title="User Skills Analytics RAG API", version="2.0.0")
app.include_router(create_router(RagOrchestrator(), FeedbackStore()))
