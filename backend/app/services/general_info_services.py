from typing import List
from uuid import UUID
import requests
import json

from models.user_model import User
from models.portofolio_model import Portfolio, Asset, Transaction
from models.general_info_model import CoinInfo

from schemas.general_info_schema import CoinInfoIn, CoinInfoOut

class GeneralInfoService:
  @staticmethod
  async def get_all_coin_info() -> List[CoinInfoOut]:
    response = requests.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1')
    
    coins = response.json()

    coin_info = []

    if response.status_code == 200:
      for item in coins:
        CoinInfo.insert({'coin':item['id']}, {'symbol': item['symbol']}, {'image_url': item['image']})
    
    
    
    
      
    print(coin_info)

  @staticmethod
  async def get_coin_logos(asset: Asset) -> List[CoinInfoOut]:
    pass

