from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    language = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    code_with_bug = Column(Text, nullable=False)
    fixed_code = Column(Text, nullable=False)
    tests = relationship("ProblemTest", backref="problem", cascade="all, delete")