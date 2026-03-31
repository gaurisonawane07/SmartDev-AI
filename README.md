# SmartDev AI Assistant

SmartDev AI Assistant is a full-stack developer workspace with:

- AI chat assistant
- Notes management
- In-browser coding playground
- Notes-grounded RAG (Retrieval-Augmented Generation)

The app uses a Next.js frontend and an Express + MongoDB backend.

## What Is New

This project now includes a working notes-based RAG pipeline:

- Notes are chunked and embedded locally.
- Embeddings are stored in MongoDB.
- User queries retrieve relevant note chunks.
- Retrieved context is injected into AI prompts.
- AI responses include user-friendly related note snippets.
- Existing users get automatic first-use RAG backfill.

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Groq SDK (LLM generation)
- @xenova/transformers (free local embeddings)
- JWT auth

## Architecture

```text
User -> Next.js UI -> Express API -> Groq (generation)
                           |
                           +-> MongoDB Notes
                           +-> MongoDB Note Chunks + Embeddings (RAG index)
```

## RAG Pipeline

### 1) Indexing (ingestion)

When notes are created or updated:

1. Note text is normalized and chunked.
2. Each chunk gets an embedding vector.
3. Chunks are saved in `NoteChunk` collection.

When notes are deleted:

- Associated chunks are removed from `NoteChunk`.

### 2) Retrieval (query time)

When user sends a message to AI:

1. Query is embedded.
2. Candidate chunks are loaded for that user.
3. Cosine similarity ranks chunks.
4. Top chunks are added to system context.

### 3) Generation

- Prompt includes system instructions + retrieved context.
- Groq model generates the final response.
- Response is stored in conversation history.

### 4) Backfill behavior

If a user has notes but no RAG chunks yet:

- On first AI request, backend auto-indexes existing notes.

## Key Files

### RAG Core

- `server/models/NoteChunk.js`
- `server/services/rag/chunking.service.js`
- `server/services/rag/embedding.service.js`
- `server/services/rag/retrieval.service.js`
- `server/services/rag/indexer.service.js`

### AI Flow

- `server/controllers/aiController.js`
- `server/services/ai.service.js`
- `server/models/AIRequest.js`

### Notes + Index Sync

- `server/controllers/noteController.js`

### Auth + API Client

- `client/middleware.ts`
- `client/lib/authToken.ts`
- `client/lib/api.ts`

### UI

- `client/app/dashboard/ai/page.tsx`
- `client/components/Sidebar.tsx`

## Request Limits

Current backend limits:

- Daily per-user limit: 50 AI requests/day
- Monthly per-user limit: 50 AI requests/month (existing logic)
- Route rate limiter: 30 requests per 15 minutes (AI route)

## Setup

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key

## 1) Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

## 2) Environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

# Optional RAG tuning
RAG_TOP_K=4
RAG_CANDIDATE_LIMIT=300
RAG_EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 3) Run app

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Authentication Notes

- Protected routes under `/dashboard` require auth cookie.
- Login/register pages are accessible even when signed in, so users can switch accounts.
- Token is synchronized between localStorage and cookie for stable client + middleware behavior.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User

- `GET /api/user/profile`
- `PUT /api/user/profile`

### Notes

- `POST /api/notes`
- `GET /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

### AI

- `POST /api/ai/generate`
- `GET /api/ai/history`
- `GET /api/ai/conversation/:id`
- `DELETE /api/ai/conversation/:id`
- `POST /api/ai/save-note`

## How To Verify RAG Works

1. Create a few notes in My Notes.
2. Open AI Assistant and ask note-specific questions, for example:
   - "Summarize my notes about Java."
   - "How many notes do I have and what are their titles?"
3. Confirm response includes relevant note information.
4. Confirm "Related Notes" appears under assistant responses.

## Troubleshooting

### AI says it has no note context

- Ensure backend is running.
- Ask one note-related question to trigger first-use RAG backfill.
- Create/update a note to force indexing.

### Not authorized, no token

- Log out and log back in.
- Ensure `NEXT_PUBLIC_API_URL` points to the running backend.

### Slow first note-aware response

- First embedding load can be slower while local model initializes.

## License

For personal or internal use. Add your preferred license before public distribution.
