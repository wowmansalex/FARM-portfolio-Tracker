from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Depends
import pymongo

from models.user_model import User
from models.portofolio_model import Asset
from schemas.portfolio_schema import PortfolioCreate, PortfolioUpdate, PortfolioOut
from schemas.general_info_schema import CoinInfoIn, CoinInfoOut

from services.general_info_services import GeneralInfoService

general_info_router = APIRouter()

@general_info_router.get('/', summary="get symbol & image url from the top 100 cryptocurrencies", response_model=List[CoinInfoOut])
async def get_all_coin_info():
  return await GeneralInfoService.get_all_coin_info()

@general_info_router.get('/coin-info', summary="get symbol, image url by asset name", response_model=CoinInfoOut)
async def get_coin_info(asset: Asset):
  return await GeneralInfoService.get_coin_info(asset.name)

