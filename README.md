# Portfolio Monorepo

This project is split into:

- `frontend/` -> React + Vite frontend for Vercel
- `backend/` -> FastAPI backend for Render

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects `VITE_API_URL` in `frontend/.env.local`.

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

## Deploy

### Vercel

- Import the repo
- Set the root directory to `frontend`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://<your-render-service>.onrender.com`

### Render

- Create a new Web Service from the repo
- Set the root directory to `backend`
- Runtime: `Python 3`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Add `FRONTEND_ORIGIN=https://<your-vercel-app>.vercel.app`

## Recommended deploy order

1. Deploy the backend on Render.
2. Copy the Render URL into `VITE_API_URL` on Vercel.
3. Deploy the frontend on Vercel.
4. Copy the Vercel URL into `FRONTEND_ORIGIN` on Render.
5. Redeploy the backend once so CORS is aligned.
