STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "for",
    "from",
    "has",
    "have",
    "how",
    "in",
    "into",
    "is",
    "it",
    "its",
    "of",
    "on",
    "or",
    "that",
    "the",
    "their",
    "this",
    "to",
    "using",
    "what",
    "when",
    "where",
    "which",
    "with",
    "your",
}

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
