from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from jose import jwt
import json, random
import ast

from app.database import SessionLocal
from app.models.room import Room
from app.models.room_player import RoomPlayer
from app.models.active_problem import ActiveProblem
from app.models.UserSeenProblem import UserSeenProblem
from app.models.problem import Problem
from app.models.user import User
from app.models.UserMatch import UserMatch
from app.services.verify import verify_solution

from app.config import SECRET_KEY

router = APIRouter(prefix="/ws", tags=["websocket"])


# ====================================================
# Connection Manager
# ====================================================
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}
        self.next_round_votes: dict[int, set[int]] = {}

    async def connect(self, room_id: int, ws: WebSocket):
        self.active_connections.setdefault(room_id, [])
        self.active_connections[room_id].append(ws)

    def disconnect(self, room_id: int, ws: WebSocket):
        try:
            self.active_connections[room_id].remove(ws)
        except:
            pass

    async def send(self, ws: WebSocket, message: dict):
        try:
            await ws.send_text(json.dumps(message))
        except:
            pass

    async def broadcast(self, room_id: int, message: dict):
        conns = self.active_connections.get(room_id, [])
        for ws in conns:
            await self.send(ws, message)

    async def broadcast_except(self, room_id: int, message: dict, except_ws: WebSocket):
        conns = self.active_connections.get(room_id, [])
        for ws in conns:
            if ws is not except_ws:
                await self.send(ws, message)


manager = ConnectionManager()


# ====================================================
# DB Helper
# ====================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ====================================================
# Start new round
# ====================================================
def start_new_round(db: Session, room: Room):
    # שליפת שני השחקנים
    players = db.query(RoomPlayer).filter(
        RoomPlayer.room_id == room.id
    ).all()

    if len(players) != 2:
        raise Exception("Room must have exactly 2 players to start a round.")

    p1, p2 = players
    p1_id = p1.user_id
    p2_id = p2.user_id

    # אילו שאלות השחקנים כבר ראו
    seen_p1 = db.query(UserSeenProblem.problem_id).filter(
        UserSeenProblem.user_id == p1_id
    )

    seen_p2 = db.query(UserSeenProblem.problem_id).filter(
        UserSeenProblem.user_id == p2_id
    )

    # סינון: בעיות שאף אחד מהם לא ראה
    available_problems = db.query(Problem).filter(
        Problem.id.not_in(seen_p1),
        Problem.id.not_in(seen_p2)
    ).all()

    # אם אין בעיות חדשות → fallback: אפשר להחזיר את כל הבעיות מחדש
    if not available_problems:
        print("[ROUND] no new problems available for both players, resetting seen problems.")
        available_problems = db.query(Problem).all()

    # בחר בעיה
    problem = random.choice(available_problems)

    # עדכון ActiveProblem
    active = ActiveProblem(
        room_id=room.id,
        problem_id=problem.id,
        round_number=room.current_round + 1,
        winner_user_id=None
    )

    room.current_round += 1

    db.add(active)

    # סימון שהבעיה נראתה על ידי שני השחקנים
    for rp in players:
        exists = db.query(UserSeenProblem).filter_by(
            user_id=rp.user_id,
            problem_id=problem.id
        ).first()

        if not exists:
            db.add(UserSeenProblem(user_id=rp.user_id, problem_id=problem.id))

    db.commit()
    db.refresh(active)

    print(f"[ROUND] new round {active.round_number} in room {room.id}")

    return active, problem


def normalize(code: str):
    try:
        tree = ast.parse(code)
        return ast.dump(tree, annotate_fields=False, include_attributes=False)
    except Exception:
        return None  # קוד לא תקין – אי אפשר לפרסר


# ====================================================
# Cleanup if empty
# ====================================================
def cleanup_room_if_empty(db: Session, room_id: int):
    connected = db.query(RoomPlayer).filter(
        RoomPlayer.room_id == room_id,
        RoomPlayer.connected == True
    ).count()

    if connected == 0:
        room = db.query(Room).filter(Room.id == room_id).first()
        if room:
            room.status = "waiting"
            room.current_round = 0
            db.query(ActiveProblem).filter(
                ActiveProblem.room_id == room_id
            ).delete()
            db.commit()
            print(f"[CLEANUP] Room {room_id} reset: empty")


# ====================================================
# FINISH ROOM — compute winner & update personal score
# ====================================================
def finish_room(db: Session, room_id: int):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        return

    players = db.query(RoomPlayer).filter(
        RoomPlayer.room_id == room_id
    ).all()

    if len(players) != 2:
        return

    p1, p2 = players

    # Determine winner
    if p1.score_in_room > p2.score_in_room:
        winner = p1.user_id
    elif p2.score_in_room > p1.score_in_room:
        winner = p2.user_id
    else:
        winner = None
    winner_name = None
    if winner:
        winner_user = db.query(User).filter(User.id == winner).first()
        winner_name = winner_user.username
    # Personal score update
    if winner:
        user = db.query(User).filter(User.id == winner).first()
        user.score += 1
        db.commit()
    u1  = get_user_by_id(db, p1.user_id)
    u2  = get_user_by_id(db, p2.user_id)
    # For p1
    save_match_record(
        db, 
        p1.user_id,
        opponent_name=u2.username,
        winner=(winner == p1.user_id),
        rounds_won=p1.score_in_room,
        rounds_lost=p2.score_in_room,
        room_id=room_id
    )

    # For p2
    save_match_record(
        db, 
        p2.user_id,
        opponent_name=u1.username,
        winner=(winner == p2.user_id),
        rounds_won=p2.score_in_room,
        rounds_lost=p1.score_in_room,
        room_id=room_id
    )
    

    result_msg = {
        "event": "room_result",
        "winner": winner,
        "p1_score": p1.score_in_room,
        "p2_score": p2.score_in_room,
        "personalScores": {
            p1.user_id: db.query(User).filter(User.id == p1.user_id).first().score,
            p2.user_id: db.query(User).filter(User.id == p2.user_id).first().score
        },
        "winner_name": winner_name
    }

    return result_msg
def mark_problem_seen(db, user_id, problem_id):
    exists = db.query(UserSeenProblem).filter_by(
        user_id=user_id, problem_id=problem_id
    ).first()

    if not exists:
        record = UserSeenProblem(user_id=user_id, problem_id=problem_id)
        db.add(record)
        db.commit()

def save_match_record(db, user_id, opponent_name, winner, rounds_won, rounds_lost, room_id):
    record = UserMatch(
        user_id=user_id,
        opponent_name=opponent_name,
        winner=winner,
        rounds_won=rounds_won,
        rounds_lost=rounds_lost,
        room_id=room_id
    )
    db.add(record)
    db.commit()
def get_user_by_id(db, user_id):
    return db.query(User).filter(User.id == user_id).first()


# ====================================================
# Close all clients in room
# ====================================================
async def force_close_room(room_id: int):
    conns = manager.active_connections.get(room_id, [])
    for ws in conns:
        try:
            await ws.close()
        except:
            pass
    manager.active_connections[room_id] = []


# ====================================================
# WebSocket
# ====================================================
@router.websocket("/rooms/{room_id}")
async def room_socket(ws: WebSocket, room_id: int, db: Session = Depends(get_db)):

    # -------------------------
    # AUTH
    # -------------------------
    token = ws.query_params.get("token")
    if not token:
        return

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload["sub"])
    except:
        return

    user = db.query(User).filter(User.id == user_id).first()
    room = db.query(Room).filter(Room.id == room_id).first()

    if not user or not room:
        return

    rp = db.query(RoomPlayer).filter(
        RoomPlayer.room_id == room_id,
        RoomPlayer.user_id == user_id
    ).first()

    if not rp:
        await ws.close()
        return

    # -------------------------
    # ACCEPT & REGISTER
    # -------------------------
    await ws.accept()
    await manager.connect(room_id, ws)

    rp.connected = True
    db.commit()

    print(f"[WS] user {user_id} connected to room {room_id}")

    # If opponent exists – notify both
    other = db.query(RoomPlayer).filter(
        RoomPlayer.room_id == room_id,
        RoomPlayer.user_id != user_id
    ).first()

    if other:
        other_user = db.query(User).filter(User.id == other.user_id).first()
        await manager.send(ws, {
            "event": "opponent_join",
            "username": other_user.username
        })

    await manager.broadcast_except(room_id, {
        "event": "opponent_join",
        "username": user.username
    }, ws)

    # Start round if 2 connected
    connected_now = db.query(RoomPlayer).filter(
        RoomPlayer.room_id == room_id,
        RoomPlayer.connected == True
    ).count()

    if connected_now == 2 and room.current_round == 0:
        active, problem = start_new_round(db, room)
        players = db.query(RoomPlayer).filter(
        RoomPlayer.room_id == room_id
        ).all()
        for rp in players:
            mark_problem_seen(db, rp.user_id, problem.id)
        await manager.broadcast(room_id, {
            "event": "round_start",
            "problem": {
                "id": problem.id,
                "title": problem.title,
                "description": problem.description,
                "language": problem.language,
                "code_with_bug": problem.code_with_bug,
                "round": active.round_number
            }
        })

    # -------------------------
    # MAIN LOOP
    # -------------------------
    try:
        while True:
            raw = await ws.receive_text()
            data = json.loads(raw)
            event = data.get("event")

            # ========================================
            # SUBMIT SOLUTION
            # ========================================
            if event == "submit_solution":

                problem_id = data["problem_id"]
                submitted = data["solution"].strip()

                active = db.query(ActiveProblem).filter(
                    ActiveProblem.room_id == room_id,
                    ActiveProblem.problem_id == problem_id,
                    ActiveProblem.winner_user_id == None
                ).first()

                if not active:
                    continue

                problem = db.query(Problem).filter(Problem.id == problem_id).first()
                is_correct, out, expected, stderr = await verify_solution(submitted, problem)

                if is_correct:
                    active.winner_user_id = user_id
                    rp.score_in_room += 1
                    db.commit()

                    await manager.broadcast(room_id, {
                        "event": "solution_result",
                        "correct": True,
                        "winner_name": user.username,
                        "fixed_code": problem.fixed_code
                    })

                else:
                    await ws.send_text(json.dumps({
                        "event": "solution_result",
                        "correct": False
                    }))

            # ========================================
            # NEXT ROUND REQUEST
            # ========================================
            elif event == "next_round_request":

                votes = manager.next_round_votes.setdefault(room_id, set())
                votes.add(user_id)

                await ws.send_text(json.dumps({
                    "event": "next_round_wait"
                }))

                await manager.broadcast_except(room_id, {
                    "event": "next_round_request",
                    "from_user": user.username
                }, ws)

            # ========================================
            # NEXT ROUND ACCEPT
            # ========================================
            elif event == "next_round_accept":

                votes = manager.next_round_votes.setdefault(room_id, set())
                votes.add(user_id)

                if len(votes) == 2:
                    votes.clear()
                    active, problem = start_new_round(db, room)

                    await manager.broadcast(room_id, {
                        "event": "round_start",
                        "problem": {
                            "id": problem.id,
                            "title": problem.title,
                            "language": problem.language,
                            "code_with_bug": problem.code_with_bug,
                            "round": active.round_number
                        }
                    })

            # ========================================
            # NEXT ROUND DECLINE  — CLOSE ROOM
            # ========================================
            elif event == "next_round_decline":

                rp.connected = False
                db.commit()
                manager.disconnect(room_id, ws)

                # 1) Finish room & announce winner
                result = finish_room(db, room_id)
                if result:
                    await manager.broadcast(room_id, result)

                # 2) Inform other player
                await manager.broadcast_except(room_id, {
                    "event": "opponent_declined",
                    "username": user.username
                }, ws)

                # 3) Close entire room
                await force_close_room(room_id)

                room.status = "finished"
                db.commit()

                # 4) Notify declining player
                await ws.send_text(json.dumps({
                    "event": "you_declined_and_left"
                }))

                break

            # ========================================
            # EXIT ROOM — CLOSE ROOM
            # ========================================
            elif event == "exit_room":

                rp.connected = False
                db.commit()
                if room.status != "finished":
                    result = finish_room(db, room_id)
                    if result:
                        await manager.broadcast(room_id, result)
                    room.status = "finished"
                    db.commit()    

                await manager.broadcast_except(room_id, {
                    "event": "opponent_left",
                    "username": user.username
                }, ws)

                await force_close_room(room_id)

                room.status = "finished"
                db.commit()
                break

    # =====================================================
    # DISCONNECT (browser closed / refresh)
    # =====================================================
    except WebSocketDisconnect:

        manager.next_round_votes.setdefault(room_id, set()).discard(user_id)

        rp.connected = False
        db.commit()
        manager.disconnect(room_id, ws)

        # 1) winner calculation
        if room.status != "finished":
            result = finish_room(db, room_id)
            if result:
                await manager.broadcast(room_id, result)
            room.status = "finished"
            db.commit()

        # 2) notify the other player
        await manager.broadcast(room_id, {
            "event": "opponent_left",
            "username": user.username
        })

        # 3) close room entirely
        await force_close_room(room_id)

        room.status = "finished"
        db.commit()

        print(f"[WS] user {user_id} disconnected from room {room_id}")
