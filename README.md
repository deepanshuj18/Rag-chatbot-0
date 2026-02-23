#  RAG Chatbot

A **Retrieval Augmented Generation (RAG)** chatbot built with FastAPI and powered by Google Gemini. Upload documents (PDF or TXT), and ask questions — the chatbot retrieves relevant context from your knowledge base and generates accurate, source-grounded answers.

## 🟢 Live Demo

> The chatbot answering real questions from an ingested PDF (`Wattmonk Information.pdf`), with **source citations** shown for every response.

![ RAG Chatbot - Live Demo](IMG_20250921_192610_930.jpg)

*Query: "location" → Response: "Headquarters: Delaware, USA. Global Presence: Services across all 50 US states, with teams in India and Singapore." — Source: Wattmonk Information.pdf*

🎥 **[Watch Full Demo Video](https://drive.google.com/file/d/1ma_agqJzPbiF7SAWlDkbNu0mfToG0rjq/view?usp=drivesdk)** — End-to-end walkthrough of document ingestion and live Q&A with source citations.

## My Role

I independently designed and implemented the full RAG pipeline including:

- **Embedding generation strategy** using Gemini `embedding-001` with task-type tuning for retrieval
- **Vector storage schema design** in ChromaDB with persistent local storage and metadata tracking
- **Chunking strategy optimization** — tuned chunk size and overlap for context preservation vs. embedding cost
- **Retrieval scoring calibration** — TOP_K tuning to balance context richness and token efficiency
- **Prompt engineering** for source-grounded generation that avoids hallucination
- **Async FastAPI endpoints** with structured Pydantic response models
- **CLI data ingestion tool** supporting PDF and TXT with per-file metadata tagging

This system was designed for production-readiness with a configurable, modular architecture and clean separation between ingestion, retrieval, and generation stages.

## Features

- 📄 **Document Ingestion** — Upload PDF or TXT files via API or CLI
- 🧠 **Google Gemini Embeddings** — Uses `models/embedding-001` for semantic search
- 💬 **Gemini-Powered Responses** — Uses `gemini-2.5-flash` for answer generation
- 🗃️ **ChromaDB Vector Storage** — Local persistent vector database
- 🔍 **RAG Pipeline** — Retrieves top-K relevant chunks before generating answers
- ⚡ **FastAPI Backend** — REST API with async support and CORS enabled

## Project Structure

```
wattmonk-chatbot/
├── Backend/
│   ├── main.py                  # FastAPI application & all API endpoints
│   ├── gemini_rag_chatbot.py    # Core RAG engine (ChromaDB + Gemini)
│   ├── add_data.py              # CLI tool for ingesting documents
│   ├── config.py                # Settings & environment variable management
│   ├── chroma_db_gemini/        # Persistent ChromaDB vector storage
│   └── requirements.txt         # Python dependencies
├── frontend/
│   └── rag-chatbot/             # React + Vite frontend
│       ├── src/
│       │   ├── App.jsx          # Main layout + API integration
│       │   ├── components/      # ChatWindow, MessageBubble, ChatInput
│       │   └── index.css        # Design tokens & global styles
│       └── package.json
├── requirements.txt             # Root-level dependencies
└── README.md
```

## Prerequisites

- Python 3.8+
- Node.js 18+
- Google Gemini API key — get one at [aistudio.google.com](https://aistudio.google.com)

## Installation

### Backend

1. **Clone the repository:**
   ```bash
   git clone https://github.com/deepanshuj18/wattmonk-chatbot.git
   ```

2. **Install backend dependencies:**
   ```bash
   cd wattmonk-chatbot/Backend
   pip install -r requirements.txt
   ```

3. **Create a `.env` file** in `Backend/`:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

### Frontend

4. **Install frontend dependencies:**
   ```bash
   cd ../frontend/rag-chatbot
   npm install
   ```

## Running the App

**Start the backend** (in `Backend/`):
```bash
uvicorn main:app --reload
```

**Start the frontend** (in `frontend/rag-chatbot/`):
```bash
npm run dev
```

The API will be available at `http://localhost:8000`.

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## API Endpoints

### `GET /`
Health check — confirms the API is running.

---

### `POST /add-text`
Add a piece of text directly to the knowledge base.

**Request body:**
```json
{
  "content": "WattMonk is a solar energy company specializing in permit design.",
  "metadata": { "source": "company_info" }
}
```

**Response:**
```json
{ "message": "Text added successfully", "document_id": "abc123" }
```

---

### `POST /add-file`
Upload a `.pdf` or `.txt` file to the knowledge base.

**Form data:** `file` (multipart upload)

**Response:**
```json
{ "message": "File 'report.pdf' processed successfully.", "document_id": "def456" }
```

---

### `POST /chat`
Send a query to the chatbot.

**Request body:**
```json
{
  "query": "What services does WattMonk offer?"
}
```

**Response:**
```json
{
  "query": "What services does WattMonk offer?",
  "response": "WattMonk offers permit design and solar energy services...",
  "retrieved_docs": [
    {
      "content": "...",
      "metadata": { "source_file": "company_info.pdf" },
      "distance": 0.12,
      "id": "chunk_001"
    }
  ]
}
```

---

### `GET /stats`
Get statistics about the current knowledge base.

**Response:**
```json
{ "total_chunks": 142 }
```

## Adding Data via CLI

Instead of the API, you can ingest documents directly from the command line:

```bash
# Add a PDF file
python add_data.py --file path/to/document.pdf --google-key YOUR_API_KEY

# Add a TXT file
python add_data.py --file path/to/notes.txt --google-key YOUR_API_KEY
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Request
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI (main.py)                      │
│           Async endpoints + CORS + Validation           │
└────┬───────────────────────────────────────────┬────────┘
     │                                           │
     ▼  POST /add-file or /add-text              ▼  POST /chat
┌──────────────┐                        ┌────────────────────┐
│  Ingestion   │                        │   RAG Pipeline     │
│  Pipeline    │                        │                    │
│              │                        │ 1. Embed query     │
│ 1. Extract   │                        │    (Gemini)        │
│    text      │                        │                    │
│ 2. Chunk     │                        │ 2. Retrieve top-K  │
│    (500c/50o)│                        │    (ChromaDB)      │
│ 3. Embed     │                        │                    │
│    chunks    │                        │ 3. Build prompt    │
│ 4. Store in  │                        │    with context    │
│    ChromaDB  │                        │                    │
└──────┬───────┘                        │ 4. Generate answer │
       │                                │    (Gemini Flash)  │
       ▼                                │                    │
┌──────────────┐                        │ 5. Return answer   │
│  ChromaDB    │◄───────────────────────│    + sources       │
│  (Vectors)   │                        └────────────────────┘
└──────────────┘
```

**Text chunking:** Documents are split into 500-character overlapping chunks (50-char overlap) before embedding and storage.

## Design Decisions & Tradeoffs

| Decision | Rationale |
|---|---|
| **ChromaDB over managed vector DBs** | Faster iteration, zero-config local setup, no network latency during development — easy to swap for Pinecone/Weaviate in production |
| **500-char chunk size, 50-char overlap** | Balances context preservation with embedding cost; small enough to retrieve precise chunks, large enough to retain sentence context |
| **TOP_K = 5** | Caps tokens fed into the generation stage, preventing context overflow while still covering multiple source perspectives |
| **Structured responses with `retrieved_docs`** | Full transparency into what the model used to answer — enables debugging, trust calibration, and source citation |
| **Async FastAPI endpoints** | Handles concurrent requests without blocking; critical for multi-user or integration scenarios |
| **MD5-based document IDs** | Deterministic deduplication — re-adding the same content overwrites cleanly without creating duplicates |
| **Task-type hint in embeddings** | Passing `task_type="retrieval_document"` to Gemini improves embedding quality for search use cases vs. generic embeddings |

## Configuration

| Variable | Default | Description |
|---|---|---|
| `GOOGLE_API_KEY` | *(required)* | Google Gemini API key |
| `CHUNK_SIZE` | `500` | Characters per text chunk |
| `CHUNK_OVERLAP` | `50` | Overlap between chunks |
| `TOP_K_RESULTS` | `5` | Number of chunks to retrieve per query |

## Tech Stack

| Component | Technology |
|---|---|
| Backend Framework | FastAPI |
| AI (Embeddings) | Google Gemini `embedding-001` |
| AI (Generation) | Google Gemini `gemini-2.5-flash` |
| Vector Database | ChromaDB (local persistent) |
| PDF Processing | PyMuPDF (fitz) |
| Server | Uvicorn |

## Scalability Considerations

- **Vector DB migration** — ChromaDB can be swapped for Pinecone, Weaviate, or Qdrant for distributed, cloud-scale deployments with minimal code changes
- **Batch embedding ingestion** — The embedding layer supports batched processing; bulk document ingestion can be parallelized with `asyncio.gather`
- **Containerization** — The API is stateless (beyond the vector store) and can be Dockerized and deployed behind a load balancer
- **Caching layer** — Frequently asked queries can be cached at the embedding or response level (e.g., Redis) to reduce API costs and latency
- **Namespace-based multi-tenancy** — ChromaDB collections support separate namespaces per user/project for data isolation
- **Streaming responses** — Gemini supports streaming; endpoints can be upgraded to Server-Sent Events for real-time answer delivery

## CORS

The API allows requests from `http://localhost:3000` and `http://127.0.0.1:3000` by default (for local frontend development).

## License

[MIT License](LICENSE)

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [Google Gemini](https://ai.google.dev/)
- [ChromaDB](https://www.trychroma.com/)
- [PyMuPDF](https://pymupdf.readthedocs.io/)
