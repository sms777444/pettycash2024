from flask import Flask
from flask_cors import CORS
from config import Config
from app.database import close_db
from app.routes import transaction_routes, ocr_routes

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    # Register blueprints
    app.register_blueprint(transaction_routes.bp, url_prefix='/api/transactions')
    app.register_blueprint(ocr_routes.bp, url_prefix='/api/ocr')

    # Register database connection close
    app.teardown_appcontext(close_db)

    return app