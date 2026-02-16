from fastapi import FastAPI
from routers.user_router import router as user_router

app = FastAPI(title="Backend Connected to Existing DB")
app.include_router(user_router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "Backend connected to existing database!"}
