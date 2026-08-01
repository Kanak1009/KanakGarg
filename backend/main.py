"""
Kanak Garg — personal profile API.

Backs the "curl" terminal on the portfolio homepage. Returns the same data
that's hardcoded in the frontend as a fallback, so deploying this just makes
the terminal show live data instead of the bundled copy — nothing breaks
either way.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload

Deploy free on Render, Railway, or Fly.io — see README.md in this folder.
"""

from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Kanak Garg Profile API", version="1.0.0")

# Allow the portfolio site (and localhost, while developing) to call this API
# from the browser. Replace the production origin with your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://kanakgarg.dev",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "*",  # loosen for now; tighten once the site has a fixed domain
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}


@app.get("/api/v1/profile")
def profile():
    return {
        "name": "Kanak Garg",
        "role": "Backend Developer",
        "stack": ["Python", "FastAPI", "PostgreSQL"],
        "location": "Pune, India",
        "available_for_hire": True,
    }


@app.get("/api/v1/status")
def status():
    return {
        "endpoints_shipped": 20,
        "perf_improvement": "110%",
        "currently": "MSc Computer Science",
        "open_to_work": True,
        "last_updated": date.today().isoformat(),
    }
