from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from app.services.ocr_service import OCRService
from app.core.database import get_database
from typing import Dict
import base64

router = APIRouter()

@router.post("/analyze-bill")
async def analyze_bill(
    image_data: Dict[str, str],
    db = Depends(get_database)
):
    """Analyze bill image and suggest category and amount"""
    ocr_service = OCRService(db)
    
    try:
        # Extract text from image
        text = ocr_service.extract_text(image_data["image"])
        
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from image")
        
        # Get suggested category and confidence
        category, confidence = await ocr_service.suggest_category(text)
        
        # Extract amount
        amount = ocr_service.extract_amount(text)
        
        return {
            "extracted_text": text,
            "suggested_category": category,
            "confidence": confidence,
            "suggested_amount": amount
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))