from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr, Field

class UserAuth(BaseModel):
  email: EmailStr = Field(..., description="user email")
  # username: str = Field(...)
  password: str = Field (..., min_length=4, max_length=24, description="user password")

class UserOut(BaseModel):
  user_id: UUID
  email: EmailStr = Field(...)
  disabled: Optional[bool] = False

