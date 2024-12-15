from fastapi import APIRouter, HTTPException, Depends
from app.models.thresholds import BalanceThreshold, ThresholdUpdate
from app.services.threshold_service import ThresholdService
from app.core.database import get_database

router = APIRouter()

@router.get("/{person}", response_model=BalanceThreshold)
async def get_person_threshold(
    person: str,
    db = Depends(get_database)
):
    threshold_service = ThresholdService(db)
    threshold = await threshold_service.get_threshold(person)
    if not threshold:
        # Return default thresholds if not set
        return BalanceThreshold(person=person)
    return threshold

@router.put("/{person}", response_model=BalanceThreshold)
async def update_person_threshold(
    person: str,
    threshold: ThresholdUpdate,
    db = Depends(get_database)
):
    threshold_service = ThresholdService(db)
    return await threshold_service.update_threshold(person, threshold)