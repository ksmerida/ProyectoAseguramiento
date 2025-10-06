from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db
import uuid

router = APIRouter(prefix="/kitchen", tags=["Kitchen"])

# ----------------------------
# Listar órdenes relevantes para cocina
# ----------------------------
@router.get("/orders", response_model=List[schemas.Order])
def read_kitchen_orders(db: Session = Depends(get_db)):
    """
    Devuelve solo las órdenes cuyo estado requiere atención de cocina:
    pendientes, confirmadas o sentadas.
    """
    kitchen_orders = crud.get_orders_by_status(db, ["pending", "confirmed", "seated"])
    return kitchen_orders

# ----------------------------
# Obtener detalles de una orden específica (incluye items)
# ----------------------------
@router.get("/orders/{order_id}", response_model=schemas.Order)
def read_kitchen_order(order_id: uuid.UUID, db: Session = Depends(get_db)):
    db_order = crud.get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

# ----------------------------
# Actualizar solo el estado de una orden
# ----------------------------
@router.put("/orders/{order_id}/status", response_model=schemas.Order)
def update_kitchen_order_status(order_id: uuid.UUID, status: str, db: Session = Depends(get_db)):
    db_order = crud.update_order_status(db, order_id, status)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order
