from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)

@router.get("/", response_model=List[schemas.Order])
def read_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@router.get("/{order_id}", response_model=schemas.Order)
def read_order(order_id: uuid.UUID, db: Session = Depends(get_db)):
    db_order = crud.get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.put("/{order_id}", response_model=schemas.Order)
def update_order(order_id: uuid.UUID, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = crud.update_order(db, order_id, order)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.delete("/{order_id}", response_model=schemas.Order)
def delete_order(order_id: uuid.UUID, db: Session = Depends(get_db)):
    db_order = crud.delete_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order
