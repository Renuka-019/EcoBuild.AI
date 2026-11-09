from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all_models import (
    Building, EnergyDetail, WaterDetail, MaterialDetail, CostDetail, SimulationScenario, ActivityLog, User
)
from app.schemas.schemas import SimulationRun, SimulationSaveAsDesign
from app.auth import get_current_user
from app.services.simulation_engine import run_simulation
from app.services.calculation_engine import run_full_environmental_analysis
from app.models.all_models import AnalysisResult

router = APIRouter(prefix="/simulations", tags=["Simulations"])

@router.post("")
def simulate_scenario(
    sim_in: SimulationRun,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    b = db.query(Building).filter(Building.id == sim_in.building_id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building not found")
    if b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    res = run_simulation(b, sim_in.dict(exclude_unset=True))
    return res

@router.post("/save-as-design")
def save_simulation_as_design(
    save_in: SimulationSaveAsDesign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    base_b = db.query(Building).filter(Building.id == save_in.building_id).first()
    if not base_b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source building not found")
    if base_b.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    params = save_in.simulation_params

    # Create new optimized building design
    new_b = Building(
        user_id=current_user.id,
        project_name=save_in.new_project_name,
        building_type=base_b.building_type,
        location=base_b.location,
        built_up_area_m2=base_b.built_up_area_m2,
        floors=base_b.floors,
        occupants=base_b.occupants,
        construction_year=base_b.construction_year,
        orientation=base_b.orientation,
        building_usage=f"Optimized Scenario based on {base_b.project_name}",
        is_draft=False
    )
    db.add(new_b)
    db.flush()

    # Energy with modifications
    base_e = base_b.energy_detail
    new_solar = float(params.get("solar_capacity_kw", base_e.solar_capacity_kw if base_e else 0.0))
    new_hvac = "Natural Only" if params.get("natural_ventilation") else (base_e.hvac_system if base_e else "VRV/VRF")
    new_lighting = "LED" if params.get("energy_efficient_lighting") else (base_e.lighting_type if base_e else "LED")
    
    new_e = EnergyDetail(
        building_id=new_b.id,
        annual_electricity_kwh=base_e.annual_electricity_kwh if base_e else 0.0,
        hvac_system=new_hvac,
        lighting_type=new_lighting,
        renewable_available=(new_solar > 0),
        solar_capacity_kw=new_solar,
        electricity_source="Solar+Grid" if new_solar > 0 else "Grid"
    )
    db.add(new_e)

    # Water with modifications
    base_w = base_b.water_detail
    new_rwh = bool(params.get("rainwater_harvesting", base_w.rainwater_harvesting if base_w else False))
    new_fixtures = bool(params.get("water_efficient_fixtures", base_w.water_efficient_fixtures if base_w else False))
    new_w = WaterDetail(
        building_id=new_b.id,
        daily_water_litres=base_w.daily_water_litres if base_w else 0.0,
        water_source=base_w.water_source if base_w else "Municipal Supply",
        rainwater_harvesting=new_rwh,
        water_efficient_fixtures=new_fixtures,
        wastewater_recycling=base_w.wastewater_recycling if base_w else False
    )
    db.add(new_w)

    # Materials with modifications
    base_m = base_b.material_detail
    new_recycled = float(params.get("recycled_percentage", base_m.recycled_percentage if base_m else 0.0))
    if params.get("low_carbon_concrete"):
        new_recycled = max(new_recycled, 35.0)

    new_m = MaterialDetail(
        building_id=new_b.id,
        concrete_m3=base_m.concrete_m3 if base_m else 0.0,
        steel_kg=base_m.steel_kg if base_m else 0.0,
        brick_count=base_m.brick_count if base_m else 0.0,
        recycled_percentage=new_recycled,
        local_sourced_percentage=base_m.local_sourced_percentage if base_m else 50.0,
        other_materials_notes="Generated from green design simulator"
    )
    db.add(new_m)

    # Cost
    base_c = base_b.cost_detail
    new_cost = CostDetail(
        building_id=new_b.id,
        construction_cost=base_c.construction_cost if base_c else 0.0,
        energy_cost_annual=base_c.energy_cost_annual if base_c else 0.0,
        water_cost_annual=base_c.water_cost_annual if base_c else 0.0,
        maintenance_cost_annual=base_c.maintenance_cost_annual if base_c else 0.0,
        budget=base_c.budget if base_c else 0.0
    )
    db.add(new_cost)
    db.flush()

    # Run analysis for this newly saved design
    calc = run_full_environmental_analysis(
        {"built_up_area_m2": new_b.built_up_area_m2, "floors": new_b.floors, "occupants": new_b.occupants, "building_type": new_b.building_type},
        {"annual_electricity_kwh": new_e.annual_electricity_kwh, "solar_capacity_kw": new_e.solar_capacity_kw, "hvac_system": new_e.hvac_system, "lighting_type": new_e.lighting_type},
        {"daily_water_litres": new_w.daily_water_litres, "rainwater_harvesting": new_w.rainwater_harvesting, "water_efficient_fixtures": new_w.water_efficient_fixtures, "wastewater_recycling": new_w.wastewater_recycling},
        {"concrete_m3": new_m.concrete_m3, "steel_kg": new_m.steel_kg, "brick_count": new_m.brick_count, "recycled_percentage": new_m.recycled_percentage, "local_sourced_percentage": new_m.local_sourced_percentage},
        {"construction_cost": new_cost.construction_cost}
    )

    ar = AnalysisResult(
        building_id=new_b.id,
        overall_sustainability_score=calc["overall_sustainability_score"],
        classification=calc["classification"],
        energy_intensity_kwh_m2=calc["energy"]["energy_intensity_kwh_m2"],
        annual_energy_kwh=calc["energy"]["annual_energy_kwh"],
        potential_solar_generation_kwh=calc["energy"]["potential_solar_generation_kwh"],
        potential_energy_savings_kwh=calc["energy"]["potential_energy_savings_kwh"],
        energy_efficiency_class=calc["energy"]["energy_efficiency_class"],
        daily_water_litres=calc["water"]["daily_water_litres"],
        annual_water_litres=calc["water"]["annual_water_litres"],
        water_per_occupant_lpcd=calc["water"]["water_per_occupant_lpcd"],
        rainwater_harvest_potential_litres=calc["water"]["rainwater_harvest_potential_litres"],
        potential_water_savings_litres=calc["water"]["potential_water_savings_litres"],
        operational_carbon_tons=calc["carbon"]["operational_carbon_tons"],
        embodied_carbon_tons=calc["carbon"]["embodied_carbon_tons"],
        total_carbon_tons=calc["carbon"]["total_carbon_tons"],
        carbon_intensity_kg_m2=calc["carbon"]["carbon_intensity_kg_m2"],
        concrete_carbon_tons=calc["carbon"]["concrete_carbon_tons"],
        steel_carbon_tons=calc["carbon"]["steel_carbon_tons"],
        brick_carbon_tons=calc["carbon"]["brick_carbon_tons"],
        energy_score=calc["energy_score"],
        water_score=calc["water_score"],
        carbon_score=calc["carbon_score"],
        materials_score=calc["materials_score"],
        calculation_metadata=calc["metadata"]
    )
    db.add(ar)

    db.add(ActivityLog(
        user_id=current_user.id,
        action="SIMULATION_SAVED",
        target_type="Building",
        target_id=new_b.id,
        details=f"Saved simulated design: {new_b.project_name} (Score: {ar.overall_sustainability_score})"
    ))
    db.commit()
    db.refresh(new_b)

    return {
        "message": "Simulated design saved successfully!",
        "new_building_id": new_b.id,
        "project_name": new_b.project_name,
        "score": ar.overall_sustainability_score,
        "classification": ar.classification
    }
