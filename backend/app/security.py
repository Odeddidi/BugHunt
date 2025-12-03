from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models.user import User
from app.config import SECRET_KEY, ALGORITHM

# -------------------------------------
# הגדרות JWT
# -------------------------------------
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # שבוע

# -------------------------------------
# הצפנת סיסמאות עם bcrypt
# -------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    """מקבל סיסמה רגילה ומחזיר גרסה מוצפנת"""
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str):
    """בודק האם סיסמה רגילה תואמת ל-hash שנשמר ב-DB"""
    return pwd_context.verify(password, hashed_password)

# -------------------------------------
# יצירת JWT
# -------------------------------------
def create_access_token(data: dict):
    """מקבל dict (לרוב: {'sub': user_id}) ומייצר JWT חתום"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# -------------------------------------
# DB dependency (לקבלת session בכל בדיקה)
# -------------------------------------
def get_db():
    """יוצר session למסד הנתונים ומחזיר אותו ל-FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------------
# OAuth2 schema (שליפה אוטומטית של הטוקן מה-Headers)
# -------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# -------------------------------------
# הפונקציה החשובה ביותר:
# בודקת שהטוקן תקף ומחזירה את המשתמש שחתום על הטוקן
# -------------------------------------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db=Depends(get_db)
):
    """
    1. שולף את ה-token מה-Header
    2. פותח ומאמת את ה-JWT
    3. מוציא ממנו user_id
    4. מחפש את המשתמש ב-DB
    5. מחזיר אותו
    """

    try:
        # פיענוח הטוקן
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # חיפוש המשתמש במסד נתונים
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
