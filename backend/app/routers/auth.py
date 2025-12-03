from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.security import hash_password, create_access_token, verify_password,get_current_user

from app.database import SessionLocal
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # check if exists user with same username
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")


    hashed = hash_password(user.password)
    new_user = User(username=user.username, password_hash=hashed,email=user.email)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "registered successfully", "username": new_user.username}
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": str(db_user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": db_user.username,
        "score": db_user.score,
        "user_id": db_user.id,
        "is_admin": db_user.is_admin
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user