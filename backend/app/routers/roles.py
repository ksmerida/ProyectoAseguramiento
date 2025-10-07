from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app import schemas, crud
from backend.app.database import get_db

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=schemas.Role)
def create_role(role: schemas.RoleCreate, db: Session = Depends(get_db)):
    return crud.create_role(db, role)

@router.get("/", response_model=List[schemas.Role])
def read_roles(db: Session = Depends(get_db)):
    return crud.get_roles(db)

@router.get("/{role_id}", response_model=schemas.Role)
def read_role(role_id: str, db: Session = Depends(get_db)):
    db_role = crud.get_role(db, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

@router.put("/{role_id}", response_model=schemas.Role)
def update_role(role_id: str, role: schemas.RoleCreate, db: Session = Depends(get_db)):
    db_role = crud.update_role(db, role_id, role)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

@router.delete("/{role_id}", response_model=schemas.Role)
def delete_role(role_id: str, db: Session = Depends(get_db)):
    db_role = crud.delete_role(db, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role
