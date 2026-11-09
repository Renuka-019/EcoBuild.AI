from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import Benchmark
from app.schemas.schemas import BenchmarkOut

router = APIRouter(prefix="/benchmarks", tags=["Benchmarks"])

@router.get("", response_model=List[BenchmarkOut])
def get_benchmarks(
    building_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Benchmark)
    if building_type and building_type != "All":
        q = q.filter(Benchmark.building_type == building_type)
    return q.all()

@router.get("/{benchmark_id}", response_model=BenchmarkOut)
def get_benchmark_by_id(benchmark_id: int, db: Session = Depends(get_db)):
    bm = db.query(Benchmark).filter(Benchmark.id == benchmark_id).first()
    if not bm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Benchmark not found")
    return bm
