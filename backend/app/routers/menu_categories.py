from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db
import uuid

router = APIRouter(prefix="/menu_categories", tags=["MenuCategories"])

@router.post("/", response_model=schemas.MenuCategory)
def create_category(category: schemas.MenuCategoryCreate, db: Session = Depends(get_db)):
    return crud.create_menu_category(db, category)

@router.get("/", response_model=List[schemas.MenuCategory])
def read_categories(db: Session = Depends(get_db)):
    return crud.get_menu_categories(db)

@router.get("/{category_id}", response_model=schemas.MenuCategory)
def read_category(category_id: uuid.UUID, db: Session = Depends(get_db)):
    db_category = crud.get_menu_category(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Menu category not found")
    return db_category

@router.put("/{category_id}", response_model=schemas.MenuCategory)
def update_category(category_id: uuid.UUID, category: schemas.MenuCategoryCreate, db: Session = Depends(get_db)):
    db_category = crud.update_menu_category(db, category_id, category)
    if not db_category:
        raise HTTPException(status_code=404, detail="Menu category not found")
    return db_category

@router.delete("/{category_id}", response_model=schemas.MenuCategory)
def delete_category(category_id: uuid.UUID, db: Session = Depends(get_db)):
    db_category = crud.delete_menu_category(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Menu category not found")
    return db_category
