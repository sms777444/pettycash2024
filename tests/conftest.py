import pytest
from app import create_app
from config import TestConfig
from app.database import get_db

@pytest.fixture
def app():
    app = create_app(TestConfig)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db(app):
    with app.app_context():
        db = get_db()
        # Clear test database before each test
        db.client.drop_database(TestConfig.DATABASE_NAME)
        yield db
        # Clean up after tests
        db.client.drop_database(TestConfig.DATABASE_NAME)