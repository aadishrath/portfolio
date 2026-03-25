import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def get_allowed_origins():
    configured = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    return [origin.strip() for origin in configured.split(",") if origin.strip()]


app = FastAPI(
    title="Aadish Portfolio API",
    version="0.1.0",
    description="Backend API for the Vercel-hosted portfolio frontend."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


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
        "summary": "A lightweight NLP project focused on text classification workflows and model iteration.",
        "stack": ["Python", "scikit-learn", "NLP"],
        "href": "https://github.com/aadishrath"
    },
    {
        "id": "ml-rag",
        "title": "RAG Playground",
        "summary": "An experimentation space for retrieval, embeddings, and response generation patterns.",
        "stack": ["FastAPI", "RAG", "Vector Search"],
        "href": "https://github.com/aadishrath"
    },
    {
        "id": "portfolio",
        "title": "Portfolio Platform",
        "summary": "A personal site rebuilt as a split frontend/backend deployment for free-tier hosting.",
        "stack": ["React", "Vite", "FastAPI", "Vercel", "Render"],
        "href": "https://github.com/aadishrath/portfolio"
    }
]


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
