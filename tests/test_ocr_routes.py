import json
import base64

def test_analyze_bill_no_image(client):
    response = client.post(
        '/api/ocr/analyze-bill',
        data=json.dumps({}),
        content_type='application/json'
    )
    assert response.status_code == 400
    assert b'No image data provided' in response.data

def test_analyze_bill_invalid_image(client):
    data = {'image': 'invalid_base64'}
    response = client.post(
        '/api/ocr/analyze-bill',
        data=json.dumps(data),
        content_type='application/json'
    )
    assert response.status_code == 500