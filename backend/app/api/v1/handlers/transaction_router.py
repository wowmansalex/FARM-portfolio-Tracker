from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Depends
import pymongo

from models.user_model import User
from models.portofolio_model import Transaction, Asset
from schemas.transaction_schema import TransactionCreate, TransactionUpdate,  TransactionOut
from schemas.assets_schema import AssetCreate

from services.transaction_service import TransactionService

from api.dependencies.user_dependencies import get_current_user

transaction_router = APIRouter()

@transaction_router.get('/list', summary="get a list of all transactions the user has done", response_model=List[TransactionOut])
async def transactions_list(user: User = Depends(get_current_user)):
  return await TransactionService.list_transactions(user)

@transaction_router.get('/list/{asset_name}', summary="get a list of transactions by asset=", response_model=List[TransactionOut])
async def transactions_list_by_asset(asset_name: str, user: User = Depends(get_current_user)):
  return await TransactionService.list_transactions_by_asset(asset_name, user)

@transaction_router.post('/create', summary="create a new transaction", response_model=TransactionOut)
async def create_transaction(data: TransactionCreate, user: User = Depends(get_current_user)):
  return await TransactionService.create_transaction(user, data)

@transaction_router.get('/{transaction_id}', summary="get transaction by transaction_id", response_model=TransactionOut)
async def get(transaction_id: UUID, user: User = Depends(get_current_user)):
  return await TransactionService.get_transaction(transaction_id, user)

@transaction_router.put('/{transaction_id}', summary="update transaction by transaction_id", response_model=TransactionOut)
async def update(transaction_id: UUID, user: User = Depends(get_current_user)):
  return await TransactionService.update_transactiont(transaction_id, data, user)

@transaction_router.delete('/{transaction_id}', summary="delete transaction by transaction_id")
async def delete(transaction_id: UUID, user: User = Depends(get_current_user)):
  return await TransactionService.delete_transaction(transaction_id, user)