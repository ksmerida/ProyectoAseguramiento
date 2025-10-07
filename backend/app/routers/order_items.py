from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/order_items", tags=["OrderItems"])

@router.post("/", response_model=schemas.OrderItem)
def create_order_item(item: schemas.OrderItemCreate, db: Session = Depends(get_db)):
    return crud.create_order_item(db, item)

@router.get("/", response_model=List[schemas.OrderItem])
def read_order_items(db: Session = Depends(get_db)):
    return crud.get_order_items(db)

@router.get("/{item_id}", response_model=schemas.OrderItem)
def read_order_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.get_order_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    return db_item

@router.put("/{item_id}", response_model=schemas.OrderItem)
def update_order_item(item_id: uuid.UUID, item: schemas.OrderItemCreate, db: Session = Depends(get_db)):
    db_item = crud.update_order_item(db, item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    return db_item

@router.delete("/{item_id}", response_model=schemas.OrderItem)
def delete_order_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.delete_order_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    return db_item
