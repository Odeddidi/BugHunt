from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from datetime import datetime
from app.database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    
    status = Column(String, default="waiting")  
    # waiting – מחכים לשחקן שני
    # playing – משחק פעיל
    # finished – המשחק הסתיים

    invite_code = Column(String, unique=True, nullable=True)
    current_round = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    active_problems = relationship("ActiveProblem", back_populates="room")
    players = relationship("RoomPlayer", back_populates="room")


