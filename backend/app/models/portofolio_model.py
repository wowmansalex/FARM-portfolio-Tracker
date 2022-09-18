from datetime import datetime, date
from typing import Optional

from beanie import Document, Indexed, Link, before_event, Replace, Insert
from pydantic import Field, EmailStr
from uuid import UUID, uuid4

from .user_model import User

class Portfolio(Document):
    portfolio_id: UUID = Field(default_factory=uuid4, unique=True)
    user: Link[User]
    name: str
    balance: float
    created_at: datetime = Field(default_factory=datetime.now)
    
    def __repr__(self) -> str:
            return f"<Todo {self.name}>"

    def __str__(self) -> str:
        return self.name

    def __hash__(self) -> int:
        return hash(self.name)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Portfolio):
            return self.portfolio_id == other.portfolio_id
        return False
    
    class Collection:
        name = "portfolios"


class Asset(Document):
    user: Link[User]
    asset_id: UUID = Field(default_factory=uuid4, unique=True)
    coin: Indexed(str)
    price_24h: Optional[float]
    symbol: str
    image: str
    transaction_type: Optional[str]
    current_price: float
    average_price: Optional[float]
    amount: float

    def __repr__(self) -> str:
            return f"<Asset {self.coin}>"

    def __str__(self) -> str:
        return self.coin

    def __hash__(self) -> int:
        return hash(self.coin)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Asset):
            return self.asset_id == other.asset_id
        return False
    
    class Collection:
        name = "assets"
  

class Transaction(Document):
    user: Link[User]
    transaction_id: UUID = Field(default_factory=uuid4, unique=True)
    coin: Indexed(str)
    image: Optional[str]
    symbol: Optional[str]
    transaction_type: str
    amount: str
    current_price: Optional[float]
    price_bought: float
    date_added: datetime
    updated: datetime = Field(default_factory=datetime.now)

    def __repr__(self) -> str:
        return f"<Transaction {self.coin}>"

    def __str__(self) -> str:
        return self.coin

    def __hash__(self) -> int:
        return hash(self.coin)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Transaction):
            return self.transaction_id == other.transaction_id
        return False
    
    class Collection:
        name = "transactions"

class LogData(Document):
    logdata_id: UUID = Field(default_factory=uuid4, unique=True)
    description: str
    portfolio_id: Link[Portfolio]
    current_balance: float
    updated: datetime = Field(default_factory=datetime.now)

    def __repr__(self) -> str:
        return f"<LogData {self.description}>"

    def __str__(self) -> str:
        return self.description

    def __hash__(self) -> int:
        return hash(self.description)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, LogData):
            return self.transaction_id == other.transaction_id
        return False

    class Collection:
        name = "logdata"