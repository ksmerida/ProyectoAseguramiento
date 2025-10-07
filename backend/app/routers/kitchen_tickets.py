from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/kitchen_tickets", tags=["KitchenTickets"])

@router.post("/", response_model=schemas.KitchenTicket)
def create_ticket(ticket: schemas.KitchenTicketCreate, db: Session = Depends(get_db)):
    return crud.create_kitchen_ticket(db, ticket)

@router.get("/", response_model=List[schemas.KitchenTicket])
def read_tickets(db: Session = Depends(get_db)):
    return crud.get_kitchen_tickets(db)

@router.get("/{ticket_id}", response_model=schemas.KitchenTicket)
def read_ticket(ticket_id: uuid.UUID, db: Session = Depends(get_db)):
    db_ticket = crud.get_kitchen_ticket(db, ticket_id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Kitchen ticket not found")
    return db_ticket

@router.put("/{ticket_id}", response_model=schemas.KitchenTicket)
def update_ticket(ticket_id: uuid.UUID, ticket: schemas.KitchenTicketCreate, db: Session = Depends(get_db)):
    db_ticket = crud.update_kitchen_ticket(db, ticket_id, ticket)
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Kitchen ticket not found")
    return db_ticket

@router.delete("/{ticket_id}", response_model=schemas.KitchenTicket)
def delete_ticket(ticket_id: uuid.UUID, db: Session = Depends(get_db)):
    db_ticket = crud.delete_kitchen_ticket(db, ticket_id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Kitchen ticket not found")
    return db_ticket
