from typing import Dict, Any
from app.models.filters import TransactionFilter

class TransactionFilterBuilder:
    @staticmethod
    def build_query(filter_params: TransactionFilter) -> Dict[str, Any]:
        query = {}
        
        if filter_params.search:
            query["$or"] = [
                {"description": {"$regex": filter_params.search, "$options": "i"}},
                {"category": {"$regex": filter_params.search, "$options": "i"}},
                {"person": {"$regex": filter_params.search, "$options": "i"}},
                {"project": {"$regex": filter_params.search, "$options": "i"}}
            ]
        
        if filter_params.type:
            query["type"] = filter_params.type
            
        if filter_params.person:
            query["person"] = filter_params.person
            
        if filter_params.project:
            query["project"] = filter_params.project
            
        if filter_params.category:
            query["category"] = filter_params.category
            
        date_query = {}
        if filter_params.start_date:
            date_query["$gte"] = filter_params.start_date
        if filter_params.end_date:
            date_query["$lte"] = filter_params.end_date
        if date_query:
            query["date"] = date_query
            
        return query

    @staticmethod
    def get_sort_params(filter_params: TransactionFilter) -> Dict[str, int]:
        if not filter_params.sort_field:
            return {"date": -1}  # Default sort by date descending
            
        direction = -1 if filter_params.sort_direction == "desc" else 1
        return {filter_params.sort_field: direction}