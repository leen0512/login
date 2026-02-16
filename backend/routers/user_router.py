from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user_model import User
from passlib.context import CryptContext
from jose import jwt

router = APIRouter()
SECRET_KEY = "mysecret"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    if len(password.encode('utf-8')) > 72:
        raise HTTPException(status_code=400, detail="Password too long (max 72 bytes)")
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if len(plain_password.encode('utf-8')) > 72:
        plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register")
def register(email: str, username: str, password: str, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    existing_username = db.query(User).filter(User.username == username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        email=email,
        username=username,
        password=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": f"User {username} registered successfully"}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    # Find user by username instead of email
    user = db.query(User).filter(User.username == username).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Include username in the token payload
    access_token = jwt.encode(
        {"username": user.username, "email": user.email, "role": user.role}, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )
    refresh_token = jwt.encode(
        {"username": user.username, "email": user.email}, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )

    return {
        "access_token": access_token, 
        "refresh_token": refresh_token, 
        "role": user.role,
        "username": user.username,
        "email": user.email
    }