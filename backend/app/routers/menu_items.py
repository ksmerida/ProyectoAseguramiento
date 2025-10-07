from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db
import uuid

router = APIRouter(prefix="/menu_items", tags=["MenuItems"])

@router.post("/", response_model=schemas.MenuItem)
def create_menu_item(item: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    return crud.create_menu_item(db, item)

@router.get("/", response_model=List[schemas.MenuItem])
def read_menu_items(db: Session = Depends(get_db)):
    return crud.get_menu_items(db)

@router.get("/{item_id}", response_model=schemas.MenuItem)
def read_menu_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.get_menu_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item

@router.put("/{item_id}", response_model=schemas.MenuItem)
def update_menu_item(item_id: uuid.UUID, item: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    db_item = crud.update_menu_item(db, item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item

@router.delete("/{item_id}", response_model=schemas.MenuItem)
def delete_menu_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.delete_menu_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_item
