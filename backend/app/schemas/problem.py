from pydantic import BaseModel
from typing import List

class ProblemTestCreate(BaseModel):
    input: str | None = ""   # אם אין input
    expected_output: str


class ProblemBase(BaseModel):
    title: str
    description: str | None = None
    language: str
    difficulty: str
    code_with_bug: str
    fixed_code: str
    tests: List[ProblemTestCreate]

class ProblemCreate(ProblemBase):
    pass

class ProblemResponse(ProblemBase):
    id: int

    class Config:
        from_attributes = True
class SubmitRequest(BaseModel):
    problem_id: int
    solution: str
class SubmitResponse(BaseModel):
    correct: bool
    stdout: str | None = None
    expected: str | None = None
    stderr: str | None = None
    fixed_code: str | None = None         