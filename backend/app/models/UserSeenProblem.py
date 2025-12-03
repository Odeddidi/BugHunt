from sqlalchemy import Column, Integer, DateTime
from datetime import datetime
from app.database import Base


class UserSeenProblem(Base):
    __tablename__ = "user_seen_problem"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    problem_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
