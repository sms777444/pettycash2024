from pymongo import MongoClient
from flask import current_app, g
from typing import Optional

def get_db() -> MongoClient:
    """Get database connection"""
    if 'db' not in g:
        g.db = MongoClient(current_app.config['MONGODB_URL'])[
            current_app.config['DATABASE_NAME']
        ]
    return g.db

def close_db(e: Optional[BaseException] = None) -> None:
    """Close database connection"""
    db = g.pop('db', None)
    if db is not None:
        db.client.close()