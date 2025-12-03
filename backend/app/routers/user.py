from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.UserSeenProblem import UserSeenProblem
from app.models.problem import Problem
from app.models.UserMatch import UserMatch

router = APIRouter(prefix="/users", tags=["users"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.get("/top10")
def get_top_users(db: Session = Depends(get_db)):
    top_users = db.query(User).order_by(User.score.desc()).limit(10).all()
    return [{"username": user.username, "score": user.score} for user in top_users]        

@router.get("/{user_id}/seen_problems")
def get_seen_problems(user_id: int, db: Session = Depends(get_db)):
    seen = (
        db.query(UserSeenProblem, Problem)
          .join(Problem, Problem.id == UserSeenProblem.problem_id)
          .filter(UserSeenProblem.user_id == user_id)
          .all()
    )
    return [
        {"problem_id": p.id, "title": p.title, "language": p.language}
        for _, p in seen
    ]
@router.get("/{user_id}/matches")
def get_matches(user_id: int, db: Session = Depends(get_db)):
    matches = db.query(UserMatch).filter_by(user_id=user_id).order_by(UserMatch.created_at.desc()).all()
    return [ {
        "opponent": m.opponent_name,
        "winner": m.winner,
        "rounds_won": m.rounds_won,
        "rounds_lost": m.rounds_lost,
        "room_id": m.room_id,
        "created_at": m.created_at
    } for m in matches ]
