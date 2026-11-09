from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import (
    Building, EnergyDetail, WaterDetail, MaterialDetail, CostDetail, User, AnalysisResult, ActivityLog
)
from app.schemas.schemas import BuildingCreate, BuildingUpdate, BuildingOut
from app.auth import get_current_user

router = APIRouter(prefix="/buildings", tags=["Buildings"])

def format_building_dict(b: Building) -> dict:
    latest_a = b.analyses[-1] if b.analyses else None
    return {
        "id": b.id,
        "user_id": b.user_id,
        "project_name": b.project_name,
        "building_type": b.building_type,
        "location": b.location,
        "built_up_area_m2": b.built_up_area_m2,
        "floors": b.floors,
        "occupants": b.occupants,
        "construction_year": b.construction_year,
        "orientation": b.orientation,
        "building_usage": b.building_usage,
        "is_draft": b.is_draft,
        "created_at": b.created_at,
        "updated_at": b.updated_at,
        "energy": {
            "annual_electricity_kwh": b.energy_detail.annual_electricity_kwh if b.energy_detail else 0.0,
            "hvac_system": b.energy_detail.hvac_system if b.energy_detail else "Split AC",
            "lighting_type": b.energy_detail.lighting_type if b.energy_detail else "LED",
            "renewable_available": b.energy_detail.renewable_available if b.energy_detail else False,
            "solar_capacity_kw": b.energy_detail.solar_capacity_kw if b.energy_detail else 0.0,
            "electricity_source": b.energy_detail.electricity_source if b.energy_detail else "Grid",
        } if b.energy_detail else None,
        "water": {
            "daily_water_litres": b.water_detail.daily_water_litres if b.water_detail else 0.0,
            "water_source": b.water_detail.water_source if b.water_detail else "Municipal Supply",
            "rainwater_harvesting": b.water_detail.rainwater_harvesting if b.water_detail else False,
            "water_efficient_fixtures": b.water_detail.water_efficient_fixtures if b.water_detail else False,
            "wastewater_recycling": b.water_detail.wastewater_recycling if b.water_detail else False,
        } if b.water_detail else None,
        "materials": {
            "concrete_m3": b.material_detail.concrete_m3 if b.material_detail else 0.0,
            "steel_kg": b.material_detail.steel_kg if b.material_detail else 0.0,
            "brick_count": b.material_detail.brick_count if b.material_detail else 0.0,
            "recycled_percentage": b.material_detail.recycled_percentage if b.material_detail else 0.0,
            "local_sourced_percentage": b.material_detail.local_sourced_percentage if b.material_detail else 0.0,
            "other_materials_notes": b.material_detail.other_materials_notes if b.material_detail else "",
        } if b.material_detail else None,
        "cost": {
            "construction_cost": b.cost_detail.construction_cost if b.cost_detail else 0.0,
            "energy_cost_annual": b.cost_detail.energy_cost_annual if b.cost_detail else 0.0,
            "water_cost_annual": b.cost_detail.water_cost_annual if b.cost_detail else 0.0,
            "maintenance_cost_annual": b.cost_detail.maintenance_cost_annual if b.cost_detail else 0.0,
            "budget": b.cost_detail.budget if b.cost_detail else 0.0,
        } if b.cost_detail else None,
        "latest_score": latest_a.overall_sustainability_score if latest_a else None,
        "latest_classification": latest_a.classification if latest_a else None,
        "latest_analysis_id": latest_a.id if latest_a else None
    }

@router.post("", response_model=BuildingOut)
def create_building(
    b_in: BuildingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = Building(
        user_id=current_user.id,
        project_name=b_in.project_name,
        building_type=b_in.building_type,
        location=b_in.location,
        built_up_area_m2=b_in.built_up_area_m2,
        floors=b_in.floors,
        occupants=b_in.occupants,
        construction_year=b_in.construction_year,
        orientation=b_in.orientation,
        building_usage=b_in.building_usage,
        is_draft=b_in.is_draft
    )
    db.add(b)
    db.flush()

    if b_in.energy:
        e = EnergyDetail(
            building_id=b.id,
            annual_electricity_kwh=b_in.energy.annual_electricity_kwh,
            hvac_system=b_in.energy.hvac_system,
            lighting_type=b_in.energy.lighting_type,
            renewable_available=b_in.energy.renewable_available,
            solar_capacity_kw=b_in.energy.solar_capacity_kw,
            electricity_source=b_in.energy.electricity_source
        )
        db.add(e)

    if b_in.water:
        w = WaterDetail(
            building_id=b.id,
            daily_water_litres=b_in.water.daily_water_litres,
            water_source=b_in.water.water_source,
            rainwater_harvesting=b_in.water.rainwater_harvesting,
            water_efficient_fixtures=b_in.water.water_efficient_fixtures,
            wastewater_recycling=b_in.water.wastewater_recycling
        )
        db.add(w)

    if b_in.materials:
        m = MaterialDetail(
            building_id=b.id,
            concrete_m3=b_in.materials.concrete_m3,
            steel_kg=b_in.materials.steel_kg,
            brick_count=b_in.materials.brick_count,
            recycled_percentage=b_in.materials.recycled_percentage,
            local_sourced_percentage=b_in.materials.local_sourced_percentage,
            other_materials_notes=b_in.materials.other_materials_notes
        )
        db.add(m)

    if b_in.cost:
        c = CostDetail(
            building_id=b.id,
            construction_cost=b_in.cost.construction_cost,
            energy_cost_annual=b_in.cost.energy_cost_annual,
            water_cost_annual=b_in.cost.water_cost_annual,
            maintenance_cost_annual=b_in.cost.maintenance_cost_annual,
            budget=b_in.cost.budget
        )
        db.add(c)

    db.commit()
    db.refresh(b)
    
    db.add(ActivityLog(user_id=current_user.id, action="CREATE_BUILDING", target_type="Building", target_id=b.id, details=f"Created {b.project_name}"))
    db.commit()

    return format_building_dict(b)

@router.get("", response_model=List[BuildingOut])
def get_user_buildings(
    search: Optional[str] = None,
    building_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Building).filter(Building.user_id == current_user.id)
    if building_type and building_type != "All":
        query = query.filter(Building.building_type == building_type)
    if search:
        query = query.filter(Building.project_name.ilike(f"%{search}%") | Building.location.ilike(f"%{search}%"))
    
    buildings = query.order_by(Building.created_at.desc()).all()
    return [format_building_dict(b) for b in buildings]

@router.get("/{building_id}")
def get_building_by_id(
    building_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = db.query(Building).filter(Building.id == building_id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return format_building_dict(b)

@router.put("/{building_id}")
def update_building(
    building_id: int,
    b_in: BuildingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = db.query(Building).filter(Building.id == building_id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    for field, val in b_in.dict(exclude_unset=True).items():
        if field in ["energy", "water", "materials", "cost"]:
            continue
        setattr(b, field, val)

    if b_in.energy and b.energy_detail:
        for k, v in b_in.energy.dict().items():
            setattr(b.energy_detail, k, v)

    if b_in.water and b.water_detail:
        for k, v in b_in.water.dict().items():
            setattr(b.water_detail, k, v)

    if b_in.materials and b.material_detail:
        for k, v in b_in.materials.dict().items():
            setattr(b.material_detail, k, v)

    if b_in.cost and b.cost_detail:
        for k, v in b_in.cost.dict().items():
            setattr(b.cost_detail, k, v)

    db.commit()
    db.refresh(b)
    return format_building_dict(b)

@router.delete("/{building_id}")
def delete_building(
    building_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = db.query(Building).filter(Building.id == building_id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    db.delete(b)
    db.commit()
    return {"message": "Building deleted successfully"}
