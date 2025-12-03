import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://bughunt_user:tSCsHyCfV8xmfxMoZu5DUKmzGaVHj5mG@dpg-d4o2li7gi27c73dsgv6g-a.frankfurt-postgres.render.com/bughunt"
)
SECRET_KEY = "SUPER_SECRET_CHANGE_THIS"
ALGORITHM = "HS256"
