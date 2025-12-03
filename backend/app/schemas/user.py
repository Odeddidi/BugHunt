from pydantic import BaseModel
from pydantic import EmailStr, field_validator


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number.")
        return v
            
class UserLogin(BaseModel):
    username: str
    password: str
class UserResponse(BaseModel):
    id: int
    username: str
    score: int
    is_admin: bool
    email: EmailStr

    class Config:
        from_attributes = True    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    username: str
    score: int
    user_id: int  
    is_admin: bool