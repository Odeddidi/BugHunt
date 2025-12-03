# app/services/room_service.py

from sqlalchemy.orm import Session
from app.models.room import Room, RoomPlayer
from app.models.problem import Problem
from app.models.active_problem import ActiveProblem
import random


class RoomService:

    @staticmethod
    def create_room(db: Session) -> Room:
        """Create a new room in waiting mode."""
        room = Room(status="waiting", current_round=0)
        db.add(room)
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def join_room(db: Session, room_id: int, user_id: int) -> RoomPlayer:
        """Join a room. Raises if full or not found."""
        room = db.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise ValueError("Room not found")

        players_count = db.query(RoomPlayer).filter(RoomPlayer.room_id == room_id).count()
        if players_count >= 2:
            raise ValueError("Room is full")

        # Create room_player entry
        rp = RoomPlayer(room_id=room_id, user_id=user_id, connected=True)
        db.add(rp)
        db.commit()
        db.refresh(rp)

        return rp

    @staticmethod
    def get_room_players(db: Session, room_id: int):
        """Return a list of players in a room."""
        return db.query(RoomPlayer).filter(RoomPlayer.room_id == room_id).all()

    @staticmethod
    def start_round(db: Session, room_id: int) -> ActiveProblem:
        """
        Start a new round:
        - increase room.current_round
        - randomly pick a problem
        - create ActiveProblem entry
        """
        room = db.query(Room).filter(Room.id == room_id).first()
        if not room:
            raise ValueError("Room not found")

        room.current_round += 1

        # Pick a random problem
        problems = db.query(Problem).all()
        if not problems:
            raise ValueError("No problems available")

        problem = random.choice(problems)

        active = ActiveProblem(
            room_id=room_id,
            problem_id=problem.id,
            round_number=room.current_round
        )
        db.add(active)
        db.commit()
        db.refresh(active)

        return active

    @staticmethod
    def get_active_problem(db: Session, room_id: int) -> ActiveProblem | None:
        """Return the latest active problem."""
        return (
            db.query(ActiveProblem)
            .filter(ActiveProblem.room_id == room_id)
            .order_by(ActiveProblem.round_number.desc())
            .first()
        )

    @staticmethod
    def set_winner(db: Session, room_id: int, user_id: int):
        """
        Mark the current round's ActiveProblem as solved by user_id.
        If already solved, we do nothing.
        """
        active = RoomService.get_active_problem(db, room_id)
        if not active:
            raise ValueError("No active problem found")

        if active.winner_user_id is None:
            active.winner_user_id = user_id
            db.commit()
            return True  # first winner
        return False  # someone else already won

    @staticmethod
    def is_room_ready(db: Session, room_id: int) -> bool:
        """Room is ready if it has exactly 2 players."""
        count = db.query(RoomPlayer).filter(RoomPlayer.room_id == room_id).count()
        return count == 2

