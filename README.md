# RAG PDF Q&A

Upload a PDF, then ask questions about it. A FastAPI backend extracts and chunks the PDF, embeds the chunks, stores them in Chroma, and answers questions via a Groq-hosted LLM using retrieved context. A React + TypeScript frontend provides the upload and chat UI.

## Project structure

- [backend/](backend/) — FastAPI service: PDF extraction, chunking, embeddings, vector storage (Chroma), and answer generation (Groq).
- [frontend/](frontend/) — React + Vite + TypeScript UI for uploading PDFs and chatting with the indexed document.

## Setup

### Backend

```bash
cd backend
uv sync
cp .env.example .env   # set GROQ_API_KEY
uv run uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000` by default and allows CORS from `http://localhost:5173`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL if the backend isn't at the default
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

## API

- `POST /upload` — multipart form upload of a PDF. Extracts, chunks, embeds, and indexes the document.
- `POST /ask` — JSON body `{ "question": string }`. Retrieves relevant chunks and returns a generated `answer`.

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for more detail.
