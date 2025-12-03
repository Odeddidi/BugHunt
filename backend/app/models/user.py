from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    score = Column(Integer, default=0)
    is_admin = Column(Boolean, default=False)  # False = regular user, True = admin 
    email = Column(String, unique=True, index=True, nullable=False  )
    # is_verified = Column(Boolean, default=False)
   # verification_token = Column(String, nullable=True)

   # reset_token = Column(String, nullable=True)
   # reset_token_expires = Column(DateTime, nullable=True)

   # created_at = Column(DateTime, default=datetime.utcnow)