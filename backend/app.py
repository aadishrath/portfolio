import os
import re
from typing import List

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


def get_allowed_origins():
    configured = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    return [origin.strip() for origin in configured.split(",") if origin.strip()]


app = FastAPI(
    title="Aadish Portfolio API",
    version="0.2.0",
    description="Backend API for the Vercel-hosted portfolio frontend."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


TOKEN_RE = re.compile(r"[a-zA-Z']+")

PROFILE = {
    "name": "Aadish Rathore",
    "title": "ML Engineer | Angular Developer",
    "intro": (
        "I build user-facing products that blend thoughtful frontend engineering "
        "with practical machine learning workflows."
    ),
    "about": [
        (
            "My work sits at the intersection of frontend development, data science, "
            "and applied AI. I enjoy turning technical systems into products that "
            "feel clear, reliable, and useful."
        ),
        (
            "This version of the portfolio is intentionally split into a "
            "Vercel-hosted frontend and a Render-hosted backend so it stays "
            "simple, inexpensive, and easy to evolve."
        )
    ],
    "highlights": [
        "Frontend engineering with React, Angular, and modern UI systems",
        "Applied NLP and ML workflows, including sentiment analysis and retrieval-augmented systems",
        "API integration, deployment setup, and end-to-end product thinking"
    ],
    "links": {
        "github": "https://github.com/aadishrath",
        "linkedin": "https://www.linkedin.com/in/aadishrath"
    }
}

PROJECTS = [
    {
        "id": "ml-sentiment",
        "title": "Sentiment Analysis",
        "summary": "A modular NLP experience that now includes both in-browser and backend-backed analysis demos.",
        "stack": ["Python", "FastAPI", "NLP"],
        "href": "https://github.com/aadishrath/sentimentAnalysis"
    },
    {
        "id": "ml-rag",
        "title": "RAG Playground",
        "summary": "A retrieval demo with demo-corpus loading, source inspection, and grounded answer cards.",
        "stack": ["FastAPI", "RAG", "Vector Search"],
        "href": "https://github.com/aadishrath/aadishrath.github.io"
    },
    {
        "id": "portfolio",
        "title": "Portfolio Platform",
        "summary": "A portfolio experience ported from GitHub Pages into a Vercel frontend and Render backend setup.",
        "stack": ["React", "Vite", "FastAPI", "Vercel", "Render"],
        "href": "https://github.com/aadishrath/portfolio"
    }
]

SENTIMENT_LEXICON = {
    "love": 3,
    "loved": 3,
    "great": 3,
    "good": 2,
    "excellent": 4,
    "amazing": 4,
    "awesome": 4,
    "delightful": 3,
    "happy": 2,
    "pleasant": 2,
    "fast": 2,
    "intuitive": 2,
    "easy": 2,
    "best": 3,
    "exceeded": 3,
    "reliable": 2,
    "grounded": 1,
    "bad": -2,
    "terrible": -3,
    "awful": -3,
    "hate": -3,
    "slow": -2,
    "bug": -2,
    "bugs": -2,
    "frustrating": -3,
    "confusing": -2,
    "hard": -2,
    "difficult": -2,
    "disappointing": -3,
    "poor": -2,
    "worst": -3,
}

NEGATIONS = {"not", "never", "no", "hardly"}

DEMO_CORPUS = {
    "portfolio_overview.md": """
The portfolio is a React 19 and Vite application deployed on Vercel with a FastAPI backend on Render.
It highlights Aadish Rathore's machine learning work, frontend engineering background, and recruiter-facing product polish.
The app includes routed portfolio pages, a site chatbot, project modals, and interactive demos.
""".strip(),
    "rag_architecture.md": """
The RAG demo uses a portfolio-native user experience with upload flows, retrieval diagnostics, and grounded answer cards.
In a production version, the backend can chunk documents, generate embeddings, index vectors, rerank candidates, and synthesize grounded answers.
This lightweight Render deployment keeps an in-memory corpus so the UI still demonstrates ingestion, querying, and source inspection.
""".strip(),
    "sentiment_demo.md": """
The sentiment page compares an in-browser Python model loaded with Pyodide against a backend model exposed through FastAPI.
This makes the portfolio more interactive while still explaining the difference between lightweight browser inference and end-to-end deployed inference.
""".strip(),
}

RAG_STATE = {
    "sources": {},
    "chunks": [],
}


class SentimentPayload(BaseModel):
    text: str


class RagQueryPayload(BaseModel):
    query: str
    top_k: int = 4


def tokenize(text: str) -> List[str]:
    return [match.group(0).lower() for match in TOKEN_RE.finditer(text)]


def chunk_text(source: str, text: str) -> List[dict]:
    paragraphs = [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]
    if not paragraphs:
        paragraphs = [text.strip()] if text.strip() else []

    chunks = []
    for index, paragraph in enumerate(paragraphs, start=1):
        chunks.append(
            {
                "chunk_id": f"{source}-{index}",
                "source": source,
                "text": paragraph,
                "tokens": set(tokenize(paragraph)),
            }
        )
    return chunks


def rebuild_rag_index(source_map: dict):
    chunks = []
    for source, text in source_map.items():
        chunks.extend(chunk_text(source, text))
    RAG_STATE["sources"] = dict(source_map)
    RAG_STATE["chunks"] = chunks


def get_rag_status():
    return {
        "status": "ok",
        "ready": bool(RAG_STATE["chunks"]),
        "embedding_model": "keyword-demo-index",
        "vector_backend": "in-memory",
        "source_count": len(RAG_STATE["sources"]),
        "chunks_indexed": len(RAG_STATE["chunks"]),
        "sources": sorted(RAG_STATE["sources"].keys()),
    }


def score_chunk(query_tokens: set, chunk: dict) -> tuple[float, float, float]:
    if not query_tokens:
        return 0.0, 0.0, 0.0

    overlap = query_tokens & chunk["tokens"]
    lexical_score = len(overlap) / len(query_tokens)
    semantic_score = min(1.0, lexical_score + (0.15 if overlap else 0.0))
    combined = round((semantic_score * 0.65) + (lexical_score * 0.35), 3)
    return combined, round(semantic_score, 3), round(lexical_score, 3)


def build_answer(query: str, contexts: List[dict]) -> str:
    if not contexts:
        return (
            f"I could not find grounded context for '{query}' yet. "
            "Load the demo corpus or upload files first, then try a more specific question."
        )

    source_list = ", ".join(context["source"] for context in contexts[:3])
    lead = contexts[0]["preview"]
    return (
        f"Based on the indexed corpus, the strongest match points to **{source_list}**.\n\n"
        f"Top evidence: {lead}\n\n"
        "This Render-hosted demo uses lightweight in-memory retrieval so the portfolio UX stays interactive "
        "without requiring a heavier vector database in this repo."
    )


def analyze_sentiment(text: str, version: str) -> dict:
    version_bonus = {
        "v1": {},
        "v2": {"polished": 2, "thoughtful": 2, "clear": 1, "useful": 1},
        "v3": {"polished": 2, "thoughtful": 2, "clear": 1, "useful": 1, "robust": 2},
    }
    lexicon = {**SENTIMENT_LEXICON, **version_bonus.get(version, {})}

    tokens = tokenize(text)
    token_scores = []
    total = 0
    negate_next = False

    for token in tokens:
        score = lexicon.get(token, 0)
        if token in NEGATIONS:
            negate_next = True
            token_scores.append([token, 0])
            continue
        if negate_next and score:
            score *= -1
            negate_next = False
        else:
            negate_next = False

        token_scores.append([token, score])
        total += score

    matched_scores = [abs(score) for _, score in token_scores if score]
    confidence = round(min(1.0, (sum(matched_scores) / (len(matched_scores) * 4)) if matched_scores else 0.0), 3)

    if total > 1:
        sentiment = "positive"
    elif total < -1:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "sentiment": sentiment,
        "confidence": confidence,
        "tokens": token_scores,
        "model_version": version,
    }


@app.on_event("startup")
def startup():
    rebuild_rag_index({})


@app.get("/")
def root():
    return {"message": "Portfolio backend is running."}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/profile")
def profile():
    return PROFILE


@app.get("/api/projects")
def projects():
    return {"projects": PROJECTS}


@app.post("/api/sentiment/predict_full")
def predict_full(payload: SentimentPayload, version: str = Query(default="v1")):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text is required.")
    return analyze_sentiment(payload.text, version)


@app.get("/api/rag/health")
def rag_health():
    return get_rag_status()


@app.post("/api/rag/load_demo")
def rag_load_demo():
    rebuild_rag_index(DEMO_CORPUS)
    return {
        "status": "ok",
        "ingested_files": sorted(DEMO_CORPUS.keys()),
        "chunks_indexed": len(RAG_STATE["chunks"]),
    }


@app.post("/api/rag/ingest")
async def rag_ingest(files: List[UploadFile] = File(...)):
    updated_sources = dict(RAG_STATE["sources"])
    ingested_files = []

    for upload in files:
        raw = await upload.read()
        suffix = os.path.splitext(upload.filename or "")[1].lower()

        if suffix == ".pdf":
            text = (
                f"Uploaded PDF file named {upload.filename}. "
                "This lightweight demo stores PDF metadata but does not run full text extraction."
            )
        else:
            text = raw.decode("utf-8", errors="ignore").strip()

        if not text:
            text = f"Uploaded file {upload.filename} did not contain readable text for this lightweight demo."

        updated_sources[upload.filename] = text
        ingested_files.append(upload.filename)

    rebuild_rag_index(updated_sources)
    return {
        "status": "ok",
        "ingested_files": ingested_files,
        "chunks_indexed": len(RAG_STATE["chunks"]),
    }


@app.post("/api/rag/query")
def rag_query(payload: RagQueryPayload):
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query is required.")
    if not RAG_STATE["chunks"]:
        raise HTTPException(status_code=400, detail="No corpus indexed yet. Load the demo corpus first.")

    query_tokens = set(tokenize(payload.query))
    scored_contexts = []
    for chunk in RAG_STATE["chunks"]:
        score, semantic_score, lexical_score = score_chunk(query_tokens, chunk)
        if score <= 0:
            continue
        scored_contexts.append(
            {
                "chunk_id": chunk["chunk_id"],
                "source": chunk["source"],
                "preview": chunk["text"][:280],
                "score": score,
                "semantic_score": semantic_score,
                "lexical_score": lexical_score,
            }
        )

    scored_contexts.sort(key=lambda item: item["score"], reverse=True)
    contexts = scored_contexts[: max(1, payload.top_k)]

    return {
        "answer": build_answer(payload.query, contexts),
        "answer_mode": "demo-retrieval",
        "contexts": contexts,
        "retrieval": {
            "top_k": payload.top_k,
        },
    }
