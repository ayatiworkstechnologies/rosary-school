from pydantic import BaseModel, EmailStr, Field


# =========================================================
# LOGIN REQUEST
# =========================================================

class AdminLoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )


# =========================================================
# ADMIN RESPONSE
# =========================================================

class AdminResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    model_config = {
        "from_attributes": True
    }


# =========================================================
# LOGIN RESPONSE
# =========================================================

class AdminLoginResponse(BaseModel):
    message: str
    admin: AdminResponse