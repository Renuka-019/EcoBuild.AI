from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import Comparison, Building, User, ActivityLog
from app.schemas.schemas import ComparisonCreate
from app.auth import get_current_user
from app.services.comparison_engine import compare_designs

router = APIRouter(prefix="/comparisons", tags=["Comparisons"])

@router.post("")
def create_comparison(
    comp_in: ComparisonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(comp_in.building_ids) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comparison requires at least 2 building designs"
        )

    buildings = db.query(Building).filter(
        Building.id.in_(comp_in.building_ids),
        (Building.user_id == current_user.id) | (current_user.is_admin == True)
    ).all()

    if len(buildings) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not find sufficient valid buildings belonging to you"
        )

    # Format for comparison engine
    b_data_list = []
    for b in buildings:
        latest_a = b.analyses[-1] if b.analyses else None
        b_data_list.append({
            "id": b.id,
            "project_name": b.project_name,
            "building_type": b.building_type,
            "built_up_area_m2": b.built_up_area_m2,
            "cost": {
                "construction_cost": b.cost_detail.construction_cost if b.cost_detail else 0.0
            },
            "latest_analysis": {
                "overall_sustainability_score": latest_a.overall_sustainability_score if latest_a else 45.0,
                "classification": latest_a.classification if latest_a else "Needs Improvement",
                "energy_score": latest_a.energy_score if latest_a else 40.0,
                "water_score": latest_a.water_score if latest_a else 40.0,
                "carbon_score": latest_a.carbon_score if latest_a else 40.0,
                "materials_score": latest_a.materials_score if latest_a else 40.0,
                "energy": {
                    "annual_energy_kwh": latest_a.annual_energy_kwh if latest_a else 100000.0,
                    "energy_intensity_kwh_m2": latest_a.energy_intensity_kwh_m2 if latest_a else 120.0,
                },
                "water": {
                    "annual_water_litres": latest_a.annual_water_litres if latest_a else 500000.0,
                    "water_per_occupant_lpcd": latest_a.water_per_occupant_lpcd if latest_a else 120.0,
                },
                "carbon": {
                    "total_carbon_tons": latest_a.total_carbon_tons if latest_a else 80.0,
                    "carbon_intensity_kg_m2": latest_a.carbon_intensity_kg_m2 if latest_a else 95.0,
                    "embodied_carbon_tons": latest_a.embodied_carbon_tons if latest_a else 40.0,
                    "operational_carbon_tons": latest_a.operational_carbon_tons if latest_a else 40.0,
                }
            }
        })

    comp_res = compare_designs(b_data_list, priority=comp_in.priority_preference)

    comparison_record = Comparison(
        user_id=current_user.id,
        title=comp_in.title,
        building_ids=comp_in.building_ids,
        priority_preference=comp_in.priority_preference,
        comparison_data=comp_res,
        summary=comp_res["summary"]
    )
    db.add(comparison_record)
    db.add(ActivityLog(
        user_id=current_user.id,
        action="RUN_COMPARISON",
        target_type="Comparison",
        details=f"Compared {len(buildings)} designs ({comp_in.title})"
    ))
    db.commit()
    db.refresh(comparison_record)

    return {
        "id": comparison_record.id,
        "title": comparison_record.title,
        "priority_preference": comparison_record.priority_preference,
        "created_at": comparison_record.created_at,
        "data": comp_res
    }

@router.get("")
def list_comparisons(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comps = db.query(Comparison).filter(Comparison.user_id == current_user.id).order_by(Comparison.created_at.desc()).all()
    return [{
        "id": c.id,
        "title": c.title,
        "priority_preference": c.priority_preference,
        "building_ids": c.building_ids,
        "created_at": c.created_at,
        "summary": c.summary
    } for c in comps]

@router.get("/{comparison_id}")
def get_comparison(
    comparison_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    c = db.query(Comparison).filter(Comparison.id == comparison_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comparison not found")
    if c.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return {
        "id": c.id,
        "title": c.title,
        "priority_preference": c.priority_preference,
        "building_ids": c.building_ids,
        "created_at": c.created_at,
        "data": c.comparison_data,
        "summary": c.summary
    }
