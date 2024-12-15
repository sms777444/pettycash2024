from typing import Optional
from marshmallow import Schema, fields

class ThresholdSchema(Schema):
    person = fields.String(required=True)
    low_threshold = fields.Float(required=True)
    medium_threshold = fields.Float(required=True)

class Threshold:
    def __init__(
        self,
        person: str,
        low_threshold: float = 500.0,
        medium_threshold: float = 3500.0
    ):
        self.person = person
        self.low_threshold = low_threshold
        self.medium_threshold = medium_threshold