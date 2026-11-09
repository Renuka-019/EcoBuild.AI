import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    user_type = Column(String, default="Builder")  # Student, Builder, Architect, Engineer, Other
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    buildings = relationship("Building", back_populates="owner", cascade="all, delete-orphan")
    comparisons = relationship("Comparison", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_name = Column(String, nullable=False)
    building_type = Column(String, nullable=False)  # Residential, Commercial, Industrial, Educational, Healthcare, Institutional, Other
    location = Column(String, nullable=False)
    built_up_area_m2 = Column(Float, nullable=False)
    floors = Column(Integer, default=1)
    occupants = Column(Integer, default=1)
    construction_year = Column(Integer, default=2026)
    orientation = Column(String, default="North-South")
    building_usage = Column(String, default="General Occupancy")
    is_draft = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="buildings")
    energy_detail = relationship("EnergyDetail", uselist=False, back_populates="building", cascade="all, delete-orphan")
    water_detail = relationship("WaterDetail", uselist=False, back_populates="building", cascade="all, delete-orphan")
    material_detail = relationship("MaterialDetail", uselist=False, back_populates="building", cascade="all, delete-orphan")
    cost_detail = relationship("CostDetail", uselist=False, back_populates="building", cascade="all, delete-orphan")
    analyses = relationship("AnalysisResult", back_populates="building", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="building", cascade="all, delete-orphan")
    simulations = relationship("SimulationScenario", back_populates="building", cascade="all, delete-orphan")


class EnergyDetail(Base):
    __tablename__ = "energy_details"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    annual_electricity_kwh = Column(Float, default=0.0)
    hvac_system = Column(String, default="Split AC")  # Centralized, Split AC, VRV/VRF, Natural Only, None
    lighting_type = Column(String, default="LED")  # LED, Fluorescent, Mixed, Incandescent
    renewable_available = Column(Boolean, default=False)
    solar_capacity_kw = Column(Float, default=0.0)
    electricity_source = Column(String, default="Grid")  # Grid, Solar+Grid, Diesel/Captive, 100% Renewable
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="energy_detail")


class WaterDetail(Base):
    __tablename__ = "water_details"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    daily_water_litres = Column(Float, default=0.0)
    water_source = Column(String, default="Municipal Supply")  # Municipal Supply, Borewell, Tanker, Mixed
    rainwater_harvesting = Column(Boolean, default=False)
    water_efficient_fixtures = Column(Boolean, default=False)
    wastewater_recycling = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="water_detail")


class MaterialDetail(Base):
    __tablename__ = "material_details"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    concrete_m3 = Column(Float, default=0.0)
    steel_kg = Column(Float, default=0.0)
    brick_count = Column(Float, default=0.0)
    recycled_percentage = Column(Float, default=0.0)
    local_sourced_percentage = Column(Float, default=0.0)
    other_materials_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="material_detail")


class CostDetail(Base):
    __tablename__ = "cost_details"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    construction_cost = Column(Float, default=0.0)
    energy_cost_annual = Column(Float, default=0.0)
    water_cost_annual = Column(Float, default=0.0)
    maintenance_cost_annual = Column(Float, default=0.0)
    budget = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="cost_detail")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    overall_sustainability_score = Column(Float, nullable=False)  # 0 to 100
    classification = Column(String, nullable=False)  # Platinum (90+), Gold (75-89), Silver (60-74), Certified (50-59), Needs Improvement (<50)
    
    # Energy metrics
    energy_intensity_kwh_m2 = Column(Float, nullable=False)
    annual_energy_kwh = Column(Float, nullable=False)
    potential_solar_generation_kwh = Column(Float, default=0.0)
    potential_energy_savings_kwh = Column(Float, default=0.0)
    energy_efficiency_class = Column(String, default="B")
    
    # Water metrics
    daily_water_litres = Column(Float, nullable=False)
    annual_water_litres = Column(Float, nullable=False)
    water_per_occupant_lpcd = Column(Float, nullable=False)
    rainwater_harvest_potential_litres = Column(Float, default=0.0)
    potential_water_savings_litres = Column(Float, default=0.0)

    # Carbon metrics
    operational_carbon_tons = Column(Float, nullable=False)
    embodied_carbon_tons = Column(Float, nullable=False)
    total_carbon_tons = Column(Float, nullable=False)
    carbon_intensity_kg_m2 = Column(Float, nullable=False)

    # Material contributions
    concrete_carbon_tons = Column(Float, default=0.0)
    steel_carbon_tons = Column(Float, default=0.0)
    brick_carbon_tons = Column(Float, default=0.0)

    # Category Scores (0-100)
    energy_score = Column(Float, default=0.0)
    water_score = Column(Float, default=0.0)
    carbon_score = Column(Float, default=0.0)
    materials_score = Column(Float, default=0.0)

    # Metadata & assumptions
    calculation_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="analyses")
    recommendations = relationship("Recommendation", back_populates="analysis", cascade="all, delete-orphan")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analysis_results.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Renewable Energy, Energy Efficiency, Water Conservation, Sustainable Materials, Carbon Reduction, Natural Ventilation, Waste Management
    problem_identified = Column(Text, nullable=False)
    suggested_improvement = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    environmental_benefit = Column(Text, nullable=False)
    estimated_cost_category = Column(String, default="Medium")  # Low, Medium, High, Capital
    implementation_difficulty = Column(String, default="Moderate")  # Easy, Moderate, Advanced
    priority = Column(String, default="Medium")  # High, Medium, Low
    
    # Quantitative impact estimates
    expected_savings_kwh = Column(Float, default=0.0)
    expected_savings_water_l = Column(Float, default=0.0)
    expected_savings_carbon_tons = Column(Float, default=0.0)
    estimated_annual_roi_usd = Column(Float, default=0.0)
    applied = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("AnalysisResult", back_populates="recommendations")


class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    building_ids = Column(JSON, nullable=False)  # List of IDs e.g. [1, 2]
    priority_preference = Column(String, default="Balanced Performance")  # Lowest Carbon, Lowest Cost, Highest Sustainability, Balanced Performance
    comparison_data = Column(JSON, nullable=False)  # Side-by-side metrics, deltas, winners
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="comparisons")


class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    modified_parameters = Column(JSON, nullable=False)
    resulting_scores = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="simulations")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_title = Column(String, nullable=False)
    report_type = Column(String, default="Full Sustainability Audit")
    file_path = Column(String, nullable=False)
    score = Column(Float, default=0.0)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    building = relationship("Building", back_populates="reports")
    user = relationship("User", back_populates="reports")


class Benchmark(Base):
    __tablename__ = "benchmarks"

    id = Column(Integer, primary_key=True, index=True)
    building_type = Column(String, nullable=False)  # Residential, Commercial, Industrial, Educational, Healthcare
    region = Column(String, default="Global / Standard")
    climate_zone = Column(String, default="Tropical / Composite")
    energy_intensity_benchmark = Column(Float, nullable=False)  # kWh/m²/year
    water_per_occupant_benchmark = Column(Float, nullable=False)  # Litres/person/day
    carbon_intensity_benchmark = Column(Float, nullable=False)  # kg CO2e/m²/year
    source = Column(String, nullable=False)  # e.g., ASHRAE 90.1, IGBC Green Baseline, BEE India, LEED v4.1
    source_year = Column(Integer, default=2024)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SustainableSolution(Base):
    __tablename__ = "sustainable_solutions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Renewable Energy, Water Management, Green Building Materials, Passive Architecture, Energy Efficiency, Waste Management, Sustainable Landscaping
    description = Column(Text, nullable=False)
    environmental_benefit = Column(Text, nullable=False)
    application = Column(Text, nullable=False)
    cost_category = Column(String, default="Medium")  # Low, Medium, High, Capital
    implementation_difficulty = Column(String, default="Moderate")  # Easy, Moderate, Advanced
    potential_savings_desc = Column(String, nullable=False)
    suitable_building_types = Column(String, default="All Types")
    tags = Column(String, default="efficiency,green")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Electricity, Material, Transport, Water
    factor_value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)  # kg CO2e/kWh, kg CO2e/kg, kg CO2e/m3
    region = Column(String, default="Standard")
    source = Column(String, default="IPCC / GHG Protocol")
    source_year = Column(Integer, default=2024)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    target_type = Column(String, nullable=True)
    target_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="activity_logs")
