from datetime import datetime
from typing import Optional
from bson import ObjectId
from marshmallow import Schema, fields, validate

class TransactionSchema(Schema):
    id = fields.String(attribute='_id', dump_only=True)
    date = fields.DateTime(required=True)
    description = fields.String(required=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    type = fields.String(required=True, validate=validate.OneOf(['receipt', 'expense']))
    category = fields.String(required=True)
    person = fields.String(required=True)
    project = fields.String(required=True)
    bill_image = fields.String(allow_none=True)

    class Meta:
        unknown = True

class Transaction:
    def __init__(
        self,
        date: datetime,
        description: str,
        amount: float,
        type: str,
        category: str,
        person: str,
        project: str,
        bill_image: Optional[str] = None,
        _id: Optional[ObjectId] = None
    ):
        self._id = _id
        self.date = date
        self.description = description
        self.amount = amount
        self.type = type
        self.category = category
        self.person = person
        self.project = project
        self.bill_image = bill_image