# RAG PDF Q&A — Frontend

React + TypeScript frontend (Vite, Tailwind CSS v4) for the FastAPI RAG PDF Q&A backend in `../backend`.

## Flow

1. Upload a PDF (`POST /upload`, multipart form data). Shows a loading state while the backend chunks and indexes the document.
2. Once indexed, the chat UI appears. Each question is sent to `POST /ask` and the answer is appended to a scrollable conversation list.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if the backend isn't at the default
npm run dev
```

The backend must be running (default `http://127.0.0.1:8000`) with CORS allowing `http://localhost:5173`.

## Environment variables

- `VITE_API_BASE_URL` — base URL of the FastAPI backend. See `.env.example`.
