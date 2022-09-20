from typing import List
from uuid import UUID
import requests
import json
import http3

from models.user_model import User
from models.portofolio_model import Portfolio, Asset, Transaction, LogData
from models.general_info_model import CoinInfo, CurrentBalance

from schemas.general_info_schema import CoinInfoIn, CoinInfoOut
from schemas.assets_schema import AssetOut

class GeneralInfoService:

  @staticmethod
  async def update_current_balance(current_balance: CurrentBalance, user: User) -> CurrentBalance:
    balance = LogData(**current_balance.dict(), user=user)
    return await balance.insert()

  @staticmethod
  async def get_current_balance(user: User) -> List[CurrentBalance]:
    log_data = await LogData.find(LogData.user.id == user.id).to_list()
    return log_data

