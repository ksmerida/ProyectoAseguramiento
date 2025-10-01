from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db
import uuid

router = APIRouter(prefix="/tables", tags=["Tables"])

@router.post("/", response_model=schemas.Table)
def create_table(table: schemas.TableCreate, db: Session = Depends(get_db)):
    return crud.create_table(db, table)

@router.get("/", response_model=List[schemas.Table])
def read_tables(db: Session = Depends(get_db)):
    return crud.get_tables(db)

@router.get("/{table_id}", response_model=schemas.Table)
def read_table(table_id: uuid.UUID, db: Session = Depends(get_db)):
    db_table = crud.get_table(db, table_id)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table

@router.put("/{table_id}", response_model=schemas.Table)
def update_table(table_id: uuid.UUID, table: schemas.TableCreate, db: Session = Depends(get_db)):
    db_table = crud.update_table(db, table_id, table)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table

@router.delete("/{table_id}", response_model=schemas.Table)
def delete_table(table_id: uuid.UUID, db: Session = Depends(get_db)):
    db_table = crud.delete_table(db, table_id)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table
