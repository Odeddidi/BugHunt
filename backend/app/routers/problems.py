from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random

from app.database import SessionLocal
from app.models.problem import Problem
from app.models.user import User
from app.security import get_current_user
from app.schemas.problem import SubmitRequest
from app.schemas.problem import ProblemCreate, ProblemResponse, SubmitResponse
import app.models.problem_tests as  problem_tests_model
from app.services.verify import verify_solution
ProblemTest = problem_tests_model.ProblemTest

router = APIRouter(prefix="/problems", tags=["problems"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  

@router.post("/", response_model=ProblemResponse)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    # צור את הבעיה עצמה
    p = Problem(
        title=problem.title,
        description=problem.description,
        language=problem.language,
        difficulty=problem.difficulty,
        code_with_bug=problem.code_with_bug,
        fixed_code=problem.fixed_code
    )
    db.add(p)
    db.commit()
    db.refresh(p)

    # צור את הטסטים
    for t in problem.tests:
        test_row = ProblemTest(
            problem_id=p.id,
            input=t.input,
            expected_output=t.expected_output
        )
        db.add(test_row)

    db.commit()
    db.refresh(p)

    return p


@router.get("/", response_model=ProblemResponse)
def get_random_problem(difficulty: str | None = None,
                       db: Session = Depends(get_db)):

    query = db.query(Problem)

    # אם difficulty לא None ולא ""
    if difficulty:
        problems = query.filter(Problem.difficulty == difficulty).all()
    else:
        problems = query.all()

    if not problems:
        raise HTTPException(status_code=404, detail="No problems available")

    return random.choice(problems)

@router.post("/submit", response_model=SubmitResponse)
async def submit_solution(req: SubmitRequest, 
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):

    problem = db.query(Problem).filter(Problem.id == req.problem_id).first()
    if not problem:
        raise HTTPException(404, "Problem not found")

    # בדיקה אמיתית מול Piston
    is_correct, out, expected, stderr = await verify_solution(req.solution, problem)

    return {
        "correct": is_correct,
        "stdout": out,
        "expected": expected,
        "stderr": stderr,
        "fixed_code": problem.fixed_code
    }