# Profile API

Tiny FastAPI service that powers the "live" terminal on the portfolio
homepage. Two endpoints, both read-only:

- `GET /api/v1/profile`
- `GET /api/v1/status`

## Run locally

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit `http://127.0.0.1:8000/docs` to see it working.

## Deploy for free (pick one)

**Render**
1. Push this `backend/` folder to a GitHub repo (or a subfolder of your portfolio repo).
2. On [render.com](https://render.com) → New → Web Service → connect the repo.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy. You'll get a URL like `https://kanak-profile-api.onrender.com`.

**Railway**
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo.
2. Railway auto-detects the `Procfile`/Python app; set the start command to
   `uvicorn main:app --host 0.0.0.0 --port $PORT` if it asks.

**Fly.io**
1. `fly launch` inside this folder (it'll generate a `fly.toml`).
2. `fly deploy`.

## Wire it up to the frontend

Once deployed, open `script.js` in the portfolio root and change:

```js
const API_BASE = 'https://api.kanakgarg.dev';
```

to your actual deployed URL. The terminal will automatically start showing
`live` (green dot) instead of `cached` (amber dot) — no other changes needed.

## Note on free tiers

Render's free tier spins down after inactivity, so the first request after
a while can take 20–30 seconds — the frontend's 2.5s timeout will fall back
to cached data in that case, then pick up "live" on the next visit once the
service is warm. That's expected, not a bug.
