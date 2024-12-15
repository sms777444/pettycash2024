from typing import Dict, Any
from datetime import datetime

def build_transaction_filters(args: Dict[str, Any]) -> Dict[str, Any]:
    filters = {}
    
    if search := args.get('search'):
        filters['$or'] = [
            {'description': {'$regex': search, '$options': 'i'}},
            {'category': {'$regex': search, '$options': 'i'}},
            {'person': {'$regex': search, '$options': 'i'}},
            {'project': {'$regex': search, '$options': 'i'}}
        ]
    
    if type_ := args.get('type'):
        filters['type'] = type_
    
    if person := args.get('person'):
        filters['person'] = person
    
    if project := args.get('project'):
        filters['project'] = project
    
    if category := args.get('category'):
        filters['category'] = category
    
    # Date range filter
    date_filter = {}
    if start_date := args.get('start_date'):
        date_filter['$gte'] = datetime.strptime(start_date, '%Y-%m-%d')
    if end_date := args.get('end_date'):
        date_filter['$lte'] = datetime.strptime(end_date, '%Y-%m-%d')
    if date_filter:
        filters['date'] = date_filter
    
    return filters