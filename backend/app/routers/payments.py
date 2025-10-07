from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/", response_model=schemas.Payment)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    return crud.create_payment(db, payment)

@router.get("/", response_model=List[schemas.Payment])
def read_payments(db: Session = Depends(get_db)):
    return crud.get_payments(db)

@router.get("/{payment_id}", response_model=schemas.Payment)
def read_payment(payment_id: uuid.UUID, db: Session = Depends(get_db)):
    db_payment = crud.get_payment(db, payment_id)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment

@router.put("/{payment_id}", response_model=schemas.Payment)
def update_payment(payment_id: uuid.UUID, payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    db_payment = crud.update_payment(db, payment_id, payment)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment

@router.delete("/{payment_id}", response_model=schemas.Payment)
def delete_payment(payment_id: uuid.UUID, db: Session = Depends(get_db)):
    db_payment = crud.delete_payment(db, payment_id)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment
