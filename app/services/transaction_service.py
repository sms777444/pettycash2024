from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.models.transaction import Transaction, TransactionSchema
from app.database import get_db

class TransactionService:
    def __init__(self):
        self.db = get_db()
        self.collection = self.db.transactions
        self.schema = TransactionSchema()

    def create_transaction(self, transaction_data: dict) -> dict:
        transaction = self.schema.load(transaction_data)
        result = self.collection.insert_one(transaction)
        return self.get_transaction(result.inserted_id)

    def get_transaction(self, transaction_id: str) -> Optional[dict]:
        try:
            transaction = self.collection.find_one({'_id': ObjectId(transaction_id)})
            return self.schema.dump(transaction) if transaction else None
        except Exception:
            return None

    def get_transactions(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: dict = None,
        sort: tuple = None
    ) -> List[dict]:
        query = filters or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        if sort:
            cursor = cursor.sort(*sort)
        return [self.schema.dump(doc) for doc in cursor]

    def update_transaction(self, transaction_id: str, update_data: dict) -> Optional[dict]:
        try:
            self.collection.update_one(
                {'_id': ObjectId(transaction_id)},
                {'$set': update_data}
            )
            return self.get_transaction(transaction_id)
        except Exception:
            return None

    def delete_transaction(self, transaction_id: str) -> bool:
        try:
            result = self.collection.delete_one({'_id': ObjectId(transaction_id)})
            return result.deleted_count > 0
        except Exception:
            return False

    def get_person_balances(self) -> List[dict]:
        pipeline = [
            {
                '$group': {
                    '_id': '$person',
                    'receipts': {
                        '$sum': {
                            '$cond': [{'$eq': ['$type', 'receipt']}, '$amount', 0]
                        }
                    },
                    'expenses': {
                        '$sum': {
                            '$cond': [{'$eq': ['$type', 'expense']}, '$amount', 0]
                        }
                    }
                }
            },
            {
                '$project': {
                    'person': '$_id',
                    'receipts': 1,
                    'expenses': 1,
                    'balance': {'$subtract': ['$receipts', '$expenses']}
                }
            }
        ]
        return list(self.collection.aggregate(pipeline))