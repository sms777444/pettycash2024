from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from app.services.transaction_service import TransactionService
from app.models.transaction import TransactionSchema
from app.utils.pagination import get_pagination_params
from app.utils.filters import build_transaction_filters

bp = Blueprint('transactions', __name__)
transaction_schema = TransactionSchema()

@bp.route('/', methods=['GET'])
def get_transactions():
    skip, limit = get_pagination_params()
    filters = build_transaction_filters(request.args)
    
    service = TransactionService(current_app.db)
    transactions = service.get_transactions(skip, limit, filters)
    
    return jsonify([transaction_schema.dump(t) for t in transactions])

@bp.route('/', methods=['POST'])
def create_transaction():
    data = transaction_schema.load(request.json)
    service = TransactionService(current_app.db)
    transaction = service.create_transaction(data)
    return jsonify(transaction_schema.dump(transaction)), 201

@bp.route('/<transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    service = TransactionService(current_app.db)
    transaction = service.get_transaction(ObjectId(transaction_id))
    if not transaction:
        return {'message': 'Transaction not found'}, 404
    return jsonify(transaction_schema.dump(transaction))

@bp.route('/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = transaction_schema.load(request.json, partial=True)
    service = TransactionService(current_app.db)
    transaction = service.update_transaction(ObjectId(transaction_id), data)
    if not transaction:
        return {'message': 'Transaction not found'}, 404
    return jsonify(transaction_schema.dump(transaction))

@bp.route('/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    service = TransactionService(current_app.db)
    if service.delete_transaction(ObjectId(transaction_id)):
        return '', 204
    return {'message': 'Transaction not found'}, 404

@bp.route('/balances', methods=['GET'])
def get_person_balances():
    service = TransactionService(current_app.db)
    balances = service.get_person_balances()
    return jsonify(balances)