# PaperWise

PaperWise is a local-first document question-answering app. Upload documents, ask questions, and inspect the source passages behind each answer in a Next.js interface.

## Frontend and AI Experience

- Upload PDF, DOCX, Markdown, and plain-text files into named collections.
- Follow queued, processing, ready, and failed document states while background ingestion runs.
- Ask questions and inspect cited documents, page numbers where available, and supporting passages alongside answers.
- Filter the document library by name or collection, remove documents, and retain recent chat history in the browser.
- Show when evidence is too weak to support an answer rather than presenting an unsupported response.

## Retrieval and Processing

- Extract document text, optionally apply OCR to scanned PDFs, and split content into overlapping passages.
- Generate local embeddings and answers with Ollama.
- Combine PostgreSQL full-text search with pgvector similarity search to retrieve and rank relevant passages.
- Validate citation IDs against retrieved passages and prevent duplicate uploads using content hashes.
- Process document ingestion in a Redis/Celery worker and store original files for re-indexing.

## Tech Stack

Next.js, React, TypeScript, Python, FastAPI, Pydantic, Ollama, PostgreSQL, pgvector, Redis, Celery, PyMuPDF, python-docx, and Docker Compose.

## Quality and Scope

The project includes automated backend tests, PostgreSQL/pgvector integration checks, frontend type and build checks, GitHub Actions, and a repeatable sample evaluation for retrieval and citations.

With the included local stack, uploaded files, extracted text, embeddings, and model calls remain on your computer. PaperWise is currently designed for local use without user accounts or multi-user isolation. Citations make answers easier to inspect; they do not guarantee that every generated claim is correct.

## Repository

[Explore PaperWise on GitHub](https://github.com/aadishrath/paperWise)
