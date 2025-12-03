import httpx

PISTON_URL = "https://emkc.org/api/v2/piston/execute"

async def run_code(language: str, code: str, stdin: str):
    payload = {
        "language": language,
        "version": "*",   # לוקח את גרסת השפה האחרונה
        "files": [
            {"name": "main", "content": code}
        ],
        "stdin": stdin
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(PISTON_URL, json=payload)
        data = response.json()

        stdout = data.get("run", {}).get("stdout", "")
        stderr = data.get("run", {}).get("stderr", "")

        return stdout, stderr
