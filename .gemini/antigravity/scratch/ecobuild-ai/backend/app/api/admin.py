from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.all_models import (
    User, Building, AnalysisResult, EmissionFactor, Benchmark, SustainableSolution, ActivityLog
)
from app.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/overview")
def get_admin_overview(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    total_users = db.query(User).count()
    total_buildings = db.query(Building).count()
    total_analyses = db.query(AnalysisResult).count()
    total_solutions = db.query(SustainableSolution).count()

    type_counts = db.query(
        Building.building_type, func.count(Building.id)
    ).group_by(Building.building_type).all()

    building_type_breakdown = {t: c for t, c in type_counts}

    recent_users = db.query(User).order_by(User.created_at.desc()).limit(10).all()
    user_list = [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "user_type": u.user_type,
            "is_admin": u.is_admin,
            "is_active": u.is_active,
            "buildings_count": len(u.buildings),
            "created_at": u.created_at
        }
        for u in recent_users
    ]

    emission_factors = db.query(EmissionFactor).all()
    factors_list = [
        {
            "id": f.id,
            "name": f.name,
            "category": f.category,
            "factor_value": f.factor_value,
            "unit": f.unit,
            "region": f.region,
            "source": f.source,
            "source_year": f.source_year
        }
        for f in emission_factors
    ]

    recent_logs = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(15).all()
    logs_list = [
        {
            "id": l.id,
            "user": l.user.full_name if l.user else "System",
            "action": l.action,
            "details": l.details,
            "created_at": l.created_at
        }
        for l in recent_logs
    ]

    return {
        "stats": {
            "total_users": total_users,
            "total_buildings": total_buildings,
            "total_analyses": total_analyses,
            "total_solutions": total_solutions
        },
        "building_type_breakdown": building_type_breakdown,
        "users": user_list,
        "emission_factors": factors_list,
        "recent_activity": logs_list
    }

@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if target.id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot toggle own status")

    target.is_active = not target.is_active
    db.commit()
    return {"message": f"User status set to {'active' if target.is_active else 'inactive'}", "is_active": target.is_active}

@router.put("/factors/{factor_id}")
def update_emission_factor(
    factor_id: int,
    new_value: float,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Factor not found")
    
    factor.factor_value = new_value
    db.commit()
    return {"message": "Emission factor updated successfully", "name": factor.name, "new_value": factor.factor_value}
