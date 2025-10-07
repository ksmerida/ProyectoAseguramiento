from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/tables", tags=["Tables"])

# ----------------------------
# CRUD Mesas
# ----------------------------
@router.post("/", response_model=schemas.TableWithStatus)
def create_table(table: schemas.TableCreate, db: Session = Depends(get_db)):
    return crud.create_table(db, table)

@router.get("/", response_model=List[schemas.TableWithStatus])
def read_tables(db: Session = Depends(get_db)):
    return crud.get_tables_with_status(db)

@router.get("/{table_id}", response_model=schemas.TableWithStatus)
def read_table(table_id: uuid.UUID, db: Session = Depends(get_db)):
    db_table = crud.get_table(db, table_id)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table

@router.put("/{table_id}", response_model=schemas.TableWithStatus)
def update_table(table_id: uuid.UUID, table: schemas.TableCreate, db: Session = Depends(get_db)):
    db_table = crud.update_table(db, table_id, table)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table

@router.delete("/{table_id}", response_model=schemas.TableWithStatus)
def delete_table(table_id: uuid.UUID, db: Session = Depends(get_db)):
    db_table = crud.delete_table(db, table_id)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table

# ----------------------------
# PATCH para actualizar solo el estado
# ----------------------------
class TableStatusUpdate(schemas.BaseModel):
    status: str

@router.patch("/{table_id}/status", response_model=schemas.TableWithStatus)
def update_table_status(table_id: uuid.UUID, status_update: TableStatusUpdate = Body(...), db: Session = Depends(get_db)):
    table = crud.update_table_status(db, table_id, status_update.status)
    if not table:
        raise HTTPException(status_code=404, detail="Mesa no encontrada")
    return table

# ----------------------------
# eliminar mesa
# routers/tables.py
@router.delete("/{table_id}", response_model=schemas.TableWithStatus)
def delete_table_route(table_id: uuid.UUID, db: Session = Depends(get_db)):
    deleted_table = crud.delete_table(db, table_id)
    if not deleted_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return deleted_table

