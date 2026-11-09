from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    user_type: str = "Builder"  # Student, Builder, Architect, Engineer, Other

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    user_type: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    user_type: str
    is_admin: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Building Sub-Schemas
class EnergyDetailSchema(BaseModel):
    annual_electricity_kwh: float = Field(0.0, ge=0)
    hvac_system: str = "Split AC"
    lighting_type: str = "LED"
    renewable_available: bool = False
    solar_capacity_kw: float = Field(0.0, ge=0)
    electricity_source: str = "Grid"

class WaterDetailSchema(BaseModel):
    daily_water_litres: float = Field(0.0, ge=0)
    water_source: str = "Municipal Supply"
    rainwater_harvesting: bool = False
    water_efficient_fixtures: bool = False
    wastewater_recycling: bool = False

class MaterialDetailSchema(BaseModel):
    concrete_m3: float = Field(0.0, ge=0)
    steel_kg: float = Field(0.0, ge=0)
    brick_count: float = Field(0.0, ge=0)
    recycled_percentage: float = Field(0.0, ge=0, le=100)
    local_sourced_percentage: float = Field(0.0, ge=0, le=100)
    other_materials_notes: Optional[str] = None

class CostDetailSchema(BaseModel):
    construction_cost: float = Field(0.0, ge=0)
    energy_cost_annual: float = Field(0.0, ge=0)
    water_cost_annual: float = Field(0.0, ge=0)
    maintenance_cost_annual: float = Field(0.0, ge=0)
    budget: float = Field(0.0, ge=0)

# Building Base & Create
class BuildingCreate(BaseModel):
    project_name: str
    building_type: str
    location: str
    built_up_area_m2: float = Field(..., gt=0)
    floors: int = Field(1, ge=1)
    occupants: int = Field(1, ge=1)
    construction_year: int = Field(2026, ge=1900, le=2100)
    orientation: str = "North-South"
    building_usage: str = "General Occupancy"
    is_draft: bool = False
    
    energy: Optional[EnergyDetailSchema] = None
    water: Optional[WaterDetailSchema] = None
    materials: Optional[MaterialDetailSchema] = None
    cost: Optional[CostDetailSchema] = None

class BuildingUpdate(BaseModel):
    project_name: Optional[str] = None
    building_type: Optional[str] = None
    location: Optional[str] = None
    built_up_area_m2: Optional[float] = None
    floors: Optional[int] = None
    occupants: Optional[int] = None
    construction_year: Optional[int] = None
    orientation: Optional[str] = None
    building_usage: Optional[str] = None
    is_draft: Optional[bool] = None
    energy: Optional[EnergyDetailSchema] = None
    water: Optional[WaterDetailSchema] = None
    materials: Optional[MaterialDetailSchema] = None
    cost: Optional[CostDetailSchema] = None

class BuildingOut(BaseModel):
    id: int
    user_id: int
    project_name: str
    building_type: str
    location: str
    built_up_area_m2: float
    floors: int
    occupants: int
    construction_year: int
    orientation: str
    building_usage: str
    is_draft: bool
    created_at: datetime
    updated_at: datetime
    energy: Optional[Dict[str, Any]] = None
    water: Optional[Dict[str, Any]] = None
    materials: Optional[Dict[str, Any]] = None
    cost: Optional[Dict[str, Any]] = None
    latest_score: Optional[float] = None
    class Config:
        from_attributes = True

# Analysis Schemas
class RecommendationOut(BaseModel):
    id: int
    title: str
    category: str
    problem_identified: str
    suggested_improvement: str
    reason: str
    environmental_benefit: str
    estimated_cost_category: str
    implementation_difficulty: str
    priority: str
    expected_savings_kwh: float
    expected_savings_water_l: float
    expected_savings_carbon_tons: float
    estimated_annual_roi_usd: float
    applied: bool
    class Config:
        from_attributes = True

class AnalysisResultOut(BaseModel):
    id: int
    building_id: int
    overall_sustainability_score: float
    classification: str
    energy_intensity_kwh_m2: float
    annual_energy_kwh: float
    potential_solar_generation_kwh: float
    potential_energy_savings_kwh: float
    energy_efficiency_class: str
    daily_water_litres: float
    annual_water_litres: float
    water_per_occupant_lpcd: float
    rainwater_harvest_potential_litres: float
    potential_water_savings_litres: float
    operational_carbon_tons: float
    embodied_carbon_tons: float
    total_carbon_tons: float
    carbon_intensity_kg_m2: float
    concrete_carbon_tons: float
    steel_carbon_tons: float
    brick_carbon_tons: float
    energy_score: float
    water_score: float
    carbon_score: float
    materials_score: float
    calculation_metadata: Optional[Dict[str, Any]] = None
    recommendations: List[RecommendationOut] = []
    created_at: datetime
    class Config:
        from_attributes = True

# Comparison & Simulation Schemas
class ComparisonCreate(BaseModel):
    title: str
    building_ids: List[int]
    priority_preference: str = "Balanced Performance"

class SimulationRun(BaseModel):
    building_id: int
    solar_capacity_kw: Optional[float] = None
    recycled_percentage: Optional[float] = None
    natural_ventilation: Optional[bool] = None
    rainwater_harvesting: Optional[bool] = None
    water_efficient_fixtures: Optional[bool] = None
    low_carbon_concrete: Optional[bool] = None
    energy_efficient_lighting: Optional[bool] = None

class SimulationSaveAsDesign(BaseModel):
    building_id: int
    new_project_name: str
    simulation_params: Dict[str, Any]

# Benchmarks & Solutions
class BenchmarkOut(BaseModel):
    id: int
    building_type: str
    region: str
    climate_zone: str
    energy_intensity_benchmark: float
    water_per_occupant_benchmark: float
    carbon_intensity_benchmark: float
    source: str
    source_year: int
    class Config:
        from_attributes = True

class SustainableSolutionOut(BaseModel):
    id: int
    title: str
    category: str
    description: str
    environmental_benefit: str
    application: str
    cost_category: str
    implementation_difficulty: str
    potential_savings_desc: str
    suitable_building_types: str
    tags: str
    class Config:
        from_attributes = True

# Dashboard Summary
class DashboardSummary(BaseModel):
    total_buildings: int
    average_score: float
    total_energy_kwh: float
    total_water_litres: float
    total_carbon_tons: float
    potential_energy_savings_kwh: float
    recent_buildings: List[Dict[str, Any]]
    activity_timeline: List[Dict[str, Any]]
    score_distribution: Dict[str, int]
    top_recommendations: List[Dict[str, Any]]
