import json
from bson import ObjectId

def test_create_transaction(client, db):
    data = {
        "date": "2024-03-14T00:00:00",
        "description": "Test Transaction",
        "amount": 100.00,
        "type": "expense",
        "category": "Office Supplies",
        "person": "John Doe",
        "project": "Test Project"
    }
    
    response = client.post(
        '/api/transactions/',
        data=json.dumps(data),
        content_type='application/json'
    )
    
    assert response.status_code == 201
    result = json.loads(response.data)
    assert result['description'] == data['description']
    assert result['amount'] == data['amount']

def test_get_transactions(client, db):
    response = client.get('/api/transactions/')
    assert response.status_code == 200
    assert isinstance(json.loads(response.data), list)

def test_get_transaction_not_found(client, db):
    response = client.get(f'/api/transactions/{str(ObjectId())}')
    assert response.status_code == 404