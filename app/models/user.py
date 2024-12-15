from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserDB(UserBase):
    id: str
    hashed_password: str

    class Config:
        json_encoders = {ObjectId: str}