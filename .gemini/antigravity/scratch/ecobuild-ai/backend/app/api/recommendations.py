from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import Recommendation, AnalysisResult, Building, ActivityLog, User
from app.schemas.schemas import RecommendationOut
from app.auth import get_current_user
from app.services.calculation_engine import run_full_environmental_analysis

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/{analysis_id}", response_model=List[RecommendationOut])
def get_recommendations_for_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ar = db.query(AnalysisResult).filter(AnalysisResult.id == analysis_id).first()
    if not ar:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    if ar.building.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return ar.recommendations

@router.post("/{recommendation_id}/apply")
def apply_recommendation(
    recommendation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rec = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommendation not found")
    
    b = rec.analysis.building
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Apply changes to building specification based on recommendation category and title
    cat = rec.category
    title = rec.title

    if "Solar" in title or cat == "Renewable Energy":
        if b.energy_detail:
            b.energy_detail.solar_capacity_kw = max(b.energy_detail.solar_capacity_kw, 25.0)
            b.energy_detail.renewable_available = True
            b.energy_detail.electricity_source = "Solar+Grid"

    elif "VRV" in title or "HVAC" in title or "Natural Ventilation" in title:
        if b.energy_detail:
            b.energy_detail.hvac_system = "VRV/VRF"

    elif "LED" in title or "Lighting" in title:
        if b.energy_detail:
            b.energy_detail.lighting_type = "LED"

    elif "Rainwater" in title or (cat == "Water Conservation" and "Rainwater" in title):
        if b.water_detail:
            b.water_detail.rainwater_harvesting = True

    elif "Low-Flow" in title or "Fixtures" in title:
        if b.water_detail:
            b.water_detail.water_efficient_fixtures = True

    elif "Greywater" in title or "Wetland" in title:
        if b.water_detail:
            b.water_detail.wastewater_recycling = True

    elif "Concrete" in title or "Pozzolanic" in title:
        if b.material_detail:
            b.material_detail.recycled_percentage = max(b.material_detail.recycled_percentage, 35.0)

    elif "Regional" in title or "Local" in title:
        if b.material_detail:
            b.material_detail.local_sourced_percentage = max(b.material_detail.local_sourced_percentage, 60.0)

    rec.applied = True
    db.commit()

    # Re-run environmental analysis automatically with new applied parameters!
    b_meta = {
        "built_up_area_m2": b.built_up_area_m2,
        "floors": b.floors,
        "occupants": b.occupants,
        "building_type": b.building_type,
    }
    e_meta = {
        "annual_electricity_kwh": b.energy_detail.annual_electricity_kwh if b.energy_detail else 0.0,
        "solar_capacity_kw": b.energy_detail.solar_capacity_kw if b.energy_detail else 0.0,
        "hvac_system": b.energy_detail.hvac_system if b.energy_detail else "Split AC",
        "lighting_type": b.energy_detail.lighting_type if b.energy_detail else "LED",
    }
    w_meta = {
        "daily_water_litres": b.water_detail.daily_water_litres if b.water_detail else 0.0,
        "rainwater_harvesting": b.water_detail.rainwater_harvesting if b.water_detail else False,
        "water_efficient_fixtures": b.water_detail.water_efficient_fixtures if b.water_detail else False,
        "wastewater_recycling": b.water_detail.wastewater_recycling if b.water_detail else False,
    }
    m_meta = {
        "concrete_m3": b.material_detail.concrete_m3 if b.material_detail else 0.0,
        "steel_kg": b.material_detail.steel_kg if b.material_detail else 0.0,
        "brick_count": b.material_detail.brick_count if b.material_detail else 0.0,
        "recycled_percentage": b.material_detail.recycled_percentage if b.material_detail else 0.0,
        "local_sourced_percentage": b.material_detail.local_sourced_percentage if b.material_detail else 0.0,
    }
    c_meta = {"construction_cost": b.cost_detail.construction_cost if b.cost_detail else 0.0}

    new_calc = run_full_environmental_analysis(b_meta, e_meta, w_meta, m_meta, c_meta)

    new_ar = AnalysisResult(
        building_id=b.id,
        overall_sustainability_score=new_calc["overall_sustainability_score"],
        classification=new_calc["classification"],
        energy_intensity_kwh_m2=new_calc["energy"]["energy_intensity_kwh_m2"],
        annual_energy_kwh=new_calc["energy"]["annual_energy_kwh"],
        potential_solar_generation_kwh=new_calc["energy"]["potential_solar_generation_kwh"],
        potential_energy_savings_kwh=new_calc["energy"]["potential_energy_savings_kwh"],
        energy_efficiency_class=new_calc["energy"]["energy_efficiency_class"],
        daily_water_litres=new_calc["water"]["daily_water_litres"],
        annual_water_litres=new_calc["water"]["annual_water_litres"],
        water_per_occupant_lpcd=new_calc["water"]["water_per_occupant_lpcd"],
        rainwater_harvest_potential_litres=new_calc["water"]["rainwater_harvest_potential_litres"],
        potential_water_savings_litres=new_calc["water"]["potential_water_savings_litres"],
        operational_carbon_tons=new_calc["carbon"]["operational_carbon_tons"],
        embodied_carbon_tons=new_calc["carbon"]["embodied_carbon_tons"],
        total_carbon_tons=new_calc["carbon"]["total_carbon_tons"],
        carbon_intensity_kg_m2=new_calc["carbon"]["carbon_intensity_kg_m2"],
        concrete_carbon_tons=new_calc["carbon"]["concrete_carbon_tons"],
        steel_carbon_tons=new_calc["carbon"]["steel_carbon_tons"],
        brick_carbon_tons=new_calc["carbon"]["brick_carbon_tons"],
        energy_score=new_calc["energy_score"],
        water_score=new_calc["water_score"],
        carbon_score=new_calc["carbon_score"],
        materials_score=new_calc["materials_score"],
        calculation_metadata=new_calc["metadata"]
    )
    db.add(new_ar)
    db.add(ActivityLog(
        user_id=current_user.id,
        action="APPLY_RECOMMENDATION",
        target_type="Recommendation",
        target_id=rec.id,
        details=f"Applied '{rec.title}' to {b.project_name}. Score improved to {new_ar.overall_sustainability_score}"
    ))
    db.commit()
    db.refresh(new_ar)

    return {
        "message": f"Successfully applied '{rec.title}'",
        "new_analysis_id": new_ar.id,
        "new_score": new_ar.overall_sustainability_score,
        "new_classification": new_ar.classification
    }
