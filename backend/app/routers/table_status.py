from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/table_status", tags=["TableStatus"])

@router.post("/", response_model=schemas.TableStatus)
def create_table_status(status: schemas.TableStatusCreate, db: Session = Depends(get_db)):
    return crud.create_table_status(db, status)

@router.get("/", response_model=List[schemas.TableStatus])
def read_table_status(db: Session = Depends(get_db)):
    return crud.get_table_status(db)

@router.get("/{status_id}", response_model=schemas.TableStatus)
def read_single_status(status_id: uuid.UUID, db: Session = Depends(get_db)):
    db_status = crud.get_table_status_by_id(db, status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail="Table status not found")
    return db_status

@router.put("/{status_id}", response_model=schemas.TableStatus)
def update_table_status(status_id: uuid.UUID, status: schemas.TableStatusCreate, db: Session = Depends(get_db)):
    db_status = crud.update_table_status(db, status_id, status)
    if not db_status:
        raise HTTPException(status_code=404, detail="Table status not found")
    return db_status

@router.delete("/{status_id}", response_model=schemas.TableStatus)
def delete_table_status(status_id: uuid.UUID, db: Session = Depends(get_db)):
    db_status = crud.delete_table_status(db, status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail="Table status not found")
    return db_status
