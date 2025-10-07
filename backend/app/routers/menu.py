from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=list[schemas.Menu])
def read_menu(db: Session = Depends(get_db)):
    return crud.get_menu(db)

@router.post("/", response_model=schemas.Menu)
def create_menu(item: schemas.MenuCreate, db: Session = Depends(get_db)):
    return crud.create_menu(db, item)
