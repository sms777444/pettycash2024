from flask import request
from typing import Tuple

def get_pagination_params() -> Tuple[int, int]:
    """Get pagination parameters from request args"""
    try:
        skip = int(request.args.get('skip', 0))
        limit = min(int(request.args.get('limit', 100)), 1000)
        return max(0, skip), max(1, limit)
    except ValueError:
        return 0, 100