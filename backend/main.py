from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.user_router import router as user_router

app = FastAPI(title="Backend Connected to Existing DB")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(user_router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "Backend connected to existing database!"}