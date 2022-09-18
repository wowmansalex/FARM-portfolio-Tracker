from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Depends
import pymongo

from models.user_model import User
from models.portofolio_model import Asset
from schemas.assets_schema import AssetCreate, AssetUpdate, AssetOut

from services.assets_service import AssetService

from api.dependencies.user_dependencies import get_current_user

asset_router = APIRouter()

@asset_router.get('/list', summary="Get a list of all assets in user's portfolio", response_model=List[AssetOut])
async def asset_list(user: User = Depends(get_current_user)):
  return await AssetService.list_assets(user)

@asset_router.post('/create', summary="Create a new asset", response_model=AssetOut)
async def create_asset(data: AssetCreate, user: User = Depends(get_current_user)):
  return await AssetService.create_asset(user, data)

@asset_router.get('/{asset_id}', summary="Get asset by asset_id", response_model=AssetOut)
async def get(asset_id: UUID, user: User = Depends(get_current_user)):
  return await AssetService.get_asset(asset_id, user)

@asset_router.put('/{asset_id}', summary="Edit asset by asset_id", response_model=AssetOut)
async def update(asset_id: UUID, data: AssetUpdate, user: User = Depends(get_current_user)):
  return await AssetService.update_asset(asset_id, data, user)

@asset_router.delete('/{asset_id}', summary="Delete asset by asset_id")
async def delete(asset_id: UUID, user: User = Depends(get_current_user)):
  return await AssetService.delete_asset(asset_id, user)
  return None