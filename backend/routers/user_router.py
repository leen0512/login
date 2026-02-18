from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services.user_service import (
    get_db,
    register_user,
    authenticate_user,
    create_access_token,
    get_current_user,
    require_admin
)
from schemas.user_schema import RegisterSchema, LoginSchema
from models.user_model import User

router = APIRouter()

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    user = register_user(data.email, data.username, data.password, db)
    return {"message": f"User {user.username} registered successfully"}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = authenticate_user(data.username, data.password, db)
    access_token = create_access_token(user)
    return {
        "access_token": access_token,
        "role": user.role,
        "username": user.username,
        "email": user.email
    }

@router.get("/protected")
def protected_route(user: User = Depends(get_current_user)):
    return {"message": f"Hello {user.username}"}

@router.get("/admin")
def admin_route(user: User = Depends(require_admin)):
    return {"message": "Welcome admin"}
