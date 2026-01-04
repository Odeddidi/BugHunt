
# BugHunt

BugHunt is a competitive “fix-the-bug” coding game.

- **Single-player**: solve bug-fix challenges in your browser.
- **Multiplayer**: get matched into a room and race an opponent to submit the correct fix first.
- **Real-time**: multiplayer gameplay is powered by WebSockets.

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Code editor: `@uiw/react-codemirror`

**Backend**
- FastAPI
- WebSockets (FastAPI)
- SQLAlchemy
- JWT auth (`python-jose`)

**Database**
- PostgreSQL (via `psycopg2-binary`, configured through `DATABASE_URL`)

## Repository Structure

```
backend/   # FastAPI API + WebSocket server
frontend/  # React (Vite) client
```

## Features

- Authentication (JWT)
- Problem library (bugged snippets + metadata)
- Single-player practice
- Multiplayer matchmaking + private invites
- Room-based gameplay with rounds and scoring
- Code submission + server-side verification

## Local Development

### Prerequisites

- Node.js (Vite 7 works best on modern Node; Node 20+ is recommended)
- Python 3.10+
- A PostgreSQL database (local or remote)

---

## Backend (FastAPI)

### 1) Configure environment variables

The backend reads:

- `DATABASE_URL` (required)
- `SECRET_KEY` (optional; defaults to `CHANGEME`)

Example:

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@localhost:5432/bughunt'
export SECRET_KEY='replace-with-a-long-random-string'
```

### 2) Install dependencies

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3) Run the API

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Sanity check:

- `GET http://localhost:8000/` should return `{"message":"BugHunt Backend Running!"}`

### Optional: Run the backend with Docker

```bash
cd backend
docker build -t bughunt-backend .
docker run --rm -p 8000:8000 \
	-e DATABASE_URL='postgresql://USER:PASSWORD@host.docker.internal:5432/bughunt' \
	-e SECRET_KEY='replace-with-a-long-random-string' \
	bughunt-backend
```

> Note: your database must be reachable from the container.

---

## Frontend (Vite + React)

### 1) Configure environment variables

The frontend uses Vite env vars:

- `VITE_API_URL`
- `VITE_WS_URL`

There is already a `frontend/.env` in this repo; adjust it if you’re running locally.

Example for local backend:

```dotenv
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### 2) Install & run

```bash
cd frontend
npm install
npm run dev
```

Open:

- `http://localhost:5173`

### Build

```bash
cd frontend
npm run build
npm run preview
```

## Gameplay Notes

- Multiplayer rooms are served over WebSockets (`/ws/...`).
- The client joins a room at a route like `/room/:roomId` and communicates with the backend WebSocket endpoint.

## Troubleshooting

- **Database errors on backend start**: make sure `DATABASE_URL` is set and points to a reachable PostgreSQL instance.
- **Frontend can’t reach backend**: verify `VITE_API_URL` and `VITE_WS_URL` match your backend host/port.
- **WebSocket issues**: ensure you’re using `ws://` locally and `wss://` behind HTTPS.

## License

No license specified.

