from typing import Optional
from app.models.thresholds import BalanceThreshold, ThresholdUpdate

class ThresholdService:
    def __init__(self, database):
        self.db = database
        self.collection = database.thresholds

    async def get_threshold(self, person: str) -> Optional[BalanceThreshold]:
        threshold = await self.collection.find_one({"person": person})
        if threshold:
            return BalanceThreshold(**threshold)
        return None

    async def update_threshold(self, person: str, threshold: ThresholdUpdate) -> BalanceThreshold:
        threshold_dict = threshold.model_dump()
        threshold_dict["person"] = person
        
        await self.collection.update_one(
            {"person": person},
            {"$set": threshold_dict},
            upsert=True
        )
        
        return BalanceThreshold(
            person=person,
            low_threshold=threshold.low_threshold,
            medium_threshold=threshold.medium_threshold
        )