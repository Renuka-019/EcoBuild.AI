from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import SustainableSolution
from app.schemas.schemas import SustainableSolutionOut

router = APIRouter(prefix="/solutions", tags=["Solutions"])

@router.get("", response_model=List[SustainableSolutionOut])
def get_solutions(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(SustainableSolution)
    if category and category != "All":
        q = q.filter(SustainableSolution.category == category)
    if search:
        q = q.filter(
            SustainableSolution.title.ilike(f"%{search}%") |
            SustainableSolution.description.ilike(f"%{search}%") |
            SustainableSolution.tags.ilike(f"%{search}%")
        )
    return q.all()

@router.get("/{solution_id}", response_model=SustainableSolutionOut)
def get_solution_by_id(solution_id: int, db: Session = Depends(get_db)):
    sol = db.query(SustainableSolution).filter(SustainableSolution.id == solution_id).first()
    if not sol:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solution not found")
    return sol
