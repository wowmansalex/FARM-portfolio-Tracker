from typing import List
import json
from pprint import pprint
from uuid import UUID
import requests
from pydantic import BaseModel, Field

from models.user_model import User
from models.portofolio_model import Transaction, Asset

from services.assets_service import AssetService

from schemas.assets_schema import AssetUpdate, AssetCreate
from schemas.transaction_schema import TransactionCreate, TransactionUpdate, TransactionOut

class TransactionService:
  @staticmethod
  async def list_transactions(user: User) -> List[TransactionOut]:
    transactions = await Transaction.find(Transaction.user.id == user.id).to_list()
    asset_name = transactions[0].coin
  
    return transactions

  @staticmethod
  async def list_transactions_by_asset(asset_name: str, user: User) -> List[TransactionOut]:
    transactions = await Transaction.find(Transaction.user.id == user.id, Transaction.coin == asset_name).to_list()
    average_price = await TransactionService.asset_average_price(asset_name, user)

    print(average_price)
    return transactions
  @staticmethod
  async def asset_average_price(asset_name:str, user: User) -> float:

   average_price = await Transaction.aggregate([{"$match": {"coin": asset_name}}, {"$group": {"_id": "transaction_id", "averageTransactionPrice": {"$avg": "$price_bought"} }}]).to_list()
    
   asset = await Asset.find_one(Asset.coin == asset_name)

   await asset.update({'$set': {'average_price': average_price[0]['averageTransactionPrice']}})

  @staticmethod
  async def create_transaction(user: User, data: TransactionCreate) -> Transaction:
    transaction = Transaction(**data.dict(), user=user)
    return await transaction.insert()
    

  @staticmethod
  async def get_transaction(transaction_id: UUID, user: User):
    transaction = await Transaction.find_one(Transaction.transaction_id == transaction_id, Transaction.user.id == user.id)
    return transaction

  @staticmethod
  async def update_transactiont(transaction_id: UUID, data: TransactionUpdate, user: User):
    transaction = await TransactionService.get_transaction(transaction_id, user)
    await transaction.update({"$set": data.dict(exclude_unset=True)})

    await transaction.save()

    return transaction

  @staticmethod
  async def delete_transaction(transaction_id: UUID, user: User) -> None:
    
    transaction = await TransactionService.get_transaction(transaction_id, user)
    asset = await Asset.find_one(Asset.coin == transaction.coin, Asset.user.id == user.id)
    await asset.update({'$inc': { 'amount': (-transaction.amount) }})
    if transaction:
      await transaction.delete()

    return None