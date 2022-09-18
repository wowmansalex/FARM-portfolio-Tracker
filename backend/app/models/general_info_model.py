from datetime import datetime

from beanie import Document, Indexed, Link, before_event, Replace, Insert
from pydantic import Field, EmailStr
from uuid import UUID, uuid4

from .portofolio_model import Portfolio, Asset, Transaction

class CoinInfo(Document):
  coin: str = Field(...)
  symbol: str = Field(...)
  image_url: str = Field(...)

  def __refr__(self) -> str:
    return f"<User {self.coin}>"

  def __str__(self) -> str:
    return self.coin

  def __hash__(self) -> int:
    return hash(self.coin)

  def __eq__(self, other: object) -> bool:
    if isInstance(other, User):
      return self.coin == other.coin
    return False

  class Collection:
    name = "general info"