from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models.user import User
from app.config import SECRET_KEY, ALGORITHM

# -------------------------------------
# JWT
# -------------------------------------
ACCESS_TOKEN_EXPIRE_MINUTES = 12 

# -------------------------------------
# bcrypt
# -------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)

# -------------------------------------
# JWT
# -------------------------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# -------------------------------------
# DB dependency
# -------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------------
# -------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# -------------------------------------
# Get current user from token
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db)
):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
