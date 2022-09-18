from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class PortfolioCreate(BaseModel):
  name: str = Field(...)
  balance: float = Field(...)
  created_at: datetime = Field(default_factory=datetime.now)

class PortfolioUpdate(BaseModel):
  name: Optional[str] = Field(...)
  balance: Optional[float] = Field(...)

class PortfolioOut(BaseModel):
  portfolio_id: UUID
  name: str
  balance: float
  created_at: datetime
