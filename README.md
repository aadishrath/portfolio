# Aadish Portfolio

A full-stack portfolio platform built to showcase frontend engineering, applied ML, and recruiter-friendly product thinking in one deployable project.

This version moves the site beyond a static GitHub Pages portfolio into a split architecture:

- `frontend/` is a React 19 + Vite app deployed to Vercel
- `backend/` is a FastAPI service deployed to Render

The result is a portfolio that feels like a product, not just a page. It includes interactive demos, a site chatbot, backend-powered project experiences, and deployment patterns that mirror real production workflows.

## Overview

This project is designed to present both engineering range and product judgment. Instead of only listing projects, the site lets visitors explore live demos and interact with systems that reflect the kinds of work I want to do professionally.

Current experience includes:

- A portfolio homepage with profile, skills, projects, and contact flows
- Routed project pages for machine learning and frontend work
- A sentiment analysis demo comparing browser-based and backend-based inference
- A RAG-style document assistant with upload, ingestion, querying, and source inspection
- A site chatbot that answers questions about the portfolio itself
- Separate frontend and backend deployments for cleaner scaling and operations

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- React Icons
- React Markdown

### Backend

- FastAPI
- Uvicorn
- NumPy
- PyMuPDF
- pypdf
- Pillow
- RapidOCR ONNX Runtime

### Deployment

- Vercel for the frontend
- Render for the backend

## Project Structure

```text
portfolio/
|-- frontend/   # React + Vite client
`-- backend/    # FastAPI API
```

## Key Features

### Portfolio as a Product

The site is structured like a real application instead of a static resume page. Navigation, routing, loading states, interactive components, and backend-backed features are all part of the experience.

### Interactive Sentiment Demo

The sentiment page is built to show applied NLP in a way that is easy for recruiters and hiring managers to understand. It compares lightweight client-side inference with a backend API workflow and makes model output visible in the UI.

### RAG-Inspired Document Assistant

The RAG experience lets users load content, inspect indexed sources, and ask grounded questions against uploaded documents. It is meant to communicate retrieval, ingestion, and answer-tracing concepts in a portfolio-friendly format.

### Recruiter-Friendly Architecture

The monorepo cleanly separates presentation and API concerns:

- `frontend/` focuses on user experience and deployment to Vercel
- `backend/` handles content, ML demos, OCR, and API routes on Render

This keeps the system simple to reason about while still showing end-to-end deployment skills.

## Running Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects `VITE_API_URL` in `frontend/.env.local`.

Example:

```env
VITE_API_URL=http://localhost:8000
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

The backend reads:

- `FRONTEND_ORIGIN`
- `PORT`

Example:

```env
FRONTEND_ORIGIN=http://localhost:5173
```

## Deployment

### Vercel

- Import the repo into Vercel
- Set the root directory to `frontend`
- Use the `Vite` framework preset
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://<your-render-service>.onrender.com`

### Render

- Create a new Web Service from the repo
- Set the root directory to `backend`
- Runtime: `Python`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Add `FRONTEND_ORIGIN=https://<your-vercel-app>.vercel.app`

Python is pinned in the backend so Render uses a compatible version for OCR-related dependencies.

## Recommended Deploy Order

1. Deploy the backend on Render.
2. Copy the Render URL into `VITE_API_URL` on Vercel.
3. Deploy the frontend on Vercel.
4. Copy the Vercel URL into `FRONTEND_ORIGIN` on Render.
5. Redeploy the backend so CORS and frontend origin settings are aligned.

## Why This Project Exists

I wanted the portfolio itself to demonstrate the kind of engineering work I'm interested in: practical machine learning, modern frontend development, API design, and shipping polished user-facing systems.

Instead of treating the portfolio as a static destination, this project treats it as a small platform that can evolve with new demos, new tooling, and new product ideas over time.
