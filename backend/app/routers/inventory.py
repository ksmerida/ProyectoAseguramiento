from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db
import uuid

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.post("/", response_model=schemas.Inventory)
def create_inventory(item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    return crud.create_inventory(db, item)

@router.get("/", response_model=List[schemas.Inventory])
def read_inventory(db: Session = Depends(get_db)):
    return crud.get_inventory(db)

@router.get("/{item_id}", response_model=schemas.Inventory)
def read_inventory_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.get_inventory_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return db_item

@router.put("/{item_id}", response_model=schemas.Inventory)
def update_inventory(item_id: uuid.UUID, item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    db_item = crud.update_inventory(db, item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return db_item

@router.delete("/{item_id}", response_model=schemas.Inventory)
def delete_inventory(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.delete_inventory(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return db_item
