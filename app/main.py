from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongodb, close_mongodb_connection
from app.api.routes import transactions, thresholds, ocr

app = FastAPI(title="Petty Cash Tracker")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongodb()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongodb_connection()

# Include routers
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(thresholds.router, prefix="/api/thresholds", tags=["thresholds"])
app.include_router(ocr.router, prefix="/api/ocr", tags=["ocr"])