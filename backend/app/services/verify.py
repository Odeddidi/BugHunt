from app.services.piston import run_code

async def verify_solution(user_code: str, problem):
   

    last_stdout = ""
    last_expected = ""
    last_stderr = ""

    for test in problem.tests:
        stdin = test.input or ""
        expected = (test.expected_output or "").strip()

        stdout, stderr = await run_code(
            language=problem.language,
            code=user_code,
            stdin=stdin
        )

        last_stdout = stdout.strip()
        last_expected = expected
        last_stderr = stderr.strip() if stderr else ""

        if stderr:
            return False, last_stdout, last_expected, last_stderr

        if stdout.strip() != expected.strip():
            return False, last_stdout, last_expected, last_stderr

    return True, last_stdout, last_expected, last_stderr
