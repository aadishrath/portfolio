import os
import re
from io import BytesIO
from typing import List, Optional

import fitz
import numpy as np
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
from pypdf import PdfReader
from rapidocr_onnxruntime import RapidOCR


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

OCR_ENGINE = None


class SentimentPayload(BaseModel):
    text: str


class RagQueryPayload(BaseModel):
    query: str
    top_k: int = 4


class ChatTurn(BaseModel):
    role: str
    text: str


class ChatbotPayload(BaseModel):
    query: str
    pathname: str = "/"
    history: List[ChatTurn] = []


def tokenize(text: str) -> List[str]:
    return [match.group(0).lower() for match in TOKEN_RE.finditer(text)]


def compact_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def normalize_chat_text(text: str) -> str:
    return compact_whitespace(text.lower())


def create_portfolio_documents():
    documents = [
        {
            "id": "profile",
            "title": "Aadish Profile",
            "category": "profile",
            "path": "/",
            "source_label": "Profile summary",
            "href": "/",
            "text": (
                "Aadish Rathore is a Machine Learning Engineer with a frontend engineering background. "
                "He has an M.S. in Data Science and works across NLP, LLM fine-tuning, model deployment, "
                "and user-facing product development. He is currently seeking ML Engineer or Data Engineer roles."
            ),
        },
        {
            "id": "about",
            "title": "About Aadish",
            "category": "profile",
            "path": "/",
            "source_label": "About section",
            "href": "/",
            "text": (
                "Aadish works across Python, SQL, PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, "
                "MLflow, Airflow, AWS Lambda, EC2, and S3. He enjoys building reliable ML systems and recruiter-friendly demos."
            ),
        },
        {
            "id": "contact",
            "title": "Contact and Resume",
            "category": "contact",
            "path": "/",
            "source_label": "Footer contact links",
            "href": "/AadishRathore.pdf",
            "text": (
                "Aadish can be reached on LinkedIn at https://www.linkedin.com/in/adirathore/ and on GitHub at "
                "https://github.com/aadishrath. The resume is available at /AadishRathore.pdf."
            ),
        },
        {
            "id": "skills",
            "title": "Skills and Tools",
            "category": "skills",
            "path": "/",
            "source_label": "Languages and tools",
            "href": "/",
            "text": (
                "Skills include React 19, Angular 17, FastAPI, Python, RAG pipelines, Sentence Transformers, FAISS, "
                "PyTorch, TensorFlow, pypdf, PDF ingestion, REST APIs, PostgreSQL, and GitHub."
            ),
        },
        {
            "id": "rag-demo",
            "title": "Interactive RAG Assistant",
            "category": "project",
            "path": "/rag",
            "source_label": "RAG demo",
            "href": "/rag",
            "text": (
                "The RAG demo is a portfolio-native retrieval assistant with upload flows, corpus inspection, "
                "grounded answers, retrieval diagnostics, and PDF ingestion with OCR fallback for scanned files."
            ),
        },
        {
            "id": "sentiment-demo",
            "title": "Sentiment Analysis Demo",
            "category": "project",
            "path": "/sentiment",
            "source_label": "Sentiment demo",
            "href": "/sentiment",
            "text": (
                "The sentiment demo compares an in-browser Pyodide model with a backend FastAPI model. "
                "It shows model labels, confidence, token highlights, and a comparison view."
            ),
        },
        {
            "id": "featured-projects",
            "title": "Featured Projects",
            "category": "project",
            "path": "/projects",
            "source_label": "Projects pages",
            "href": "/projects",
            "text": (
                "Featured projects include the Interactive RAG Assistant, Sentiment Analysis Platform, "
                "House Price Prediction, and frontend portfolio work. These projects highlight ML systems, "
                "deployment, API design, and polished UI implementation."
            ),
        },
        {
            "id": "navigation",
            "title": "Site Navigation",
            "category": "navigation",
            "path": "/",
            "source_label": "Navigation",
            "href": "/",
            "text": (
                "The site includes Home, ML Projects, Frontend Projects, Sentiment Demo, RAG Demo, "
                "and a footer contact section."
            ),
        },
    ]

    for document in documents:
        document["normalized"] = normalize_chat_text(document["text"])
        document["tokens"] = tokenize(document["text"])
    return documents


CHATBOT_DOCUMENTS = create_portfolio_documents()
CHATBOT_BLOCKLIST = {"latest", "today", "weather", "stock", "price", "breaking", "news", "president", "ceo"}


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


def extract_pdf_text(raw: bytes, filename: str) -> str:
    try:
        reader = PdfReader(BytesIO(raw))
    except Exception:
        return f"Uploaded PDF file named {filename}, but text extraction failed for this document."

    pages = []
    for page_number, page in enumerate(reader.pages, start=1):
        try:
            extracted = (page.extract_text() or "").strip()
        except Exception:
            extracted = ""

        if extracted:
            pages.append(f"Page {page_number}\n{extracted}")

    if not pages:
        ocr_text = extract_pdf_text_with_ocr(raw, filename)
        if ocr_text:
            return ocr_text
        return (
            f"Uploaded PDF file named {filename}, but no readable text was found. "
            "This can happen with image-only or scanned PDFs."
        )

    return "\n\n".join(pages)


def get_ocr_engine():
    global OCR_ENGINE
    if OCR_ENGINE is None:
        OCR_ENGINE = RapidOCR()
    return OCR_ENGINE


def extract_pdf_text_with_ocr(raw: bytes, filename: str) -> str:
    try:
        document = fitz.open(stream=raw, filetype="pdf")
    except Exception:
        return ""

    ocr_pages = []
    engine = get_ocr_engine()

    for page_number in range(len(document)):
        try:
            page = document.load_page(page_number)
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            image = Image.open(BytesIO(pixmap.tobytes("png")))
            result, _ = engine(np.array(image))
        except Exception:
            continue

        if not result:
            continue

        lines = []
        for item in result:
            if len(item) >= 2:
                text = str(item[1]).strip()
                if text:
                    lines.append(text)

        if lines:
            ocr_pages.append(f"Page {page_number + 1}\n" + "\n".join(lines))

    if not ocr_pages:
        return ""

    return "\n\n".join(ocr_pages)


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


def score_chatbot_document(query_tokens: set, query_lower: str, pathname: str, doc: dict) -> int:
    score = 0

    for token in query_tokens:
        if token in doc["tokens"]:
            score += 3
        if token in doc["title"].lower():
            score += 4

    if query_lower in doc["normalized"]:
        score += 8

    if pathname and pathname == doc["path"]:
        score += 4

    if doc["category"] == "profile" and re.search(r"\baadish\b|\bbackground\b|\bexperience\b|\bwho\b|\babout\b", query_lower):
        score += 12

    if doc["category"] == "contact" and re.search(r"\bresume\b|\bcontact\b|\blinkedin\b|\bgithub\b|\bemail\b", query_lower):
        score += 12

    if doc["category"] == "skills" and re.search(r"\bskills\b|\btools\b|\bstack\b|\btechnology\b", query_lower):
        score += 10

    if doc["id"] == "rag-demo" and re.search(r"\brag\b|\bretrieval\b|\bupload\b|\bpdf\b|\bcorpus\b", query_lower):
        score += 10

    if doc["id"] == "sentiment-demo" and re.search(r"\bsentiment\b|\bmodel\b|\bconfidence\b|\bpyodide\b", query_lower):
        score += 10

    if doc["id"] == "featured-projects" and re.search(r"\bprojects\b|\bportfolio\b|\bfeatured\b|\brecruiter\b", query_lower):
        score += 9

    return score


def get_top_chatbot_documents(query: str, pathname: str) -> List[dict]:
    query_lower = normalize_chat_text(query)
    query_tokens = set(tokenize(query))
    ranked = []

    for doc in CHATBOT_DOCUMENTS:
        score = score_chatbot_document(query_tokens, query_lower, pathname, doc)
        if score > 0:
            ranked.append({**doc, "score": score})

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return ranked[:3]


def format_chatbot_sources(matches: List[dict]) -> List[dict]:
    return [
        {
            "label": match["source_label"],
            "href": match.get("href"),
        }
        for match in matches
    ]


def answer_profile_question() -> str:
    return (
        "Aadish Rathore is a Machine Learning Engineer with a strong frontend engineering background. "
        "He has an M.S. in Data Science and focuses on NLP, LLM workflows, model deployment, and polished user-facing products. "
        "He is currently looking for ML Engineer or Data Engineer roles."
    )


def answer_contact_question() -> str:
    return (
        "You can reach Aadish through LinkedIn at https://www.linkedin.com/in/adirathore/, "
        "GitHub at https://github.com/aadishrath, or by opening the resume at /AadishRathore.pdf."
    )


def answer_skills_question() -> str:
    return (
        "Aadish's core stack includes Python, FastAPI, React, Angular, PyTorch, TensorFlow, RAG pipelines, "
        "Sentence Transformers, FAISS, REST APIs, and deployment work across Vercel and Render."
    )


def answer_projects_question() -> str:
    return (
        "The strongest portfolio projects to start with are the Interactive RAG Assistant, the Sentiment Analysis demo, "
        "and the broader ML project set. Together they show retrieval systems, API-backed ML UX, and end-to-end product thinking."
    )


def answer_route_question(pathname: str) -> Optional[str]:
    if pathname == "/rag":
        return "This page is the RAG demo. You can load the demo corpus, upload files, inspect corpus status, and ask grounded questions over the indexed content."
    if pathname == "/sentiment":
        return "This page compares an in-browser sentiment model with a backend FastAPI sentiment model and shows how their outputs line up."
    if pathname == "/projects":
        return "This page highlights Aadish's machine learning projects and why they matter from a recruiter and product perspective."
    if pathname == "/frontend":
        return "This page highlights frontend-focused projects and polished web work."
    if pathname == "/":
        return "This is the home page, where you can get Aadish's profile summary, skills overview, and navigation into the demos and project pages."
    return None


def generate_chatbot_answer(query: str, pathname: str, history: List[ChatTurn]) -> dict:
    normalized_query = normalize_chat_text(query)

    if not normalized_query:
        return {
            "text": "Ask about Aadish or how to use one of the demos.",
            "sources": [],
        }

    if any(term in normalized_query for term in CHATBOT_BLOCKLIST):
        return {
            "text": "I stay grounded in the portfolio content, so I’m not the right source for time-sensitive world information. Ask me about Aadish, the projects, the resume, or the demos instead.",
            "sources": [],
        }

    if re.search(r"\bcurrent page\b|\bthis page\b|\bwhere am i\b", normalized_query):
        route_answer = answer_route_question(pathname)
        return {
            "text": route_answer or "I can help with the current page, the portfolio sections, or Aadish's background and projects.",
            "sources": [{"label": "Current page", "href": pathname}] if route_answer else [],
        }

    if re.search(r"\btell me about aadish\b|\bwho is aadish\b|\bwho are you\b|\babout aadish\b|\babout you\b|\bbackground\b|\bexperience\b", normalized_query):
        return {
            "text": answer_profile_question(),
            "sources": [{"label": "Profile summary", "href": "/"}],
        }

    if re.search(r"\bcontact\b|\bresume\b|\blinkedin\b|\bgithub\b|\bemail\b", normalized_query):
        return {
            "text": answer_contact_question(),
            "sources": [{"label": "Footer contact links", "href": "/AadishRathore.pdf"}],
        }

    if re.search(r"\bskills\b|\btools\b|\bstack\b|\btechnology\b", normalized_query):
        return {
            "text": answer_skills_question(),
            "sources": [{"label": "Languages and tools", "href": "/"}],
        }

    if re.search(r"\bprojects\b|\brecruiter\b|\bfeatured\b", normalized_query):
        return {
            "text": answer_projects_question(),
            "sources": [{"label": "Projects pages", "href": "/projects"}],
        }

    if history:
        recent_user_turns = " ".join(turn.text for turn in history[-3:] if turn.role == "user").lower()
        if "resume" in recent_user_turns and re.search(r"\bwhere\b|\bfind\b|\bopen\b", normalized_query):
            return {
                "text": answer_contact_question(),
                "sources": [{"label": "Footer contact links", "href": "/AadishRathore.pdf"}],
            }

    matches = get_top_chatbot_documents(query, pathname)
    if matches:
        top = matches[0]
        answer = top["text"]

        if top["category"] == "project":
            answer = f"The best match from the portfolio is {top['title']}. {top['text']}"
        elif top["category"] == "navigation":
            answer = f"{top['text']} I can also help you jump to the most relevant page for what you're trying to learn."

        return {
            "text": answer,
            "sources": format_chatbot_sources(matches),
        }

    return {
        "text": "I couldn't ground that confidently in the portfolio. Try asking about Aadish's background, a project, the resume, skills, or how one of the demos works.",
        "sources": [],
    }


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


@app.post("/api/chatbot/query")
def chatbot_query(payload: ChatbotPayload):
    return generate_chatbot_answer(payload.query, payload.pathname, payload.history)


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
            text = extract_pdf_text(raw, upload.filename)
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
