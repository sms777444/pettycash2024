from flask import Blueprint, request, jsonify
from app.services.transaction_service import TransactionService
from app.utils.pagination import get_pagination_params
from app.utils.filters import build_transaction_filters

bp = Blueprint('transactions', __name__)
transaction_service = TransactionService()

@bp.route('/', methods=['GET'])
def get_transactions():
    skip, limit = get_pagination_params()
    filters = build_transaction_filters(request.args)
    sort = (request.args.get('sort_field', 'date'), 
            -1 if request.args.get('sort_direction', 'desc') == 'desc' else 1)
    
    transactions = transaction_service.get_transactions(skip, limit, filters, sort)
    return jsonify(transactions)

@bp.route('/', methods=['POST'])
def create_transaction():
    transaction = transaction_service.create_transaction(request.json)
    return jsonify(transaction), 201

@bp.route('/<transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    transaction = transaction_service.get_transaction(transaction_id)
    if not transaction:
        return {'message': 'Transaction not found'}, 404
    return jsonify(transaction)

@bp.route('/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    transaction = transaction_service.update_transaction(transaction_id, request.json)
    if not transaction:
        return {'message': 'Transaction not found'}, 404
    return jsonify(transaction)

@bp.route('/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    if transaction_service.delete_transaction(transaction_id):
        return '', 204
    return {'message': 'Transaction not found'}, 404

@bp.route('/balances', methods=['GET'])
def get_person_balances():
    balances = transaction_service.get_person_balances()
    return jsonify(balances)