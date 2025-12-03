from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import rooms

from app.database import Base, engine
from app.models import user
from app.routers import auth
from app.routers.problems import router as problems_router
from app.routers import ws_rooms
from app.routers.user import router as user_router
from app.routers.test_piston import router as test_piston_router







app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # או ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # חשוב!!!
    allow_headers=["*"],  # חשוב!!!
)

# יוצר את כל הטבלאות
Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
app.include_router(problems_router)
app.include_router(rooms.router)
app.include_router(ws_rooms.router)
app.include_router(user_router)
app.include_router(test_piston_router)



@app.get("/")
def root():
    return {"message": "BugHunt Backend Running!"}

