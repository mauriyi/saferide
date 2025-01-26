from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from firebase_admin import auth
from firebase_data import FirebaseData
import jwt
from config import SECRET_KEY

auth_router = APIRouter()

firebase_data = FirebaseData()

class UserLogin(BaseModel):
    email: str
    password: str 

@auth_router.post("/login")
def login(user: UserLogin):
    """
    Autentica al usuario con Firebase y devuelve un token JWT.
    """
    try:
        firebase_user = auth.get_user_by_email(user.email)
        token = jwt.encode({"uid": firebase_user.uid}, SECRET_KEY, algorithm="HS256")
        return {"token": token, "uid": firebase_user.uid}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    