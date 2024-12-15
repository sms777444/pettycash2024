from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionFilter(BaseModel):
    search: Optional[str] = None
    type: Optional[str] = None
    person: Optional[str] = None
    project: Optional[str] = None
    category: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    sort_field: Optional[str] = None
    sort_direction: Optional[str] = "desc"