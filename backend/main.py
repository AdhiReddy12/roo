from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import FRONTEND_ORIGIN
from database import create_indexes
from routes.auth import router as auth_router
from routes.workouts import router as workouts_router
from routes.meals import router as meals_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_indexes()
    print("✅ Database indexes created")
    yield
    # Shutdown
    print("👋 Shutting down Iron Pulse API")


app = FastAPI(
    title="Iron Pulse API",
    description="AI-Powered Fitness Companion — Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(workouts_router)
app.include_router(meals_router)


@app.get("/")
async def root():
    return {"message": "Iron Pulse API is running 🔥"}
