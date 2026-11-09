"""
EcoBuild AI - Database Seeding Script
Initializes standard benchmarks, sustainable solutions library, emission factors,
default admin, and initial demonstration buildings with full analyses.
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models.all_models import (
    User, Building, EnergyDetail, WaterDetail, MaterialDetail, CostDetail,
    Benchmark, SustainableSolution, EmissionFactor, AnalysisResult, Recommendation
)
from app.auth import hash_password
from app.services.calculation_engine import run_full_environmental_analysis
from app.services.ai_recommendation_engine import generate_recommendations

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Admin & Demo User
        admin = db.query(User).filter(User.email == "admin@ecobuild.ai").first()
        if not admin:
            admin = User(
                email="admin@ecobuild.ai",
                hashed_password=hash_password("AdminPass123!"),
                full_name="EcoBuild System Admin",
                user_type="Engineer",
                is_admin=True,
                is_active=True
            )
            db.add(admin)

        demo_user = db.query(User).filter(User.email == "demo@ecobuild.ai").first()
        if not demo_user:
            demo_user = User(
                email="demo@ecobuild.ai",
                hashed_password=hash_password("DemoPass123!"),
                full_name="Sarah Jenkins (Lead Architect)",
                user_type="Architect",
                is_admin=False,
                is_active=True
            )
            db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # 2. Benchmarks
        if db.query(Benchmark).count() == 0:
            benchmarks_data = [
                Benchmark(
                    building_type="Residential",
                    region="Global / Standard",
                    climate_zone="Composite / Subtropical",
                    energy_intensity_benchmark=110.0,
                    water_per_occupant_benchmark=135.0,
                    carbon_intensity_benchmark=85.0,
                    source="IGBC Green Homes / NBC Baseline",
                    source_year=2024
                ),
                Benchmark(
                    building_type="Commercial",
                    region="Global / Standard",
                    climate_zone="Composite / Warm & Humid",
                    energy_intensity_benchmark=160.0,
                    water_per_occupant_benchmark=45.0,
                    carbon_intensity_benchmark=125.0,
                    source="ASHRAE Standard 90.1 / BEE Star Rating",
                    source_year=2024
                ),
                Benchmark(
                    building_type="Educational",
                    region="Global / Standard",
                    climate_zone="Temperate / Moderate",
                    energy_intensity_benchmark=95.0,
                    water_per_occupant_benchmark=35.0,
                    carbon_intensity_benchmark=70.0,
                    source="GRIHA for Existing & New Campuses",
                    source_year=2023
                ),
                Benchmark(
                    building_type="Healthcare",
                    region="Global / Standard",
                    climate_zone="All Climatic Zones",
                    energy_intensity_benchmark=280.0,
                    water_per_occupant_benchmark=340.0,
                    carbon_intensity_benchmark=210.0,
                    source="LEED v4.1 Healthcare Performance Standard",
                    source_year=2024
                ),
                Benchmark(
                    building_type="Industrial",
                    region="Global / Standard",
                    climate_zone="Standard Industrial Zone",
                    energy_intensity_benchmark=220.0,
                    water_per_occupant_benchmark=60.0,
                    carbon_intensity_benchmark=175.0,
                    source="ISO 50001 Energy Management Norms",
                    source_year=2023
                )
            ]
            db.add_all(benchmarks_data)

        # 3. Sustainable Solutions Library
        if db.query(SustainableSolution).count() == 0:
            solutions_data = [
                SustainableSolution(
                    title="Bifacial Rooftop Solar Photovoltaic (PV) System",
                    category="Renewable Energy",
                    description="High-efficiency bifacial solar modules mounted on elevated aluminium pergolas. Captures direct overhead solar irradiance and albedo reflection from light-colored roof surfaces.",
                    environmental_benefit="Generates 1,450 kWh per installed kWp annually, offsetting fossil-fuel electricity and avoiding ~1.04 tCO2e/kWp.",
                    application="Commercial, Institutional, and Multi-family residential rooftops with unshaded southern/south-western exposure.",
                    cost_category="Capital",
                    implementation_difficulty="Moderate",
                    potential_savings_desc="35-65% electricity bill offset with 3.5 to 5 year typical capital payback.",
                    suitable_building_types="All Building Types",
                    tags="solar,photovoltaic,clean-energy,carbon-offset"
                ),
                SustainableSolution(
                    title="Rooftop Rainwater Harvesting & Dual Sump Cistern",
                    category="Water Management",
                    description="Gravitational collection flumes, self-cleaning first-flush diverters, and underground reinforced dual-chamber storage tanks with sand-gravel media filtration.",
                    environmental_benefit="Harvests 80-85% of annual rainfall on roof footprints, preventing storm surges and recharging deep aquifers.",
                    application="All building typologies with pitched or flat roofs; integrates into gravity-fed flushing and irrigation piping.",
                    cost_category="Medium",
                    implementation_difficulty="Moderate",
                    potential_savings_desc="Up to 40% reduction in municipal water bills and emergency tanker purchases.",
                    suitable_building_types="Residential, Educational, Commercial",
                    tags="water,rainwater,aquifer-recharge,conservation"
                ),
                SustainableSolution(
                    title="Low-Carbon Pozzolanic Concrete (40% GGBS / Fly Ash)",
                    category="Green Building Materials",
                    description="Replacing Ordinary Portland Cement (OPC) clinker with industrial pozzolans (Ground Granulated Blast-Furnace Slag or Class F fly ash) in structural mix designs.",
                    environmental_benefit="Reduces embodied carbon of structural concrete by 30-40% while enhancing long-term compressive strength and chemical durability.",
                    application="Foundations, retaining walls, columns, beams, and pre-cast facade panels.",
                    cost_category="Low",
                    implementation_difficulty="Easy",
                    potential_savings_desc="Equal or lower procurement cost per cubic meter with massive embodied CO2e reductions.",
                    suitable_building_types="All Building Types",
                    tags="materials,concrete,embodied-carbon,circularity"
                ),
                SustainableSolution(
                    title="Automated Variable Refrigerant Flow (VRF) with Heat Recovery",
                    category="Energy Efficiency",
                    description="Inverter-driven multi-split HVAC system with simultaneous heating and cooling capabilities, modulating refrigerant volume to match room thermal demand.",
                    environmental_benefit="Delivers seasonal energy efficiency ratio (ISEER) above 4.5, cutting heating/cooling power draw by 25-35%.",
                    application="Office spaces, educational laboratories, hospitality, and zoned residential apartments.",
                    cost_category="Medium",
                    implementation_difficulty="Moderate",
                    potential_savings_desc="20-30% whole-building energy savings relative to conventional chillers.",
                    suitable_building_types="Commercial, Institutional, Healthcare",
                    tags="hvac,energy-efficiency,vrf,thermal-comfort"
                ),
                SustainableSolution(
                    title="Solar Chimney & Thermal Stack Natural Ventilation",
                    category="Passive Architecture",
                    description="Vertical architectural shafts painted with solar-absorbing coatings that heat interior air, causing it to rise and draw cooler outdoor breeze through habitable spaces.",
                    environmental_benefit="Provides 10-15 air changes per hour without electric air handlers during transition seasons.",
                    application="Atriums, stairwells, and perimeter double-skin envelopes in moderate or dry climate zones.",
                    cost_category="Medium",
                    implementation_difficulty="Moderate",
                    potential_savings_desc="Eliminates artificial air conditioning for 3-5 months each year.",
                    suitable_building_types="Educational, Residential, Institutional",
                    tags="passive,natural-ventilation,solar-chimney,zero-energy"
                ),
                SustainableSolution(
                    title="Phytoremediation Constructed Wetland for Greywater Recycling",
                    category="Water Management",
                    description="Engineered horizontal sub-surface flow reed beds planted with Phragmites australis and Typha latifolia that biologically degrade organics and pathogens.",
                    environmental_benefit="Zero-chemical, gravity-driven wastewater treatment producing secondary-standard effluent for toilet flushing and landscape irrigation.",
                    application="Ground-level landscapes, courtyard gardens, and peri-urban campus developments.",
                    cost_category="Medium",
                    implementation_difficulty="Advanced",
                    potential_savings_desc="Cuts net freshwater intake by 30-45% annually.",
                    suitable_building_types="Educational, Residential, Hospitality",
                    tags="greywater,wetland,eco-treatment,circular-water"
                ),
                SustainableSolution(
                    title="High-Performance Low-E Double Glazed Windows (Argon Filled)",
                    category="Passive Architecture",
                    description="Insulated glazing units (IGU) featuring low-emissivity microscopic metal coatings, 12mm argon-filled acoustic cavities, and thermally broken aluminium frames.",
                    environmental_benefit="Solar Heat Gain Coefficient (SHGC) < 0.28 and U-value < 1.6 W/m²K, repelling infrared heat while admitting 65% visible light.",
                    application="Building envelopes, curtain walls, and exterior fenestration facing East, South, and West.",
                    cost_category="Medium",
                    implementation_difficulty="Moderate",
                    potential_savings_desc="Cuts perimeter cooling compressor loads by 18-24%.",
                    suitable_building_types="Commercial, Residential, Healthcare",
                    tags="glazing,low-e,thermal-insulation,daylight"
                ),
                SustainableSolution(
                    title="Smart Pressure-Compensating Aerators and Waterless Urinals",
                    category="Water Management",
                    description="Fixture attachments blending micro-droplet air with water streams maintaining 3.5 LPM flow rates alongside hydrophobic barrier waterless urinals.",
                    environmental_benefit="Directly eliminates 30-50% domestic faucet water volume without compromising wash sanitation.",
                    application="Commercial restrooms, school campuses, corporate cafeterias, and domestic kitchens.",
                    cost_category="Low",
                    implementation_difficulty="Easy",
                    potential_savings_desc="Rapid 2 to 4 month return on investment with thousands of litres saved daily.",
                    suitable_building_types="All Building Types",
                    tags="fixtures,low-flow,waterless,rapid-roi"
                ),
                SustainableSolution(
                    title="Green Vegetated Rooftop & Urban Biodiversity Oasis",
                    category="Sustainable Landscaping",
                    description="Extensive modular sedum and indigenous succulent roof assemblies with root barriers, drainage mats, and lightweight volcanic pumice growing substrates.",
                    environmental_benefit="Mitigates urban heat island effect, reduces top-floor indoor temperatures by 3-5°C, and buffers 70% of stormwater flash runoff.",
                    application="Reinforced flat roofs of residential condominiums, commercial headquarters, and civic museums.",
                    cost_category="Medium",
                    implementation_difficulty="Moderate",
                    potential_savings_desc="Extends roof waterproofing membrane lifespan by 2x while slashing cooling energy.",
                    suitable_building_types="Commercial, Residential, Institutional",
                    tags="green-roof,urban-biodiversity,heat-island,cooling"
                ),
                SustainableSolution(
                    title="High-Fly-Ash Autoclaved Aerated Concrete (AAC) Blocks",
                    category="Green Building Materials",
                    description="Precision-engineered masonry blocks fabricated from 65-70% recycled thermal fly ash, lime, gypsum, and aluminium foaming agents.",
                    environmental_benefit="3x lighter than standard clay bricks, saving structural frame steel while delivering exceptional thermal insulation (U = 0.16 W/mK).",
                    application="Non-load-bearing exterior envelope walls and interior partitions.",
                    cost_category="Low",
                    implementation_difficulty="Easy",
                    potential_savings_desc="Speeds construction speed by 20% and lowers mortar usage by 60%.",
                    suitable_building_types="All Building Types",
                    tags="aac-blocks,masonry,thermal-insulation,recycled"
                )
            ]
            db.add_all(solutions_data)

        # 4. Standard Emission Factors
        if db.query(EmissionFactor).count() == 0:
            factors = [
                EmissionFactor(name="National Grid Electricity (Standard)", category="Electricity", factor_value=0.716, unit="kg CO2e / kWh", region="National", source="CEA 2024"),
                EmissionFactor(name="Ordinary Portland Cement Concrete (C25/30)", category="Material", factor_value=240.0, unit="kg CO2e / m3", region="Standard", source="ICE Database v3.0"),
                EmissionFactor(name="Low-Carbon Slag Concrete (40% GGBS)", category="Material", factor_value=145.0, unit="kg CO2e / m3", region="Standard", source="ICE Database v3.0"),
                EmissionFactor(name="Structural Steel (Virgin BOS Route)", category="Material", factor_value=1.85, unit="kg CO2e / kg", region="Global", source="WorldSteel / ICE"),
                EmissionFactor(name="Structural Steel (Recycled EAF Route)", category="Material", factor_value=0.72, unit="kg CO2e / kg", region="Global", source="WorldSteel / ICE"),
                EmissionFactor(name="Kiln-Fired Clay Brick", category="Material", factor_value=0.24, unit="kg CO2e / unit", region="Regional", source="CPCB / TERI"),
                EmissionFactor(name="Diesel Freight Transportation", category="Transport", factor_value=0.082, unit="kg CO2e / tonne-km", region="Standard", source="DEFRA 2024"),
                EmissionFactor(name="Municipal Potable Water Supply", category="Water", factor_value=0.00035, unit="kg CO2e / Litre", region="Urban", source="GHG Protocol"),
            ]
            db.add_all(factors)

        # 5. Pre-seed 2 Sample Buildings for Demo User to enable immediate comparison, simulation, and reports
        if db.query(Building).filter(Building.user_id == demo_user.id).count() == 0:
            # Building 1: Green Eco-Hub (Sustainable Design)
            b1 = Building(
                user_id=demo_user.id,
                project_name="Solaria Eco-Living Residences",
                building_type="Residential",
                location="Bengaluru, India",
                built_up_area_m2=3200.0,
                floors=4,
                occupants=65,
                construction_year=2026,
                orientation="North-South",
                building_usage="Sustainable Co-Housing Complex",
                is_draft=False
            )
            db.add(b1)
            db.flush()

            b1_energy = EnergyDetail(
                building_id=b1.id,
                annual_electricity_kwh=195000.0,
                hvac_system="VRV/VRF",
                lighting_type="LED",
                renewable_available=True,
                solar_capacity_kw=45.0,
                electricity_source="Solar+Grid"
            )
            b1_water = WaterDetail(
                building_id=b1.id,
                daily_water_litres=6800.0,
                water_source="Municipal Supply",
                rainwater_harvesting=True,
                water_efficient_fixtures=True,
                wastewater_recycling=True
            )
            b1_material = MaterialDetail(
                building_id=b1.id,
                concrete_m3=1050.0,
                steel_kg=84000.0,
                brick_count=98000.0,
                recycled_percentage=38.0,
                local_sourced_percentage=65.0,
                other_materials_notes="40% GGBS concrete, bamboo composite louvers, AAC block infill"
            )
            b1_cost = CostDetail(
                building_id=b1.id,
                construction_cost=2400000.0,
                energy_cost_annual=21450.0,
                water_cost_annual=4800.0,
                maintenance_cost_annual=18000.0,
                budget=2600000.0
            )
            db.add_all([b1_energy, b1_water, b1_material, b1_cost])
            db.flush()

            # Run and store analysis for Building 1
            b1_analysis_res = run_full_environmental_analysis(
                {"built_up_area_m2": 3200.0, "floors": 4, "occupants": 65, "building_type": "Residential"},
                {"annual_electricity_kwh": 195000.0, "solar_capacity_kw": 45.0, "hvac_system": "VRV/VRF", "lighting_type": "LED"},
                {"daily_water_litres": 6800.0, "rainwater_harvesting": True, "water_efficient_fixtures": True, "wastewater_recycling": True},
                {"concrete_m3": 1050.0, "steel_kg": 84000.0, "brick_count": 98000.0, "recycled_percentage": 38.0, "local_sourced_percentage": 65.0},
                {"construction_cost": 2400000.0}
            )

            a1 = AnalysisResult(
                building_id=b1.id,
                overall_sustainability_score=b1_analysis_res["overall_sustainability_score"],
                classification=b1_analysis_res["classification"],
                energy_intensity_kwh_m2=b1_analysis_res["energy"]["energy_intensity_kwh_m2"],
                annual_energy_kwh=b1_analysis_res["energy"]["annual_energy_kwh"],
                potential_solar_generation_kwh=b1_analysis_res["energy"]["potential_solar_generation_kwh"],
                potential_energy_savings_kwh=b1_analysis_res["energy"]["potential_energy_savings_kwh"],
                energy_efficiency_class=b1_analysis_res["energy"]["energy_efficiency_class"],
                daily_water_litres=b1_analysis_res["water"]["daily_water_litres"],
                annual_water_litres=b1_analysis_res["water"]["annual_water_litres"],
                water_per_occupant_lpcd=b1_analysis_res["water"]["water_per_occupant_lpcd"],
                rainwater_harvest_potential_litres=b1_analysis_res["water"]["rainwater_harvest_potential_litres"],
                potential_water_savings_litres=b1_analysis_res["water"]["potential_water_savings_litres"],
                operational_carbon_tons=b1_analysis_res["carbon"]["operational_carbon_tons"],
                embodied_carbon_tons=b1_analysis_res["carbon"]["embodied_carbon_tons"],
                total_carbon_tons=b1_analysis_res["carbon"]["total_carbon_tons"],
                carbon_intensity_kg_m2=b1_analysis_res["carbon"]["carbon_intensity_kg_m2"],
                concrete_carbon_tons=b1_analysis_res["carbon"]["concrete_carbon_tons"],
                steel_carbon_tons=b1_analysis_res["carbon"]["steel_carbon_tons"],
                brick_carbon_tons=b1_analysis_res["carbon"]["brick_carbon_tons"],
                energy_score=b1_analysis_res["energy_score"],
                water_score=b1_analysis_res["water_score"],
                carbon_score=b1_analysis_res["carbon_score"],
                materials_score=b1_analysis_res["materials_score"],
                calculation_metadata=b1_analysis_res["metadata"]
            )
            db.add(a1)
            db.flush()

            recs1 = generate_recommendations(b1_analysis_res, {
                "built_up_area_m2": 3200.0, "hvac_system": "VRV/VRF", "lighting_type": "LED",
                "solar_capacity_kw": 45.0, "rainwater_harvesting": True, "water_efficient_fixtures": True,
                "wastewater_recycling": True, "recycled_percentage": 38.0, "local_sourced_percentage": 65.0
            })
            for r in recs1:
                db.add(Recommendation(
                    analysis_id=a1.id,
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

            # Building 2: Metro Commercial Tower (Conventional Baseline Design)
            b2 = Building(
                user_id=demo_user.id,
                project_name="Apex Metro Commercial Tower",
                building_type="Commercial",
                location="Bengaluru, India",
                built_up_area_m2=6500.0,
                floors=8,
                occupants=280,
                construction_year=2025,
                orientation="East-West",
                building_usage="Corporate Grade-A Offices",
                is_draft=False
            )
            db.add(b2)
            db.flush()

            b2_energy = EnergyDetail(
                building_id=b2.id,
                annual_electricity_kwh=1280000.0,
                hvac_system="Centralized",
                lighting_type="Fluorescent",
                renewable_available=False,
                solar_capacity_kw=0.0,
                electricity_source="Grid"
            )
            b2_water = WaterDetail(
                building_id=b2.id,
                daily_water_litres=16800.0,
                water_source="Municipal Supply",
                rainwater_harvesting=False,
                water_efficient_fixtures=False,
                wastewater_recycling=False
            )
            b2_material = MaterialDetail(
                building_id=b2.id,
                concrete_m3=2400.0,
                steel_kg=220000.0,
                brick_count=180000.0,
                recycled_percentage=5.0,
                local_sourced_percentage=20.0,
                other_materials_notes="Conventional standard Portland concrete, tinted glazing"
            )
            b2_cost = CostDetail(
                building_id=b2.id,
                construction_cost=4800000.0,
                energy_cost_annual=140800.0,
                water_cost_annual=15200.0,
                maintenance_cost_annual=42000.0,
                budget=5000000.0
            )
            db.add_all([b2_energy, b2_water, b2_material, b2_cost])
            db.flush()

            # Run and store analysis for Building 2
            b2_analysis_res = run_full_environmental_analysis(
                {"built_up_area_m2": 6500.0, "floors": 8, "occupants": 280, "building_type": "Commercial"},
                {"annual_electricity_kwh": 1280000.0, "solar_capacity_kw": 0.0, "hvac_system": "Centralized", "lighting_type": "Fluorescent"},
                {"daily_water_litres": 16800.0, "rainwater_harvesting": False, "water_efficient_fixtures": False, "wastewater_recycling": False},
                {"concrete_m3": 2400.0, "steel_kg": 220000.0, "brick_count": 180000.0, "recycled_percentage": 5.0, "local_sourced_percentage": 20.0},
                {"construction_cost": 4800000.0}
            )

            a2 = AnalysisResult(
                building_id=b2.id,
                overall_sustainability_score=b2_analysis_res["overall_sustainability_score"],
                classification=b2_analysis_res["classification"],
                energy_intensity_kwh_m2=b2_analysis_res["energy"]["energy_intensity_kwh_m2"],
                annual_energy_kwh=b2_analysis_res["energy"]["annual_energy_kwh"],
                potential_solar_generation_kwh=b2_analysis_res["energy"]["potential_solar_generation_kwh"],
                potential_energy_savings_kwh=b2_analysis_res["energy"]["potential_energy_savings_kwh"],
                energy_efficiency_class=b2_analysis_res["energy"]["energy_efficiency_class"],
                daily_water_litres=b2_analysis_res["water"]["daily_water_litres"],
                annual_water_litres=b2_analysis_res["water"]["annual_water_litres"],
                water_per_occupant_lpcd=b2_analysis_res["water"]["water_per_occupant_lpcd"],
                rainwater_harvest_potential_litres=b2_analysis_res["water"]["rainwater_harvest_potential_litres"],
                potential_water_savings_litres=b2_analysis_res["water"]["potential_water_savings_litres"],
                operational_carbon_tons=b2_analysis_res["carbon"]["operational_carbon_tons"],
                embodied_carbon_tons=b2_analysis_res["carbon"]["embodied_carbon_tons"],
                total_carbon_tons=b2_analysis_res["carbon"]["total_carbon_tons"],
                carbon_intensity_kg_m2=b2_analysis_res["carbon"]["carbon_intensity_kg_m2"],
                concrete_carbon_tons=b2_analysis_res["carbon"]["concrete_carbon_tons"],
                steel_carbon_tons=b2_analysis_res["carbon"]["steel_carbon_tons"],
                brick_carbon_tons=b2_analysis_res["carbon"]["brick_carbon_tons"],
                energy_score=b2_analysis_res["energy_score"],
                water_score=b2_analysis_res["water_score"],
                carbon_score=b2_analysis_res["carbon_score"],
                materials_score=b2_analysis_res["materials_score"],
                calculation_metadata=b2_analysis_res["metadata"]
            )
            db.add(a2)
            db.flush()

            recs2 = generate_recommendations(b2_analysis_res, {
                "built_up_area_m2": 6500.0, "hvac_system": "Centralized", "lighting_type": "Fluorescent",
                "solar_capacity_kw": 0.0, "rainwater_harvesting": False, "water_efficient_fixtures": False,
                "wastewater_recycling": False, "recycled_percentage": 5.0, "local_sourced_percentage": 20.0
            })
            for r in recs2:
                db.add(Recommendation(
                    analysis_id=a2.id,
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

        db.commit()
        print("Database seeded successfully with users, solutions, benchmarks, and demo projects!")
    except Exception as exc:
        db.rollback()
        print(f"Error during seeding: {exc}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
