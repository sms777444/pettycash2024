from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.models.transaction import TransactionCreate, TransactionDB, TransactionUpdate
from app.models.filters import TransactionFilter
from app.services.transaction_service import TransactionService
from app.core.database import get_database

router = APIRouter()

@router.get("/", response_model=List[TransactionDB])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    type: Optional[str] = None,
    person: Optional[str] = None,
    project: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    sort_field: Optional[str] = None,
    sort_direction: Optional[str] = "desc",
    db = Depends(get_database)
):
    filters = TransactionFilter(
        search=search,
        type=type,
        person=person,
        project=project,
        category=category,
        start_date=start_date,
        end_date=end_date,
        sort_field=sort_field,
        sort_direction=sort_direction
    )
    
    transaction_service = TransactionService(db)
    return await transaction_service.get_transactions(skip, limit, filters)

@router.post("/", response_model=TransactionDB)
async def create_transaction(
    transaction: TransactionCreate,
    db = Depends(get_database)
):
    transaction_service = TransactionService(db)
    return await transaction_service.create_transaction(transaction)

@router.get("/{transaction_id}", response_model=TransactionDB)
async def get_transaction(
    transaction_id: str,
    db = Depends(get_database)
):
    transaction_service = TransactionService(db)
    transaction = await transaction_service.get_transaction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.put("/{transaction_id}", response_model=TransactionDB)
async def update_transaction(
    transaction_id: str,
    transaction: TransactionUpdate,
    db = Depends(get_database)
):
    transaction_service = TransactionService(db)
    updated_transaction = await transaction_service.update_transaction(
        transaction_id,
        transaction
    )
    if not updated_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated_transaction

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    db = Depends(get_database)
):
    transaction_service = TransactionService(db)
    success = await transaction_service.delete_transaction(transaction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}