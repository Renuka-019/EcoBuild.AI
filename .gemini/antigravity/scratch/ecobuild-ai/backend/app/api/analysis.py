from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import Building, AnalysisResult, Recommendation, ActivityLog, User
from app.schemas.schemas import AnalysisResultOut
from app.auth import get_current_user
from app.services.calculation_engine import run_full_environmental_analysis
from app.services.ai_recommendation_engine import generate_recommendations

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.post("/{building_id}", response_model=AnalysisResultOut)
def run_analysis(
    building_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = db.query(Building).filter(Building.id == building_id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Prepare inputs
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
    c_meta = {
        "construction_cost": b.cost_detail.construction_cost if b.cost_detail else 0.0
    }

    # Execute deterministic calculation engine
    result = run_full_environmental_analysis(b_meta, e_meta, w_meta, m_meta, c_meta)

    # Persist Analysis Result
    ar = AnalysisResult(
        building_id=b.id,
        overall_sustainability_score=result["overall_sustainability_score"],
        classification=result["classification"],
        energy_intensity_kwh_m2=result["energy"]["energy_intensity_kwh_m2"],
        annual_energy_kwh=result["energy"]["annual_energy_kwh"],
        potential_solar_generation_kwh=result["energy"]["potential_solar_generation_kwh"],
        potential_energy_savings_kwh=result["energy"]["potential_energy_savings_kwh"],
        energy_efficiency_class=result["energy"]["energy_efficiency_class"],
        daily_water_litres=result["water"]["daily_water_litres"],
        annual_water_litres=result["water"]["annual_water_litres"],
        water_per_occupant_lpcd=result["water"]["water_per_occupant_lpcd"],
        rainwater_harvest_potential_litres=result["water"]["rainwater_harvest_potential_litres"],
        potential_water_savings_litres=result["water"]["potential_water_savings_litres"],
        operational_carbon_tons=result["carbon"]["operational_carbon_tons"],
        embodied_carbon_tons=result["carbon"]["embodied_carbon_tons"],
        total_carbon_tons=result["carbon"]["total_carbon_tons"],
        carbon_intensity_kg_m2=result["carbon"]["carbon_intensity_kg_m2"],
        concrete_carbon_tons=result["carbon"]["concrete_carbon_tons"],
        steel_carbon_tons=result["carbon"]["steel_carbon_tons"],
        brick_carbon_tons=result["carbon"]["brick_carbon_tons"],
        energy_score=result["energy_score"],
        water_score=result["water_score"],
        carbon_score=result["carbon_score"],
        materials_score=result["materials_score"],
        calculation_metadata=result["metadata"]
    )
    db.add(ar)
    db.flush()

    # Generate & persist AI Recommendations
    recs = generate_recommendations(result, {
        "built_up_area_m2": b.built_up_area_m2,
        "solar_capacity_kw": e_meta["solar_capacity_kw"],
        "hvac_system": e_meta["hvac_system"],
        "lighting_type": e_meta["lighting_type"],
        "rainwater_harvesting": w_meta["rainwater_harvesting"],
        "water_efficient_fixtures": w_meta["water_efficient_fixtures"],
        "wastewater_recycling": w_meta["wastewater_recycling"],
        "recycled_percentage": m_meta["recycled_percentage"],
        "local_sourced_percentage": m_meta["local_sourced_percentage"]
    })

    for r in recs:
        db.add(Recommendation(
            analysis_id=ar.id,
            title=r["title"],
            category=r["category"],
            problem_identified=r["problem_identified"],
            suggested_improvement=r["suggested_improvement"],
            reason=r["reason"],
            environmental_benefit=r["environmental_benefit"],
            estimated_cost_category=r["estimated_cost_category"],
            implementation_difficulty=r["implementation_difficulty"],
            priority=r["priority"],
            expected_savings_kwh=r["expected_savings_kwh"],
            expected_savings_water_l=r["expected_savings_water_l"],
            expected_savings_carbon_tons=r["expected_savings_carbon_tons"],
            estimated_annual_roi_usd=r["estimated_annual_roi_usd"],
            applied=False
        ))

    db.add(ActivityLog(
        user_id=current_user.id,
        action="RUN_ANALYSIS",
        target_type="AnalysisResult",
        target_id=ar.id,
        details=f"Analyzed {b.project_name}: Score {ar.overall_sustainability_score} ({ar.classification})"
    ))

    db.commit()
    db.refresh(ar)
    return ar

@router.get("/{analysis_id}", response_model=AnalysisResultOut)
def get_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ar = db.query(AnalysisResult).filter(AnalysisResult.id == analysis_id).first()
    if not ar:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis result not found")
    if ar.building.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return ar

@router.get("/building/{building_id}", response_model=List[AnalysisResultOut])
def get_building_analyses(
    building_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = db.query(Building).filter(Building.id == building_id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return b.analyses
