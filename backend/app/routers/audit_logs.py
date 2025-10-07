from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/audit_logs", tags=["AuditLogs"])

@router.post("/", response_model=schemas.AuditLog)
def create_audit_log(log: schemas.AuditLogCreate, db: Session = Depends(get_db)):
    return crud.create_audit_log(db, log)

@router.get("/", response_model=List[schemas.AuditLog])
def read_audit_logs(db: Session = Depends(get_db)):
    return crud.get_audit_logs(db)

@router.get("/{log_id}", response_model=schemas.AuditLog)
def read_audit_log(log_id: uuid.UUID, db: Session = Depends(get_db)):
    db_log = crud.get_audit_log(db, log_id)
    if not db_log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return db_log

@router.put("/{log_id}", response_model=schemas.AuditLog)
def update_audit_log(log_id: uuid.UUID, log: schemas.AuditLogCreate, db: Session = Depends(get_db)):
    db_log = crud.update_audit_log(db, log_id, log)
    if not db_log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return db_log

@router.delete("/{log_id}", response_model=schemas.AuditLog)
def delete_audit_log(log_id: uuid.UUID, db: Session = Depends(get_db)):
    db_log = crud.delete_audit_log(db, log_id)
    if not db_log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return db_log
