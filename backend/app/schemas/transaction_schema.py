from datetime import datetime, date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, validator

class TransactionCreate(BaseModel):
  coin: str 
  image: str 
  symbol: str 
  transaction_type: str 
  amount: str 
  price_bought: str
  current_price: str
  date_added: datetime 

class TransactionUpdate(BaseModel):
  coin: Optional[str] 
  transaction_type: Optional[str]
  amount: Optional[float] 
  current_price: Optional[str] 
  date_added: datetime

class TransactionOut(BaseModel):
  transaction_id: Optional[UUID]
  image: Optional[str]
  current_price: Optional[str]
  price_bought: str
  coin: str 
  transaction_type: str
  amount: float
  date_added: datetime