from app.services.piston import run_code

async def verify_solution(user_code: str, problem):
    """
    מריץ את הקוד של המשתמש מול כל הטסטים של הבעיה.
    מחזיר:
      - True/False
      - stdout האחרון
      - expected האחרון
      - stderr אם היה
    """

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

        # שמור מידע על הטסט האחרון (למשוב)
        last_stdout = stdout.strip()
        last_expected = expected
        last_stderr = stderr.strip() if stderr else ""

        # אם הייתה שגיאה בהרצה
        if stderr:
            return False, last_stdout, last_expected, last_stderr

        # אם הפלט לא תואם
        if stdout.strip() != expected.strip():
            return False, last_stdout, last_expected, last_stderr

    # אם עבר על כל הטסטים
    return True, last_stdout, last_expected, last_stderr
