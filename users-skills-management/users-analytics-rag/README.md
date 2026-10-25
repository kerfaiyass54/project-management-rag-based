# User Skills Analytics RAG

This service provides admin analytics over the `engineers`, `skill`, `engineer_skill`, and `managers` data sources. The pipeline is intentionally split into small stages so each stage can later be replaced by a production provider (Qdrant embeddings, Cohere reranking, Elasticsearch memory, or RAGAS) without changing the API contract.

## Pipeline

`query -> rewrite/decompose -> hybrid retrieval -> rerank -> grounded answer -> self-check -> confidence -> memory`

## Code organization

The implementation is organized by pipeline responsibility:

```text
src/
├── api/                 # App setup, routes, schemas, and feedback adapter
│   ├── main.py
│   ├── routes.py
│   ├── feedback.py
│   └── schemas.py
├── infrastructure/      # Configuration and PostgreSQL adapter
│   ├── config.py
│   └── postgres.py
├── rag/
│   ├── stages/          # Preparation, retrieval/reranking, quality/memory
│   ├── services/        # Orchestration and evaluation
│   └── pipeline.py      # Compatibility exports only
```

Each package has one boundary: `api` handles HTTP, `infrastructure` handles external systems, `rag/stages` contains replaceable pipeline stages, and `rag/services` coordinates use cases. `pipeline.py` contains no business logic and exists only for older imports.

The current implementation provides a deterministic lexical/dense-like hybrid baseline, which works without an LLM or vector database and keeps local development reliable. The trace in every analysis response reports retrieval count, memory turns, hybrid retrieval, reranking, and self-check status. It also detects missing skills, coverage gaps, distribution imbalances, top skill usage, and engineers with the most linked skills.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /analysis` | Run an admin query and return answer, sources, confidence, rewritten queries, and trace |
| `POST /feedback` | Store a rating and optional correction for a conversation |
| `POST /evaluation` | Return faithfulness, answer relevancy, context precision, context recall, and an overall score |

The Spring service exposes the same operations under `/api/v1/admin/rag/{analysis,feedback,evaluation}` and is the frontend-facing gateway. Set `RAG_API_BASE_URL` when the Python service is not running on `http://localhost:7050`.

## Run

```bash
pip install -r requirements.txt
uvicorn src.api.main:app --host 0.0.0.0 --port 7050
```

Conversation memory and feedback use local JSONL files by default (`.rag_memory.jsonl` and `.rag_feedback.jsonl`). They are deliberately isolated from Redis entity caches; production deployments can replace `ConversationMemory` and the feedback writer with Elasticsearch repositories.
