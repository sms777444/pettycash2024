from pydantic import BaseModel, Field

class BalanceThreshold(BaseModel):
    person: str
    low_threshold: float = Field(default=500.0)
    medium_threshold: float = Field(default=3500.0)

class ThresholdUpdate(BaseModel):
    low_threshold: float
    medium_threshold: float