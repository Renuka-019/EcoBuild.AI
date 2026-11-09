"""
EcoBuild AI - Core Scientific Environmental Calculation Engine
Deterministic formulas for Energy, Water, Carbon (Embodied + Operational), Materials,
and Explainable 0-100 Sustainability Scoring.
All emission factors referenced from IPCC, ICE (Bath), CEA, and ASHRAE/IGBC baselines.
"""

from typing import Dict, Any, Tuple

# Baseline regional benchmarks (kWh/m²/year, LPCD, kg CO2e/m²)
BENCHMARKS = {
    "Residential": {
        "eui": 110.0,
        "water_lpcd": 135.0,
        "carbon_intensity": 85.0
    },
    "Commercial": {
        "eui": 160.0,
        "water_lpcd": 45.0,
        "carbon_intensity": 125.0
    },
    "Educational": {
        "eui": 95.0,
        "water_lpcd": 35.0,
        "carbon_intensity": 70.0
    },
    "Healthcare": {
        "eui": 280.0,
        "water_lpcd": 340.0,
        "carbon_intensity": 210.0
    },
    "Industrial": {
        "eui": 220.0,
        "water_lpcd": 60.0,
        "carbon_intensity": 175.0
    },
    "Institutional": {
        "eui": 130.0,
        "water_lpcd": 40.0,
        "carbon_intensity": 95.0
    },
    "Other": {
        "eui": 130.0,
        "water_lpcd": 80.0,
        "carbon_intensity": 100.0
    }
}

# Emission factors (ICE Bath / IPCC 2024 / CEA Grid)
GRID_EMISSION_FACTOR = 0.716  # kg CO2e / kWh
CONCRETE_EMISSION_FACTOR_STD = 240.0  # kg CO2e / m3 for standard C25/30 mix
CONCRETE_EMISSION_FACTOR_LOW = 145.0  # kg CO2e / m3 with 40% GGBS/Fly Ash
STEEL_EMISSION_FACTOR_VIRGIN = 1.85   # kg CO2e / kg
STEEL_EMISSION_FACTOR_RECYCLED = 0.72 # kg CO2e / kg (EAF scrap-based)
BRICK_EMISSION_FACTOR = 0.24          # kg CO2e / brick (fired clay)
ANNUAL_RAINFALL_MM = 850.0            # Average rainfall in mm
RUNOFF_COEFFICIENT = 0.85             # Concrete / tile roof runoff factor
FILTER_EFFICIENCY = 0.80              # First-flush and particulate filter efficiency
SOLAR_PEAK_HOURS = 1450.0             # Equivalent full-load hours per year
SOLAR_PERFORMANCE_RATIO = 0.78        # System performance ratio (losses, inverter, temp)


def calculate_energy(
    built_up_area_m2: float,
    floors: int,
    annual_electricity_kwh: float,
    building_type: str,
    solar_capacity_kw: float = 0.0,
    hvac_system: str = "Split AC",
    lighting_type: str = "LED"
) -> Dict[str, Any]:
    area = max(built_up_area_m2, 1.0)
    num_floors = max(floors, 1)
    roof_area = area / num_floors

    # If electricity is 0, estimate from building type benchmark
    bm = BENCHMARKS.get(building_type, BENCHMARKS["Other"])
    is_estimated = (annual_electricity_kwh <= 0.0)
    actual_kwh = annual_electricity_kwh if not is_estimated else (bm["eui"] * area)

    # Energy Intensity
    eui = actual_kwh / area

    # Solar generation
    actual_solar_kwh = solar_capacity_kw * SOLAR_PEAK_HOURS * SOLAR_PERFORMANCE_RATIO

    # Potential Solar if rooftop utilized (40% usable roof area, ~6.5 m² per kWp)
    potential_kw = (roof_area * 0.40) / 6.5
    potential_solar_kwh = potential_kw * SOLAR_PEAK_HOURS * SOLAR_PERFORMANCE_RATIO

    # Efficiency Classification
    if eui <= 60:
        eff_class = "A+"
    elif eui <= 90:
        eff_class = "A"
    elif eui <= 130:
        eff_class = "B"
    elif eui <= 180:
        eff_class = "C"
    elif eui <= 250:
        eff_class = "D"
    else:
        eff_class = "E"

    # Potential savings by upgrading HVAC & lighting & utilizing solar
    hvac_savings_factor = 0.15 if hvac_system not in ["VRV/VRF", "Natural Only"] else 0.05
    lighting_savings_factor = 0.12 if lighting_type != "LED" else 0.02
    potential_efficiency_savings = actual_kwh * (hvac_savings_factor + lighting_savings_factor)
    total_potential_savings = potential_efficiency_savings + potential_solar_kwh

    return {
        "annual_energy_kwh": round(actual_kwh, 2),
        "energy_intensity_kwh_m2": round(eui, 2),
        "benchmark_eui": bm["eui"],
        "energy_efficiency_class": eff_class,
        "actual_solar_kwh": round(actual_solar_kwh, 2),
        "potential_solar_capacity_kw": round(potential_kw, 2),
        "potential_solar_generation_kwh": round(potential_solar_kwh, 2),
        "potential_energy_savings_kwh": round(total_potential_savings, 2),
        "is_estimated": is_estimated
    }


def calculate_water(
    built_up_area_m2: float,
    floors: int,
    occupants: int,
    daily_water_litres: float,
    building_type: str,
    rainwater_harvesting: bool = False,
    water_efficient_fixtures: bool = False,
    wastewater_recycling: bool = False
) -> Dict[str, Any]:
    area = max(built_up_area_m2, 1.0)
    num_floors = max(floors, 1)
    num_occupants = max(occupants, 1)
    roof_area = area / num_floors

    bm = BENCHMARKS.get(building_type, BENCHMARKS["Other"])
    is_estimated = (daily_water_litres <= 0.0)
    actual_daily = daily_water_litres if not is_estimated else (bm["water_lpcd"] * num_occupants)
    annual_water = actual_daily * 365.0
    water_per_occupant = actual_daily / num_occupants

    # Rainwater Harvesting Potential (Litres/year)
    # R = Area (m2) * Rainfall (mm) * Runoff * Filter
    rainwater_potential = roof_area * ANNUAL_RAINFALL_MM * RUNOFF_COEFFICIENT * FILTER_EFFICIENCY

    # Potential savings
    fixture_savings = annual_water * 0.28 if not water_efficient_fixtures else 0.0
    recycling_savings = annual_water * 0.35 if not wastewater_recycling else 0.0
    rwh_savings = min(rainwater_potential, annual_water * 0.40) if not rainwater_harvesting else 0.0
    total_potential_water_savings = fixture_savings + recycling_savings + rwh_savings

    return {
        "daily_water_litres": round(actual_daily, 2),
        "annual_water_litres": round(annual_water, 2),
        "water_per_occupant_lpcd": round(water_per_occupant, 2),
        "benchmark_lpcd": bm["water_lpcd"],
        "rainwater_harvest_potential_litres": round(rainwater_potential, 2),
        "potential_water_savings_litres": round(total_potential_water_savings, 2),
        "is_estimated": is_estimated
    }


def calculate_carbon_and_materials(
    built_up_area_m2: float,
    annual_energy_kwh: float,
    actual_solar_kwh: float,
    concrete_m3: float = 0.0,
    steel_kg: float = 0.0,
    brick_count: float = 0.0,
    recycled_percentage: float = 0.0,
    local_sourced_percentage: float = 0.0
) -> Dict[str, Any]:
    area = max(built_up_area_m2, 1.0)

    # 1. Operational Carbon (Annual tonnes of CO2e)
    net_grid_kwh = max(annual_energy_kwh - actual_solar_kwh, 0.0)
    operational_carbon_kg = net_grid_kwh * GRID_EMISSION_FACTOR
    operational_carbon_tons = operational_carbon_kg / 1000.0

    # 2. Embodied Carbon of Materials
    # Default material quantities if 0 entered (based on standard structural rule-of-thumb per m2)
    has_custom_materials = (concrete_m3 > 0 or steel_kg > 0 or brick_count > 0)
    c_m3 = concrete_m3 if has_custom_materials else (area * 0.32)
    s_kg = steel_kg if has_custom_materials else (c_m3 * 80.0)
    b_count = brick_count if has_custom_materials else (area * 35.0)

    # Calculate material carbon with circularity discount
    recycled_ratio = min(max(recycled_percentage / 100.0, 0.0), 1.0)
    local_ratio = min(max(local_sourced_percentage / 100.0, 0.0), 1.0)

    concrete_unit_factor = CONCRETE_EMISSION_FACTOR_STD * (1.0 - 0.35 * recycled_ratio)
    steel_unit_factor = (STEEL_EMISSION_FACTOR_VIRGIN * (1.0 - recycled_ratio)) + (STEEL_EMISSION_FACTOR_RECYCLED * recycled_ratio)
    brick_unit_factor = BRICK_EMISSION_FACTOR * (1.0 - 0.20 * recycled_ratio)

    concrete_carbon_kg = c_m3 * concrete_unit_factor
    steel_carbon_kg = s_kg * steel_unit_factor
    brick_carbon_kg = b_count * brick_unit_factor

    # Transport emission reduction from local sourcing
    transport_reduction = (concrete_carbon_kg + steel_carbon_kg + brick_carbon_kg) * 0.08 * local_ratio
    total_embodied_kg = max((concrete_carbon_kg + steel_carbon_kg + brick_carbon_kg) - transport_reduction, 0.0)
    embodied_carbon_tons = total_embodied_kg / 1000.0

    # Amortized annual embodied carbon over 50-year structural design life
    annual_embodied_tons = embodied_carbon_tons / 50.0

    # Total annual carbon footprint = Operational Carbon + Annualized Embodied Carbon
    total_carbon_tons = operational_carbon_tons + annual_embodied_tons
    carbon_intensity_kg_m2 = (total_carbon_tons * 1000.0) / area

    return {
        "operational_carbon_tons": round(operational_carbon_tons, 2),
        "embodied_carbon_tons": round(embodied_carbon_tons, 2),
        "annual_embodied_tons": round(annual_embodied_tons, 2),
        "total_carbon_tons": round(total_carbon_tons, 2),
        "carbon_intensity_kg_m2": round(carbon_intensity_kg_m2, 2),
        "concrete_carbon_tons": round(concrete_carbon_kg / 1000.0, 2),
        "steel_carbon_tons": round(steel_carbon_kg / 1000.0, 2),
        "brick_carbon_tons": round(brick_carbon_kg / 1000.0, 2),
        "effective_concrete_m3": round(c_m3, 2),
        "effective_steel_kg": round(s_kg, 2),
        "effective_brick_count": round(b_count, 2),
        "is_materials_estimated": not has_custom_materials
    }


def calculate_sustainability_scores(
    energy_data: Dict[str, Any],
    water_data: Dict[str, Any],
    carbon_data: Dict[str, Any],
    building_data: Dict[str, Any]
) -> Tuple[float, str, float, float, float, float]:
    """
    Computes explainable component scores (0-100) and weighted total composite score.
    Weights:
      - Energy Performance: 35%
      - Carbon Footprint: 30%
      - Water Conservation: 20%
      - Materials Circularity: 15%
    """
    # 1. Energy Score (35%)
    # Ratio of benchmark EUI to actual EUI (higher is better, capped at 100)
    bm_eui = energy_data["benchmark_eui"]
    actual_eui = energy_data["energy_intensity_kwh_m2"]
    eui_ratio = bm_eui / max(actual_eui, 20.0)
    base_energy_score = min(eui_ratio * 70.0, 85.0)
    
    # Bonuses for renewable and efficient lighting
    solar_bonus = min((energy_data["actual_solar_kwh"] / max(energy_data["annual_energy_kwh"], 1.0)) * 25.0, 15.0)
    energy_score = round(min(max(base_energy_score + solar_bonus, 20.0), 100.0), 1)

    # 2. Water Score (20%)
    bm_water = water_data["benchmark_lpcd"]
    actual_water = water_data["water_per_occupant_lpcd"]
    water_ratio = bm_water / max(actual_water, 15.0)
    base_water_score = min(water_ratio * 60.0, 75.0)

    water_bonus = 0.0
    if building_data.get("rainwater_harvesting"):
        water_bonus += 12.0
    if building_data.get("water_efficient_fixtures"):
        water_bonus += 8.0
    if building_data.get("wastewater_recycling"):
        water_bonus += 10.0
    water_score = round(min(max(base_water_score + water_bonus, 20.0), 100.0), 1)

    # 3. Carbon Score (30%)
    # Evaluates carbon intensity against benchmark
    bm_carbon = BENCHMARKS.get(building_data.get("building_type", "Other"), BENCHMARKS["Other"])["carbon_intensity"]
    actual_carbon = carbon_data["carbon_intensity_kg_m2"]
    carbon_ratio = bm_carbon / max(actual_carbon, 10.0)
    carbon_score = round(min(max(carbon_ratio * 70.0, 20.0), 100.0), 1)

    # 4. Materials Score (15%)
    recycled_pct = building_data.get("recycled_percentage", 0.0)
    local_pct = building_data.get("local_sourced_percentage", 0.0)
    materials_score = round(min(max(40.0 + (recycled_pct * 0.35) + (local_pct * 0.25), 20.0), 100.0), 1)

    # Weighted Overall Sustainability Score (0-100)
    overall_score = round(
        (energy_score * 0.35) +
        (carbon_score * 0.30) +
        (water_score * 0.20) +
        (materials_score * 0.15),
        1
    )

    # Classification
    if overall_score >= 90.0:
        classification = "Platinum"
    elif overall_score >= 75.0:
        classification = "Gold"
    elif overall_score >= 60.0:
        classification = "Silver"
    elif overall_score >= 50.0:
        classification = "Certified"
    else:
        classification = "Needs Improvement"

    return overall_score, classification, energy_score, water_score, carbon_score, materials_score


def run_full_environmental_analysis(
    building_meta: Dict[str, Any],
    energy_meta: Dict[str, Any],
    water_meta: Dict[str, Any],
    material_meta: Dict[str, Any],
    cost_meta: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Executes the comprehensive environmental assessment pipeline.
    """
    area = building_meta.get("built_up_area_m2", 1000.0)
    floors = building_meta.get("floors", 1)
    occupants = building_meta.get("occupants", 10)
    b_type = building_meta.get("building_type", "Residential")

    energy_res = calculate_energy(
        built_up_area_m2=area,
        floors=floors,
        annual_electricity_kwh=energy_meta.get("annual_electricity_kwh", 0.0),
        building_type=b_type,
        solar_capacity_kw=energy_meta.get("solar_capacity_kw", 0.0),
        hvac_system=energy_meta.get("hvac_system", "Split AC"),
        lighting_type=energy_meta.get("lighting_type", "LED")
    )

    water_res = calculate_water(
        built_up_area_m2=area,
        floors=floors,
        occupants=occupants,
        daily_water_litres=water_meta.get("daily_water_litres", 0.0),
        building_type=b_type,
        rainwater_harvesting=water_meta.get("rainwater_harvesting", False),
        water_efficient_fixtures=water_meta.get("water_efficient_fixtures", False),
        wastewater_recycling=water_meta.get("wastewater_recycling", False)
    )

    carbon_res = calculate_carbon_and_materials(
        built_up_area_m2=area,
        annual_energy_kwh=energy_res["annual_energy_kwh"],
        actual_solar_kwh=energy_res["actual_solar_kwh"],
        concrete_m3=material_meta.get("concrete_m3", 0.0),
        steel_kg=material_meta.get("steel_kg", 0.0),
        brick_count=material_meta.get("brick_count", 0.0),
        recycled_percentage=material_meta.get("recycled_percentage", 0.0),
        local_sourced_percentage=material_meta.get("local_sourced_percentage", 0.0)
    )

    building_composite = {
        "building_type": b_type,
        "rainwater_harvesting": water_meta.get("rainwater_harvesting", False),
        "water_efficient_fixtures": water_meta.get("water_efficient_fixtures", False),
        "wastewater_recycling": water_meta.get("wastewater_recycling", False),
        "recycled_percentage": material_meta.get("recycled_percentage", 0.0),
        "local_sourced_percentage": material_meta.get("local_sourced_percentage", 0.0),
    }

    score, classification, e_score, w_score, c_score, m_score = calculate_sustainability_scores(
        energy_res, water_res, carbon_res, building_composite
    )

    return {
        "overall_sustainability_score": score,
        "classification": classification,
        "energy_score": e_score,
        "water_score": w_score,
        "carbon_score": c_score,
        "materials_score": m_score,
        "energy": energy_res,
        "water": water_res,
        "carbon": carbon_res,
        "metadata": {
            "emission_factors": {
                "grid_co2e_per_kwh": GRID_EMISSION_FACTOR,
                "concrete_co2e_per_m3": CONCRETE_EMISSION_FACTOR_STD,
                "steel_co2e_per_kg": STEEL_EMISSION_FACTOR_VIRGIN,
                "brick_co2e_per_unit": BRICK_EMISSION_FACTOR
            },
            "benchmarks": BENCHMARKS.get(b_type, BENCHMARKS["Other"]),
            "building_info": {
                "built_up_area_m2": area,
                "floors": floors,
                "occupants": occupants,
                "building_type": b_type
            }
        }
    }
