import datetime
from typing import Optional

from beanie import Document, Indexed
from pydantic import Field, EmailStr
from uuid import UUID, uuid4

class User(Document):
  user_id: UUID = Field(default_factory=uuid4)
  username: str | None = None
  email: Indexed(EmailStr, unique=True)
  hashed_password: str 
  disabled: Optional[bool] = None 

  def __refr__(self) -> str:
    return f"<User {self.email}>"

  def __str__(self) -> str:
    return self.email

  def __hash__(self) -> int:
    return hash(self.email)

  def __eq__(self, other: object) -> bool:
    if isInstance(other, User):
      return self.email == other.email
    return False

  @property
  def create(self) -> datetime:
    return self.id.generation_time

  @classmethod
  async def by_email(self, email:str) -> "User":
    return await self.find_one(self.email == email)

  class Collection:
    name = "users"



