from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

from pydantic import BaseModel, Field

class CoinInfoIn(BaseModel):
  coin_name: str = Field(...)

class CoinInfoOut(BaseModel):
  coin_name: str 
  coin_symbol: str 
  image_url: str
  
class CurrentBalance(BaseModel):
  current_balance: str = Field(...)
  created_at: datetime = Field(default_factory=datetime.now)