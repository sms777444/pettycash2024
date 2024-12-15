from typing import Optional
from passlib.context import CryptContext
from app.models.user import UserCreate, UserDB

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, database):
        self.db = database
        self.collection = database.users

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    async def create_user(self, user: UserCreate) -> UserDB:
        hashed_password = self.get_password_hash(user.password)
        user_dict = user.model_dump()
        user_dict["hashed_password"] = hashed_password
        del user_dict["password"]
        
        result = await self.collection.insert_one(user_dict)
        user_dict["id"] = str(result.inserted_id)
        return UserDB(**user_dict)

    async def get_user_by_email(self, email: str) -> Optional[UserDB]:
        user_dict = await self.collection.find_one({"email": email})
        if user_dict:
            user_dict["id"] = str(user_dict["_id"])
            return UserDB(**user_dict)
        return None