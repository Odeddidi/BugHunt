from sqlalchemy import Column, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class RoomPlayer(Base):
    __tablename__ = "room_players"

    id = Column(Integer, primary_key=True)
    
    room_id = Column(Integer, ForeignKey("rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    score_in_room = Column(Integer, default=0)
    connected = Column(Boolean, default=False)
    ready_for_next = Column(Boolean, default=False)



    room = relationship("Room", back_populates="players")
    user = relationship("User")

    
