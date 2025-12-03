from fastapi import APIRouter
from pydantic import BaseModel
from app.services.piston import run_code

router = APIRouter(prefix="/test", tags=["test"])

class PistonTestRequest(BaseModel):
    language: str
    code: str
    stdin: str = ""

@router.post("/piston")
async def test_piston(req: PistonTestRequest):
    stdout, stderr = await run_code(req.language, req.code, req.stdin)
    return {
        "stdout": stdout,
        "stderr": stderr
    }
