from flask import Blueprint, request, jsonify
from app.services.ocr_service import OCRService

bp = Blueprint('ocr', __name__)
ocr_service = OCRService()

@bp.route('/analyze-bill', methods=['POST'])
def analyze_bill():
    """Analyze bill image and suggest category and amount"""
    if 'image' not in request.json:
        return jsonify({'error': 'No image data provided'}), 400

    try:
        # Extract text from image
        text = ocr_service.extract_text(request.json['image'])
        
        if not text:
            return jsonify({'error': 'Could not extract text from image'}), 400
        
        # Get suggested category and confidence
        category, confidence = ocr_service.suggest_category(text)
        
        # Extract amount
        amount = ocr_service.extract_amount(text)
        
        return jsonify({
            'extracted_text': text,
            'suggested_category': category,
            'confidence': confidence,
            'suggested_amount': amount
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500