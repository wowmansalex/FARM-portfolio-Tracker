from typing import List, Union
from uuid import UUID
import http3

from fastapi import APIRouter, HTTPException, status, Depends
import pymongo

from models.user_model import User
from models.portofolio_model import Asset
from schemas.portfolio_schema import PortfolioCreate, PortfolioUpdate, PortfolioOut
from schemas.general_info_schema import CoinInfoIn, CoinInfoOut, CurrentBalance

from services.general_info_services import GeneralInfoService

from api.dependencies.user_dependencies import get_current_user

general_info_router = APIRouter()

@general_info_router.post('/current_balance', summary="update current balance with timestamp", response_model=CurrentBalance) 
async def update_current_balance(current_balance: CurrentBalance, user: User = Depends(get_current_user)):
  return await GeneralInfoService.update_current_balance(current_balance, user)

@general_info_router.get('/current_balance', summary="update current balance with timestamp", response_model=List[CurrentBalance])
async def get_current_balance(user: User = Depends(get_current_user)):
  return await GeneralInfoService.get_current_balance(user)




