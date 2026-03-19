from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from seed import seed_database

# Import all routers
from routers import (
    auth_router,
    user_router,
    energy_router,
    marketplace_router,
    transactions_router,
    wallet_router,
    solar_router,
    statistics_router,
)

# ─── Create FastAPI App ───
app = FastAPI(
    title="MaitriGrid API",
    description="P2P Energy Trading Platform – Backend API",
    version="1.0.0",
)

# ─── CORS (allow React Native / Expo to connect) ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include Routers ───
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(energy_router.router)
app.include_router(marketplace_router.router)
app.include_router(transactions_router.router)
app.include_router(wallet_router.router)
app.include_router(solar_router.router)
app.include_router(statistics_router.router)


# ─── Startup: Create Tables & Seed ───
@app.on_event("startup")
def on_startup():
    """Create all database tables and seed demo data on first run."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


# ─── Root Endpoint ───
@app.get("/", tags=["Health"])
def root():
    return {
        "app": "MaitriGrid API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }
