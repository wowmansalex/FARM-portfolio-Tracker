from fastapi import APIRouter

from api.v1.handlers.user_router import user_router
from api.auth.jwt import auth_router
from api.v1.handlers.portfolio_router import portfolio_router
from api.v1.handlers.asset_router import asset_router
from api.v1.handlers.transaction_router import transaction_router
from api.v1.handlers.general_info_router import general_info_router

router = APIRouter()

router.include_router(user_router, prefix='/user', tags=['Users'])
router.include_router(auth_router, prefix='/auth', tags=['Authentication'])
router.include_router(portfolio_router, prefix='/portfolio', tags=['Portfolio'])
router.include_router(asset_router, prefix='/asset', tags=['Assets'])
router.include_router(transaction_router, prefix='/transaction', tags=['Transactions'])
router.include_router(general_info_router, prefix='/general', tags=['General Info about Cryptycurrencies used'])

