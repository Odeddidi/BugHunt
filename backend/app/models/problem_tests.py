import sqlalchemy
from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class ProblemTest(Base):
    __tablename__ = "problem_tests"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    input = Column(String, nullable=True)
    expected_output = Column(String, nullable=False)