from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
import uuid
from sqlalchemy import func, case
from app.models.active_problem import ActiveProblem




from app.database import SessionLocal
from app.models.room import Room
from app.models.room_player import RoomPlayer
from app.models.user import User
from app.security import get_current_user


router = APIRouter(prefix="/rooms", tags=["rooms"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create-private")
def create_private_room(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    room = Room(
        status="waiting",
        invite_code=str(uuid.uuid4())[:8]  # קוד קצר להזמנה
    )

    db.add(room)
    db.commit()
    db.refresh(room)

    # כותבים אותו כשחקן ראשון
    player = RoomPlayer(room_id=room.id, user_id=user.id)
    db.add(player)
    db.commit()

    return {
        "room_id": room.id,
        "invite_code": room.invite_code,
        "message": "Private room created"
    }

@router.post("/join-invite")
def join_via_invite(
    invite_code: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    room = db.query(Room).filter(Room.invite_code == invite_code).first()

    if not room:
        raise HTTPException(404, "Invalid invite code")

    # בדיקה אם יש כבר שני שחקנים
    count = db.query(RoomPlayer).filter(RoomPlayer.room_id == room.id).count()
    if count >= 2:
        raise HTTPException(400, "Room is full")

    # בדיקה אם השחקן כבר בפנים
    exists = db.query(RoomPlayer).filter(
        and_(RoomPlayer.user_id == user.id, RoomPlayer.room_id == room.id)
    ).first()

    if exists:
        return {"room_id": room.id, "message": "Already in room"}

    player = RoomPlayer(room_id=room.id, user_id=user.id)
    db.add(player)
    db.commit()

    # כשיש שניים — עוברים לשחק
    if count + 1 == 2:
        room.status = "playing"
        db.commit()

    return {
        "room_id": room.id,
        "status": room.status,
        "message": "Joined room successfully"
    }

@router.post("/find-match")
def find_match(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    print("\n==============================")
    print(f"FIND-MATCH CALLED BY USER {user.id}")
    print("==============================")

    # ---------------------------------------------------
    # (A) ניקוי חדרים ריקים לפני כל פעולה
    # ---------------------------------------------------
    empty_rooms = (
        db.query(Room)
        .join(RoomPlayer)
        .filter(Room.status.in_(["waiting", "playing"]))
        .group_by(Room.id)
        .having(
            func.sum(
                case((RoomPlayer.connected == True, 1), else_=0)
            ) == 0
        )
        .all()
    )

    for r in empty_rooms:
        print(f"[CLEAN] Removing empty room {r.id}")

        # מחיקת ה-ActiveProblems
        db.query(ActiveProblem).filter(ActiveProblem.room_id == r.id).delete()

        # מחיקת players
        db.query(RoomPlayer).filter(RoomPlayer.room_id == r.id).delete()

        # מחיקת החדר עצמו
        db.delete(r)

    db.commit()

    # ---------------------------------------------------
    # (B) בדיקת האם המשתמש כבר בחדר תקין
    # ---------------------------------------------------
    existing = (
        db.query(RoomPlayer)
        .join(Room)
        .filter(
            RoomPlayer.user_id == user.id,
            Room.status.in_(["waiting", "playing"])
        )
        .first()
    )

    if existing:
        print(f"[EXISTING] User {user.id} already in room {existing.room_id}")
        return {
            "room_id": existing.room_id,
            "message": "Reconnected to existing room."
        }

    # ---------------------------------------------------
    # (C) מציאת חדר שמחכה לשחקן שני
    # ---------------------------------------------------
    waiting_room = (
        db.query(Room)
        .join(RoomPlayer)
        .filter(Room.status == "waiting")
        .group_by(Room.id)
        .having(func.count(RoomPlayer.id) == 1)
        .first()
    )

    if waiting_room:
        print(f"[MATCH] Room {waiting_room.id} has 1 player → adding user {user.id}")

        rp = RoomPlayer(room_id=waiting_room.id, user_id=user.id, connected=False)
        db.add(rp)

        waiting_room.status = "playing"
        db.commit()

        print(f"[START] Room {waiting_room.id} is now PLAYING with users:")
        players = db.query(RoomPlayer).filter(RoomPlayer.room_id == waiting_room.id).all()
        for p in players:
            print(f"   - user {p.user_id}, connected={p.connected}")

        return {
            "room_id": waiting_room.id,
            "message": "Match found! Game starting."
        }

    # ---------------------------------------------------
    # (D) יצירת חדר חדש
    # ---------------------------------------------------
    print(f"[NEW] No available room → creating new room for user {user.id}")

    room = Room(status="waiting")
    db.add(room)
    db.commit()
    db.refresh(room)

    rp = RoomPlayer(room_id=room.id, user_id=user.id, connected=False)
    db.add(rp)
    db.commit()

    print(f"[NEW ROOM] Created room {room.id} with first player {user.id}")

    return {
        "room_id": room.id,
        "message": "New room created. Waiting for opponent."
    }

