from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class AssetCreate(BaseModel):
  coin: str
  symbol: str
  image: str
  transaction_type: str
  current_price: str
  amount: float

class AssetUpdate(BaseModel):
  coin: Optional[str]
  symbol: Optional[str]
  image: Optional[str]
  current_price: Optional[str]
  average_price: Optional[str]
  amount: Optional[float]

class AssetOut(BaseModel):
  asset_id: UUID
  coin: str
  symbol: str
  image: str
  current_price: str
  average_price: Optional[str]
  price_24h: Optional[float]
  value: Optional[str]
  amount: float