from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import crud, schemas
from backend.app.database import get_db
import uuid

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.post("/", response_model=schemas.Reservation)
def create_reservation(reservation: schemas.ReservationCreate, db: Session = Depends(get_db)):
    return crud.create_reservation(db, reservation)

@router.get("/", response_model=List[schemas.Reservation])
def read_reservations(db: Session = Depends(get_db)):
    return crud.get_reservations(db)

@router.get("/{reservation_id}", response_model=schemas.Reservation)
def read_reservation(reservation_id: uuid.UUID, db: Session = Depends(get_db)):
    db_reservation = crud.get_reservation(db, reservation_id)
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation

@router.put("/{reservation_id}", response_model=schemas.Reservation)
def update_reservation(reservation_id: uuid.UUID, reservation: schemas.ReservationCreate, db: Session = Depends(get_db)):
    db_reservation = crud.update_reservation(db, reservation_id, reservation)
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation

@router.delete("/{reservation_id}", response_model=schemas.Reservation)
def delete_reservation(reservation_id: uuid.UUID, db: Session = Depends(get_db)):
    db_reservation = crud.delete_reservation(db, reservation_id)
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation
