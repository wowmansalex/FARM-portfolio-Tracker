from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, status, Depends
import pymongo

from models.user_model import User
from schemas.portfolio_schema import PortfolioCreate, PortfolioUpdate, PortfolioOut

from services.portfolio_service import PortfolioService

from api.dependencies.user_dependencies import get_current_user

portfolio_router = APIRouter()

@portfolio_router.get('/list', summary="Get a list of all portfolio the user has", response_model=List[PortfolioOut])
async def portfolio_list(user: User = Depends(get_current_user)):
  return await PortfolioService.list_portfolios(user)

@portfolio_router.post('/create', summary="Create a portfolio", response_model=PortfolioOut)
async def create_portfolio(data: PortfolioCreate, user = Depends(get_current_user)):
  return await PortfolioService.create_portfolio(user, data)

@portfolio_router.get('/{portfolio_id}', summary="Get portfolio by by portfolio_id", response_model=PortfolioOut)
async def get(portfolio_id: UUID, user: User = Depends(get_current_user)):
  return await PortfolioService.get_portfolio(portfolio_id, user)

@portfolio_router.put('/{portfolio_id}', summary="Edit portfolio by portfolio_id", response_model=PortfolioOut)
async def update(portfolio_id: UUID, data: PortfolioUpdate, user: User = Depends(get_current_user)):
  return await PortfolioService.update_portfolio(user, portfolio_id, data)

@portfolio_router.delete('/{portfolio_id}', summary="Delete a portfolio by portfolio_id")
async def delete(portfolio_id: UUID, user: User = Depends(get_current_user)):
  await PortfolioService.delete_portfolio(portfolio_id, user)
  return None