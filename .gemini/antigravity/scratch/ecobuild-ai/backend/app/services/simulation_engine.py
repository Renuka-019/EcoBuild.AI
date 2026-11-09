"""
EcoBuild AI - What-If Green Design Simulator Engine
Simulates dynamic real-time parameter variations (Solar kW, Recycled %, Rainwater, Low-Carbon Concrete)
and compares before/after environmental metrics.
"""

from typing import Dict, Any
from app.services.calculation_engine import run_full_environmental_analysis

def run_simulation(building_record: Any, simulation_inputs: Dict[str, Any]) -> Dict[str, Any]:
    # Extract baseline
    b_meta = {
        "built_up_area_m2": building_record.built_up_area_m2,
        "floors": building_record.floors,
        "occupants": building_record.occupants,
        "building_type": building_record.building_type,
    }
    
    e = building_record.energy_detail
    w = building_record.water_detail
    m = building_record.material_detail
    c = building_record.cost_detail

    e_orig = {
        "annual_electricity_kwh": e.annual_electricity_kwh if e else 0.0,
        "hvac_system": e.hvac_system if e else "Split AC",
        "lighting_type": e.lighting_type if e else "LED",
        "solar_capacity_kw": e.solar_capacity_kw if e else 0.0,
        "renewable_available": e.renewable_available if e else False,
    }
    w_orig = {
        "daily_water_litres": w.daily_water_litres if w else 0.0,
        "rainwater_harvesting": w.rainwater_harvesting if w else False,
        "water_efficient_fixtures": w.water_efficient_fixtures if w else False,
        "wastewater_recycling": w.wastewater_recycling if w else False,
    }
    m_orig = {
        "concrete_m3": m.concrete_m3 if m else 0.0,
        "steel_kg": m.steel_kg if m else 0.0,
        "brick_count": m.brick_count if m else 0.0,
        "recycled_percentage": m.recycled_percentage if m else 0.0,
        "local_sourced_percentage": m.local_sourced_percentage if m else 0.0,
    }
    c_orig = {
        "construction_cost": c.construction_cost if c else 0.0,
        "energy_cost_annual": c.energy_cost_annual if c else 0.0,
        "water_cost_annual": c.water_cost_annual if c else 0.0,
    }

    original_analysis = run_full_environmental_analysis(b_meta, e_orig, w_orig, m_orig, c_orig)

    # Apply Simulation Modifications
    e_sim = dict(e_orig)
    w_sim = dict(w_orig)
    m_sim = dict(m_orig)
    c_sim = dict(c_orig)

    if simulation_inputs.get("solar_capacity_kw") is not None:
        e_sim["solar_capacity_kw"] = float(simulation_inputs["solar_capacity_kw"])
        e_sim["renewable_available"] = (e_sim["solar_capacity_kw"] > 0)

    if simulation_inputs.get("energy_efficient_lighting") is True:
        e_sim["lighting_type"] = "LED"

    if simulation_inputs.get("natural_ventilation") is True:
        e_sim["hvac_system"] = "Natural Only"

    if simulation_inputs.get("rainwater_harvesting") is not None:
        w_sim["rainwater_harvesting"] = bool(simulation_inputs["rainwater_harvesting"])

    if simulation_inputs.get("water_efficient_fixtures") is not None:
        w_sim["water_efficient_fixtures"] = bool(simulation_inputs["water_efficient_fixtures"])

    if simulation_inputs.get("recycled_percentage") is not None:
        m_sim["recycled_percentage"] = float(simulation_inputs["recycled_percentage"])

    if simulation_inputs.get("low_carbon_concrete") is True:
        m_sim["recycled_percentage"] = max(m_sim["recycled_percentage"], 35.0)

    simulated_analysis = run_full_environmental_analysis(b_meta, e_sim, w_sim, m_sim, c_sim)

    # Deltas
    energy_delta_kwh = original_analysis["energy"]["annual_energy_kwh"] - simulated_analysis["energy"]["annual_energy_kwh"]
    water_delta_litres = original_analysis["water"]["annual_water_litres"] - simulated_analysis["water"]["annual_water_litres"]
    carbon_delta_tons = original_analysis["carbon"]["total_carbon_tons"] - simulated_analysis["carbon"]["total_carbon_tons"]
    score_delta = simulated_analysis["overall_sustainability_score"] - original_analysis["overall_sustainability_score"]

    return {
        "original": {
            "score": original_analysis["overall_sustainability_score"],
            "classification": original_analysis["classification"],
            "annual_energy_kwh": original_analysis["energy"]["annual_energy_kwh"],
            "energy_intensity_kwh_m2": original_analysis["energy"]["energy_intensity_kwh_m2"],
            "annual_water_litres": original_analysis["water"]["annual_water_litres"],
            "water_lpcd": original_analysis["water"]["water_per_occupant_lpcd"],
            "total_carbon_tons": original_analysis["carbon"]["total_carbon_tons"],
            "carbon_intensity_kg_m2": original_analysis["carbon"]["carbon_intensity_kg_m2"],
        },
        "simulated": {
            "score": simulated_analysis["overall_sustainability_score"],
            "classification": simulated_analysis["classification"],
            "annual_energy_kwh": simulated_analysis["energy"]["annual_energy_kwh"],
            "energy_intensity_kwh_m2": simulated_analysis["energy"]["energy_intensity_kwh_m2"],
            "annual_water_litres": simulated_analysis["water"]["annual_water_litres"],
            "water_lpcd": simulated_analysis["water"]["water_per_occupant_lpcd"],
            "total_carbon_tons": simulated_analysis["carbon"]["total_carbon_tons"],
            "carbon_intensity_kg_m2": simulated_analysis["carbon"]["carbon_intensity_kg_m2"],
        },
        "deltas": {
            "score_delta": round(score_delta, 1),
            "energy_saved_kwh": round(energy_delta_kwh, 2),
            "water_saved_litres": round(water_delta_litres, 2),
            "carbon_reduced_tons": round(carbon_delta_tons, 2),
            "percent_score_improvement": round((score_delta / max(original_analysis["overall_sustainability_score"], 1.0)) * 100.0, 1)
        },
        "applied_parameters": {
            "solar_capacity_kw": e_sim["solar_capacity_kw"],
            "recycled_percentage": m_sim["recycled_percentage"],
            "lighting_type": e_sim["lighting_type"],
            "hvac_system": e_sim["hvac_system"],
            "rainwater_harvesting": w_sim["rainwater_harvesting"],
            "water_efficient_fixtures": w_sim["water_efficient_fixtures"],
        }
    }
