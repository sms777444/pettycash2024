import pytesseract
from PIL import Image
import io
import base64
import re
from typing import Tuple, Optional
from app.database import get_db

class OCRService:
    def __init__(self):
        self.db = get_db()
        self.collection = self.db.transactions

    def preprocess_image(self, image_data: str) -> Image.Image:
        """Preprocess the image for better OCR results"""
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to grayscale and increase contrast
        image = image.convert('L')
        return image.point(lambda x: 0 if x < 128 else 255)

    def extract_text(self, image_data: str) -> str:
        """Extract text from image using OCR"""
        try:
            image = self.preprocess_image(image_data)
            return pytesseract.image_to_string(image)
        except Exception as e:
            print(f"OCR Error: {str(e)}")
            return ""

    def extract_amount(self, text: str) -> Optional[float]:
        """Extract the total amount from the bill text"""
        amount_patterns = [
            r'total[\s:]*[\$]?\s*(\d+[.,]\d{2})',
            r'amount[\s:]*[\$]?\s*(\d+[.,]\d{2})',
            r'[\$]?\s*(\d+[.,]\d{2})\s*$'
        ]
        
        for pattern in amount_patterns:
            matches = re.finditer(pattern, text.lower())
            amounts = [float(m.group(1).replace(',', '')) for m in matches]
            if amounts:
                return max(amounts)
        return None

    async def suggest_category(self, text: str) -> Tuple[str, float]:
        """Suggest a category based on bill content"""
        category_keywords = {
            'Office Supplies': ['paper', 'pen', 'stapler', 'ink', 'toner'],
            'Travel': ['taxi', 'uber', 'flight', 'hotel', 'train'],
            'Meals': ['restaurant', 'food', 'lunch', 'dinner', 'cafe'],
            'Utilities': ['electricity', 'water', 'internet', 'phone'],
            'Equipment': ['computer', 'laptop', 'monitor', 'keyboard'],
        }

        text_lower = text.lower()
        scores = {}
        
        for category, keywords in category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                scores[category] = score / len(keywords)

        if not scores:
            return "Miscellaneous", 0.0

        best_category = max(scores.items(), key=lambda x: x[1])
        return best_category