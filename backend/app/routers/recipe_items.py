from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/recipe_items", tags=["RecipeItems"])

@router.post("/", response_model=schemas.RecipeItem)
def create_recipe_item(item: schemas.RecipeItemCreate, db: Session = Depends(get_db)):
    return crud.create_recipe_item(db, item)

@router.get("/", response_model=List[schemas.RecipeItem])
def read_recipe_items(db: Session = Depends(get_db)):
    return crud.get_recipe_items(db)

@router.get("/{item_id}", response_model=schemas.RecipeItem)
def read_recipe_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.get_recipe_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Recipe item not found")
    return db_item

@router.put("/{item_id}", response_model=schemas.RecipeItem)
def update_recipe_item(item_id: uuid.UUID, item: schemas.RecipeItemCreate, db: Session = Depends(get_db)):
    db_item = crud.update_recipe_item(db, item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Recipe item not found")
    return db_item

@router.delete("/{item_id}", response_model=schemas.RecipeItem)
def delete_recipe_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.delete_recipe_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Recipe item not found")
    return db_item
