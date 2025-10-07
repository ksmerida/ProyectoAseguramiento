from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.post("/", response_model=schemas.Invoice)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    return crud.create_invoice(db, invoice)

@router.get("/", response_model=List[schemas.Invoice])
def read_invoices(db: Session = Depends(get_db)):
    return crud.get_invoices(db)

@router.get("/{invoice_id}", response_model=schemas.Invoice)
def read_invoice(invoice_id: uuid.UUID, db: Session = Depends(get_db)):
    db_invoice = crud.get_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice

@router.put("/{invoice_id}", response_model=schemas.Invoice)
def update_invoice(invoice_id: uuid.UUID, invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = crud.update_invoice(db, invoice_id, invoice)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice

@router.delete("/{invoice_id}", response_model=schemas.Invoice)
def delete_invoice(invoice_id: uuid.UUID, db: Session = Depends(get_db)):
    db_invoice = crud.delete_invoice(db, invoice_id)
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return db_invoice
