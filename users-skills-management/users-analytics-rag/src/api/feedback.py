import json
import uuid
from pathlib import Path
from src.api.schemas import FeedbackRequest, FeedbackResponse

class FeedbackStore:
    def __init__(self, path: str = ".rag_feedback.jsonl"):
        self.path = Path(path)

    def save(self, request: FeedbackRequest) -> FeedbackResponse:
        feedback_id = str(uuid.uuid4())
        with self.path.open("a", encoding="utf-8") as stream:
            stream.write(json.dumps({"id": feedback_id, **request.model_dump()}) + "\n")
        return FeedbackResponse(stored=True, feedback_id=feedback_id)
