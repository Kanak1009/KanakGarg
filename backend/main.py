
from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Kanak Garg Profile API", version="1.0.0")

# Allow only the real portfolio site (and localhost, while developing) to
# call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://kanak1009.github.io",
        "http://localhost:3000",
        "http://127.0.0.1:5500",
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
