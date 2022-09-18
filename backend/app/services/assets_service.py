from typing import List
from uuid import UUID

import httpx
import asyncio

from models.user_model import User
from models.portofolio_model import Asset

from schemas.assets_schema import AssetCreate, AssetUpdate, AssetOut
from schemas.transaction_schema import TransactionCreate

class AssetService:
  @staticmethod
  async def list_assets(user: User) -> List[Asset]:
    assets = await Asset.find(Asset.user.id == user.id).to_list()
    return assets

  @staticmethod
  async def create_asset(user:User, data: AssetCreate) -> Asset:
    find_asset = await Asset.find_one(Asset.coin==data.coin)
    if find_asset:
      asset_id = find_asset.asset_id
      transaction_type = data.transaction_type
      asset = await AssetService.update_asset_from_transaction(asset_id, data, transaction_type, user)

    else:
      asset = Asset(**data.dict(), user=user)
      return await asset.insert()

  @staticmethod
  async def get_asset(asset_id: UUID, user: User):
    asset = await Asset.find_one(Asset.asset_id == asset_id, Asset.user.id == user.id)
    return asset

  @staticmethod
  async def update_asset(asset_id: UUID, data: AssetUpdate, user: User):
    asset = await AssetService.get_asset(asset_id, user)
    await asset.update({"$set": data.dict(exclude_unset=True)})

    await asset.save()

    return asset

  @staticmethod
  async def update_asset_from_transaction(asset_id: UUID, data: AssetUpdate, transaction_type: str, user: User):
    asset = await AssetService.get_asset(asset_id, user)

    if transaction_type == 'buy':
      await asset.update({'$inc': { 'amount': data.amount }})
      await asset.save()
    elif transaction_type == 'sell':
      await asset.update({'$inc': { 'amount': (-data.amount) }})
      await asset.save()
    
    return asset

  @staticmethod
  async def delete_asset(user: User, asset_id: UUID) -> None:
    asset = await AssetService.get_asset(user, asset_id)
    if asset:
      await asset.delete()

    return None
