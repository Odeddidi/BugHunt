from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from app.database import Base

class UserMatch(Base):
    __tablename__ = "user_matches"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer)
    opponent_name = Column(String)
    winner = Column(Boolean, nullable=True)      # None = draw
    rounds_won = Column(Integer)
    rounds_lost = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
