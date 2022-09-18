from typing import Any

from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from jose import jwt

from services.user_service import UserService
from core.security import create_access_token, create_refresh_token
from core.config import settings
from schemas.user_schema import UserOut
from models.user_model import User
from services.user_service import UserService
from schemas.auth_schema import TokenSchema, TokenPayload
from api.dependencies.user_dependencies import get_current_user

auth_router = APIRouter()

@auth_router.post('/login', summary="Create access and refresh tokens for user", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):

  user = await UserService.authenticate(email=form_data.username, password=form_data.password)
  if not user:
    raise HTTPException(status=status.HTTP_404_NOT_FOUND, detail='incorrent email or password')

  return {
    "access_token": create_access_token(user.user_id),
    "refresh_token": create_refresh_token(user.user_id)
  }

@auth_router.post('/test-token', summary="test if token is valid", response_model=UserOut)
async def test_token(token: str = Body(...)):
  try:
    payload = json.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
    )
    if datetime.fromtimestamp(token_data.exp) > datetime.now():
      return user

  except:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN, 
      detail="Token is expired", 
      headers={"WWW-Authenticate": "Bearer"})

@auth_router.post('/refresh-token', summary="refresh token", response_model=TokenSchema)
async def refresh_token(refresh_token: str = Body(...)):
  try:
    payload = jwt.decode(
      token, settings.JWT_REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM]
    )
    token_data = TokenPayload(**payload)

    if datetime.fromtimestamp(token_data.exp) < datetime.now():
      raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED, 
      detail="Token is expired", 
      headers={"WWW-Authenticate": "Bearer"})
  except(jwt.JWTError, ValidationError):
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN, 
      detail="Token is expired", 
      headers={"WWW-Authenticate": "Bearer"})

  user = await UserService.get_user_by_id(token_data.sub)

  if not user:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND, 
      detail="User not found", 
      )

  return user
