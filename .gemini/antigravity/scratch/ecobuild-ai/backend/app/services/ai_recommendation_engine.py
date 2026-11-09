"""
EcoBuild AI - AI-Powered Recommendation Engine
Generates explainable, prioritized, domain-specific sustainable recommendations
grounded directly in the empirical analysis metrics of the building.
"""

from typing import List, Dict, Any

def generate_recommendations(analysis: Dict[str, Any], building: Dict[str, Any]) -> List[Dict[str, Any]]:
    recommendations = []
    energy = analysis.get("energy", {})
    water = analysis.get("water", {})
    carbon = analysis.get("carbon", {})
    metadata = analysis.get("metadata", {})
    benchmarks = metadata.get("benchmarks", {})
    
    area = building.get("built_up_area_m2", 1000.0)
    eui = energy.get("energy_intensity_kwh_m2", 0.0)
    bm_eui = benchmarks.get("eui", 120.0)
    actual_kwh = energy.get("annual_energy_kwh", 0.0)
    solar_kw = building.get("solar_capacity_kw", 0.0)
    
    lpcd = water.get("water_per_occupant_lpcd", 0.0)
    bm_lpcd = benchmarks.get("water_lpcd", 100.0)
    annual_water = water.get("annual_water_litres", 0.0)
    has_rwh = building.get("rainwater_harvesting", False)
    has_fixtures = building.get("water_efficient_fixtures", False)
    has_recycling = building.get("wastewater_recycling", False)
    
    recycled_pct = building.get("recycled_percentage", 0.0)
    local_pct = building.get("local_sourced_percentage", 0.0)
    embodied_tons = carbon.get("embodied_carbon_tons", 0.0)
    
    # 1. Solar Photovoltaic Rooftop Generation
    potential_solar_gen = energy.get("potential_solar_generation_kwh", 0.0)
    if solar_kw < 5.0 and potential_solar_gen > 1000.0:
        offset_carbon = round((potential_solar_gen * 0.716) / 1000.0, 2)
        annual_savings_usd = round(potential_solar_gen * 0.11, 2)
        priority = "High" if eui > bm_eui * 0.9 else "Medium"
        recommendations.append({
            "title": "Rooftop Solar PV Microgrid Installation",
            "category": "Renewable Energy",
            "problem_identified": f"Grid electricity dependency generates {carbon.get('operational_carbon_tons', 0.0)} tonnes of operational CO2e annually without on-site clean power.",
            "suggested_improvement": f"Deploy a {energy.get('potential_solar_capacity_kw', 10.0)} kWp monocrystalline rooftop solar PV array.",
            "reason": "Unshaded rooftop area provides strong solar irradiance capable of offsetting major base load electricity.",
            "environmental_benefit": f"Clean on-site electricity generation reducing grid emissions by {offset_carbon} tCO2e/year.",
            "estimated_cost_category": "Capital",
            "implementation_difficulty": "Moderate",
            "priority": priority,
            "expected_savings_kwh": round(potential_solar_gen, 2),
            "expected_savings_water_l": 0.0,
            "expected_savings_carbon_tons": offset_carbon,
            "estimated_annual_roi_usd": annual_savings_usd,
            "apply_patch": {"solar_capacity_kw": energy.get("potential_solar_capacity_kw", 10.0), "renewable_available": True}
        })

    # 2. HVAC & Natural Ventilation Optimization
    hvac_type = building.get("hvac_system", "Split AC")
    if hvac_type in ["Split AC", "Centralized"] or eui > bm_eui:
        cooling_savings_kwh = round(actual_kwh * 0.22, 2)
        c_savings = round((cooling_savings_kwh * 0.716) / 1000.0, 2)
        recommendations.append({
            "title": "High-Efficiency VRV/VRF with Mixed-Mode Natural Ventilation",
            "category": "Energy Efficiency",
            "problem_identified": f"Current cooling & HVAC setup has high thermal loads resulting in an elevated Energy Intensity of {eui} kWh/m²/year.",
            "suggested_improvement": "Upgrade to Variable Refrigerant Flow (VRF) with programmable thermostats and automated operable louvers for nighttime cross-ventilation.",
            "reason": "Variable-speed compressors adjust dynamically to occupancy and outside ambient temperatures, eliminating 20-30% thermal waste.",
            "environmental_benefit": f"Cuts overall building energy consumption by up to {cooling_savings_kwh} kWh/year.",
            "estimated_cost_category": "Medium",
            "implementation_difficulty": "Moderate",
            "priority": "High" if eui > bm_eui else "Medium",
            "expected_savings_kwh": cooling_savings_kwh,
            "expected_savings_water_l": 0.0,
            "expected_savings_carbon_tons": c_savings,
            "estimated_annual_roi_usd": round(cooling_savings_kwh * 0.11, 2),
            "apply_patch": {"hvac_system": "VRV/VRF"}
        })

    # 3. Smart LED & Daylight Harvesting Sensor Controls
    lighting = building.get("lighting_type", "LED")
    if lighting != "LED":
        led_savings_kwh = round(actual_kwh * 0.14, 2)
        c_savings = round((led_savings_kwh * 0.716) / 1000.0, 2)
        recommendations.append({
            "title": "Smart LED Conversion with Ambient Daylight Harvesting",
            "category": "Energy Efficiency",
            "problem_identified": f"Non-LED lighting fixtures consume unnecessary parasitic power and generate secondary internal heat.",
            "suggested_improvement": "Retrofit 100% of luminaire fixtures with dimmable LEDs paired with PIR motion sensors and daylight lux dimmers.",
            "reason": "Modern LED luminaires deliver over 130 lm/W efficiency compared to 60-80 lm/W for conventional fluorescents.",
            "environmental_benefit": f"Immediate 50-70% lighting power reduction saving {led_savings_kwh} kWh annually.",
            "estimated_cost_category": "Low",
            "implementation_difficulty": "Easy",
            "priority": "High",
            "expected_savings_kwh": led_savings_kwh,
            "expected_savings_water_l": 0.0,
            "expected_savings_carbon_tons": c_savings,
            "estimated_annual_roi_usd": round(led_savings_kwh * 0.11, 2),
            "apply_patch": {"lighting_type": "LED"}
        })

    # 4. Rainwater Harvesting & Retention Recharge System
    rwh_pot = water.get("rainwater_harvest_potential_litres", 0.0)
    if not has_rwh and rwh_pot > 5000.0:
        annual_saved_water = round(min(rwh_pot, annual_water * 0.45), 2)
        recommendations.append({
            "title": "Rooftop Rainwater Harvesting & Dual Filtration Cistern",
            "category": "Water Conservation",
            "problem_identified": "Precipitation falling on the roof structure is currently discharged as stormwater runoff instead of being captured.",
            "suggested_improvement": f"Install a {round(rwh_pot * 0.35, 0)}L underground rainwater collection sump with gravel-sand dual media filtration.",
            "reason": f"Rooftop catchment area is capable of harvesting up to {rwh_pot} litres of high-quality water annually during monsoons.",
            "environmental_benefit": f"Replaces municipal or tanker extraction by {annual_saved_water} litres/year and mitigates urban flooding.",
            "estimated_cost_category": "Medium",
            "implementation_difficulty": "Moderate",
            "priority": "High" if lpcd > bm_lpcd else "Medium",
            "expected_savings_kwh": 0.0,
            "expected_savings_water_l": annual_saved_water,
            "expected_savings_carbon_tons": round((annual_saved_water * 0.00035), 2),
            "estimated_annual_roi_usd": round(annual_saved_water * 0.002, 2),
            "apply_patch": {"rainwater_harvesting": True}
        })

    # 5. Low-Flow Aerators & Dual-Flush Sanitary Fixtures
    if not has_fixtures:
        fixture_water_saved = round(annual_water * 0.28, 2)
        recommendations.append({
            "title": "Low-Flow Sanitary Fixtures & Sensor Faucets",
            "category": "Water Conservation",
            "problem_identified": "Standard plumbing fixtures flow at 9-12 litres/min, leading to substantial unmonitored domestic water waste.",
            "suggested_improvement": "Equip all basins with 3.5 LPM pressure-compensating aerators and dual-flush (3L/6L) WCs.",
            "reason": "Aerated laminar streams maintain identical hand-wash tactile pressure while eliminating 30-40% volume discharge.",
            "environmental_benefit": f"Saves an estimated {fixture_water_saved} litres of treated water every single year.",
            "estimated_cost_category": "Low",
            "implementation_difficulty": "Easy",
            "priority": "High",
            "expected_savings_kwh": 0.0,
            "expected_savings_water_l": fixture_water_saved,
            "expected_savings_carbon_tons": round((fixture_water_saved * 0.00025), 2),
            "estimated_annual_roi_usd": round(fixture_water_saved * 0.002, 2),
            "apply_patch": {"water_efficient_fixtures": True}
        })

    # 6. Low-Carbon GGBS Concrete & Pozzolanic Substitution
    if recycled_pct < 25.0:
        carbon_saved = round(embodied_tons * 0.28, 2)
        recommendations.append({
            "title": "Low-Carbon Pozzolanic Concrete (GGBS / Fly Ash 40%)",
            "category": "Sustainable Materials",
            "problem_identified": f"Structural concrete and virgin materials represent a high embodied carbon footprint of {carbon.get('concrete_carbon_tons', 0.0)} tCO2e.",
            "suggested_improvement": "Specify Portland Pozzolana Cement (PPC) or 40% Ground Granulated Blast-Furnace Slag (GGBS) replacement for all foundation and slab casting.",
            "reason": "Slag is an industrial by-product that lowers hydration heat, enhances sulphate resistance, and cuts cement clinker emissions by ~35%.",
            "environmental_benefit": f"Prevents {carbon_saved} tonnes of embodied CO2e from entering the atmosphere during construction.",
            "estimated_cost_category": "Low",
            "implementation_difficulty": "Easy",
            "priority": "High",
            "expected_savings_kwh": 0.0,
            "expected_savings_water_l": 0.0,
            "expected_savings_carbon_tons": carbon_saved,
            "estimated_annual_roi_usd": 0.0,
            "apply_patch": {"recycled_percentage": 35.0}
        })

    # 7. Local Material Procurement within 400 km
    if local_pct < 40.0:
        transport_carbon_saved = round(embodied_tons * 0.08, 2)
        recommendations.append({
            "title": "Regional Material Sourcing Protocol (< 400 km Radius)",
            "category": "Carbon Reduction",
            "problem_identified": "Long-distance freight transport of heavy aggregates, masonry, and steel inflates Scope 3 supply chain carbon emissions.",
            "suggested_improvement": "Contract certified regional suppliers for at least 60% of bulk structural weight (sand, gravel, AAC blocks, cement).",
            "reason": "Minimizing diesel heavy-vehicle tonne-kilometers directly suppresses logistics particulate and greenhouse gases.",
            "environmental_benefit": f"Reduces transport-related embodied footprint by ~{transport_carbon_saved} tCO2e.",
            "estimated_cost_category": "Low",
            "implementation_difficulty": "Easy",
            "priority": "Medium",
            "expected_savings_kwh": 0.0,
            "expected_savings_water_l": 0.0,
            "expected_savings_carbon_tons": transport_carbon_saved,
            "estimated_annual_roi_usd": round(transport_carbon_saved * 25.0, 2),
            "apply_patch": {"local_sourced_percentage": 65.0}
        })

    # 8. Greywater Recycling & Wetland Sub-Surface Irrigation
    if not has_recycling and lpcd > 40.0:
        greywater_saved = round(annual_water * 0.32, 2)
        recommendations.append({
            "title": "Decentralized Greywater Bioremediation & Flushing Loop",
            "category": "Water Management",
            "problem_identified": "Sink, shower, and laundry wastewater is discarded into sewage despite requiring minimal filtration for non-potable reuse.",
            "suggested_improvement": "Install a compact phytoremediation wetland or aerobic Moving Bed Biofilm Reactor (MBBR) for landscape irrigation and toilet flushing.",
            "reason": "Reclaiming greywater closes the on-site water cycle and reduces municipal freshwater demand by 30-40%.",
            "environmental_benefit": f"Recycles {greywater_saved} litres of water annually, relieving stressed municipal water tables.",
            "estimated_cost_category": "High",
            "implementation_difficulty": "Advanced",
            "priority": "Medium",
            "expected_savings_kwh": 0.0,
            "expected_savings_water_l": greywater_saved,
            "expected_savings_carbon_tons": round((greywater_saved * 0.0003), 2),
            "estimated_annual_roi_usd": round(greywater_saved * 0.0025, 2),
            "apply_patch": {"wastewater_recycling": True}
        })

    return recommendations
