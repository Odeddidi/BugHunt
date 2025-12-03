from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base  # שים לב לנתיב הנכון!

class ActiveProblem(Base):
    __tablename__ = "active_problems"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    winner_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    round_number = Column(Integer, default=1)

    # relationships
    room = relationship("Room", back_populates="active_problems")
    problem = relationship("Problem")
