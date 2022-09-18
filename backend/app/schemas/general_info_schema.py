from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

class CoinInfoIn(BaseModel):
  coin_name: str = Field(...)

class CoinInfoOut(BaseModel):
  coin_name: str 
  coin_symbol: str 
  image_url: str
  
