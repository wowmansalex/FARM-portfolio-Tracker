from typing import List
from uuid import UUID

from models.user_model import User
from models.portofolio_model import Portfolio

from schemas.portfolio_schema import PortfolioCreate, PortfolioUpdate, PortfolioOut

class PortfolioService:
  @staticmethod
  async def list_portfolios(user: User) -> List[Portfolio]:
    portfolios = await Portfolio.find(Portfolio.user.id == user.id).to_list()
    return portfolios

  @staticmethod
  async def create_portfolio(user: User, data: PortfolioCreate) -> Portfolio:
    portfolio = Portfolio(**data.dict(), user=user)
    return await portfolio.insert()

  @staticmethod
  async def get_portfolio(portfolio_id: UUID, user: User):
    portfolio = await Portfolio.find_one(Portfolio.portfolio_id == portfolio_id, Portfolio.user.id == user.id)
    return portfolio

  @staticmethod
  async def update_portfolio(user: User, portfolio_id: UUID, data: PortfolioUpdate):
    portofolio = await PortfolioService.get_portfolio(user, portfolio_id)
    await portfolio.update({"$set": data.dict(exclude_unset=True)})

    await portofolio.save()

    return portfolio

  @staticmethod
  async def delete_portfolio(user: User, portfolio_id: UUID) -> None:
    portfolio = await PortfolioService.get_portfolio(user, portfolio_id)
    if portfolio:
      await portfolio.delete()

    return None