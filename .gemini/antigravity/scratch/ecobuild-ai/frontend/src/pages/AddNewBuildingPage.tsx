import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  Building2,
  Zap,
  Droplets,
  Boxes,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Save,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const AddNewBuildingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Information
  const [projectName, setProjectName] = useState('');
  const [buildingType, setBuildingType] = useState('Residential');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState<number | ''>(1200);
  const [floors, setFloors] = useState<number | ''>(3);
  const [occupants, setOccupants] = useState<number | ''>(24);
  const [constructionYear, setConstructionYear] = useState<number | ''>(2026);
  const [orientation, setOrientation] = useState('North-South');
  const [usage, setUsage] = useState('Multi-Family Apartments');

  // Step 2: Energy Details
  const [electricityKwh, setElectricityKwh] = useState<number | ''>(95000);
  const [hvac, setHvac] = useState('Split AC');
  const [lighting, setLighting] = useState('LED');
  const [renewableAvailable, setRenewableAvailable] = useState(false);
  const [solarCapacity, setSolarCapacity] = useState<number | ''>(0);
  const [electricitySource, setElectricitySource] = useState('Grid');

  // Step 3: Water Details
  const [waterDaily, setWaterDaily] = useState<number | ''>(3200);
  const [waterSource, setWaterSource] = useState('Municipal Supply');
  const [rainwaterHarvesting, setRainwaterHarvesting] = useState(false);
  const [waterFixtures, setWaterFixtures] = useState(false);
  const [wasteRecycling, setWasteRecycling] = useState(false);

  // Step 4: Material Details
  const [concreteM3, setConcreteM3] = useState<number | ''>(380);
  const [steelKg, setSteelKg] = useState<number | ''>(30400);
  const [brickCount, setBrickCount] = useState<number | ''>(42000);
  const [recycledPercentage, setRecycledPercentage] = useState<number | ''>(15);
  const [localPercentage, setLocalPercentage] = useState<number | ''>(40);
  const [materialNotes, setMaterialNotes] = useState('');

  // Step 5: Cost Details
  const [constructionCost, setConstructionCost] = useState<number | ''>(950000);
  const [energyCost, setEnergyCost] = useState<number | ''>(10450);
  const [waterCost, setWaterCost] = useState<number | ''>(2400);
  const [maintenanceCost, setMaintenanceCost] = useState<number | ''>(8500);
  const [budget, setBudget] = useState<number | ''>(1100000);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all form fields?')) {
      setProjectName('');
      setLocation('');
      setArea(1000);
      setFloors(1);
      setOccupants(10);
      setCurrentStep(1);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    setError('');
    if (!projectName.trim()) {
      setError('Project Name is required');
      setCurrentStep(1);
      return;
    }
    if (!location.trim()) {
      setError('Location is required');
      setCurrentStep(1);
      return;
    }
    if (!area || Number(area) <= 0) {
      setError('Built-up Area must be greater than 0');
      setCurrentStep(1);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        project_name: projectName,
        building_type: buildingType,
        location,
        built_up_area_m2: Number(area),
        floors: Number(floors) || 1,
        occupants: Number(occupants) || 1,
        construction_year: Number(constructionYear) || 2026,
        orientation,
        building_usage: usage,
        is_draft: isDraft,
        energy: {
          annual_electricity_kwh: Number(electricityKwh) || 0,
          hvac_system: hvac,
          lighting_type: lighting,
          renewable_available: renewableAvailable,
          solar_capacity_kw: Number(solarCapacity) || 0,
          electricity_source: electricitySource,
        },
        water: {
          daily_water_litres: Number(waterDaily) || 0,
          water_source: waterSource,
          rainwater_harvesting: rainwaterHarvesting,
          water_efficient_fixtures: waterFixtures,
          wastewater_recycling: wasteRecycling,
        },
        materials: {
          concrete_m3: Number(concreteM3) || 0,
          steel_kg: Number(steelKg) || 0,
          brick_count: Number(brickCount) || 0,
          recycled_percentage: Number(recycledPercentage) || 0,
          local_sourced_percentage: Number(localPercentage) || 0,
          other_materials_notes: materialNotes,
        },
        cost: {
          construction_cost: Number(constructionCost) || 0,
          energy_cost_annual: Number(energyCost) || 0,
          water_cost_annual: Number(waterCost) || 0,
          maintenance_cost_annual: Number(maintenanceCost) || 0,
          budget: Number(budget) || 0,
        }
      };

      const created = await api.createBuilding(payload);
      if (isDraft) {
        navigate('/buildings');
      } else {
        // Automatically trigger environmental analysis pipeline!
        navigate(`/analyze/${created.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save building');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Basic Info', icon: Building2 },
    { num: 2, title: 'Energy', icon: Zap },
    { num: 3, title: 'Water', icon: Droplets },
    { num: 4, title: 'Materials', icon: Boxes },
    { num: 5, title: 'Cost Details', icon: DollarSign },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-5xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Parametric Intake Wizard
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Add New Building Specification
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Fill in building geometry, energy systems, water recycling, and material quantities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3.5 py-2 rounded-xl bg-mist hover:bg-white text-ink text-xs font-mono font-medium transition-colors border border-ink/10 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSave(true)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-mist text-ink text-xs font-mono font-medium transition-colors border border-ink/10 flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-forest" />
              Save Draft
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Progression Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-ink/10 shadow-sm">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {stepsList.map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl transition-all ${
                  currentStep === s.num
                    ? 'bg-ink text-lime font-bold shadow-md'
                    : currentStep > s.num
                    ? 'bg-lime/20 text-forest border border-lime2/50 font-semibold'
                    : 'bg-paper text-ink2/50 hover:bg-mist'
                }`}
              >
                <s.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="text-[10px] sm:text-xs font-mono">
                  {s.num}. {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ink/10 shadow-sm space-y-6">
          
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-ink/5 pb-4">
                <span className="text-xs font-mono font-bold uppercase text-emeraldGreen">Step 01</span>
                <h3 className="text-xl font-bold text-ink font-sans">Basic Building Parameters</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eco-Living Residences Phase 2"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Building Typology *
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-sans focus:ring-2 focus:ring-lime2 focus:outline-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial (Office / Retail)</option>
                    <option value="Industrial">Industrial / Warehouse</option>
                    <option value="Educational">Educational Campus</option>
                    <option value="Healthcare">Healthcare / Hospital</option>
                    <option value="Institutional">Institutional / Civic</option>
                    <option value="Other">Other Multi-use</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Geographic Location / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Gross Built-up Area (m²) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1500"
                    value={area}
                    onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3"
                    value={floors}
                    onChange={(e) => setFloors(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Average Daily Occupants (People)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 35"
                    value={occupants}
                    onChange={(e) => setOccupants(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Construction / Commissioning Year
                  </label>
                  <input
                    type="number"
                    min="1980"
                    max="2035"
                    value={constructionYear}
                    onChange={(e) => setConstructionYear(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Building Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-sans focus:ring-2 focus:ring-lime2 focus:outline-none"
                  >
                    <option value="North-South">North-South (Recommended for shading)</option>
                    <option value="East-West">East-West</option>
                    <option value="Northeast-Southwest">Northeast-Southwest</option>
                    <option value="Northwest-Southeast">Northwest-Southeast</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Energy Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-ink/5 pb-4">
                <span className="text-xs font-mono font-bold uppercase text-emeraldGreen">Step 02</span>
                <h3 className="text-xl font-bold text-ink font-sans">Energy & Thermal Systems</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Annual Electricity Consumption (kWh)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter 0 to auto-estimate from benchmark"
                    value={electricityKwh}
                    onChange={(e) => setElectricityKwh(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                  <span className="text-[11px] text-ink2/60 font-sans block mt-1">
                    Tip: Enter 0 if electricity consumption is not yet metered.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Primary HVAC / Cooling System
                  </label>
                  <select
                    value={hvac}
                    onChange={(e) => setHvac(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-sans focus:ring-2 focus:ring-lime2 focus:outline-none"
                  >
                    <option value="Split AC">Standard Split AC Units</option>
                    <option value="Centralized">Central Chilled Water Plant</option>
                    <option value="VRV/VRF">Variable Refrigerant Flow (VRV/VRF)</option>
                    <option value="Natural Only">Passive / Natural Ventilation Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Primary Luminaire Lighting
                  </label>
                  <select
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-sans focus:ring-2 focus:ring-lime2 focus:outline-none"
                  >
                    <option value="LED">100% Solid-State LED Luminaires</option>
                    <option value="Fluorescent">Fluorescent T5 / CFL Tubes</option>
                    <option value="Mixed">Mixed Lighting Configuration</option>
                    <option value="Incandescent">Legacy Incandescent / Halogen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Solar Photovoltaic Capacity (kWp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 25"
                    value={solarCapacity}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setSolarCapacity(val);
                      setRenewableAvailable(Number(val) > 0);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Electricity Grid Source
                  </label>
                  <select
                    value={electricitySource}
                    onChange={(e) => setElectricitySource(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-sans focus:ring-2 focus:ring-lime2 focus:outline-none"
                  >
                    <option value="Grid">100% National / Regional Utility Grid</option>
                    <option value="Solar+Grid">Rooftop Solar + Grid Backed</option>
                    <option value="100% Renewable">Certified Green Tariff / PPA</option>
                    <option value="Diesel/Captive">Diesel Captive Generator</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Water Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-ink/5 pb-4">
                <span className="text-xs font-mono font-bold uppercase text-emeraldGreen">Step 03</span>
                <h3 className="text-xl font-bold text-ink font-sans">Hydrological & Plumbing Design</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Daily Water Consumption (Litres)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter 0 to auto-estimate from occupants"
                    value={waterDaily}
                    onChange={(e) => setWaterDaily(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Primary Water Supply Source
                  </label>
                  <select
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-sans focus:ring-2 focus:ring-lime2 focus:outline-none"
                  >
                    <option value="Municipal Supply">Municipal Piped Network</option>
                    <option value="Borewell">Groundwater Borewell</option>
                    <option value="Tanker">Private Tanker Delivery</option>
                    <option value="Mixed">Mixed Network</option>
                  </select>
                </div>
              </div>

              {/* Water conservation check toggles */}
              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                  <input
                    type="checkbox"
                    checked={rainwaterHarvesting}
                    onChange={(e) => setRainwaterHarvesting(e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-lime2"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block font-sans">Rooftop Rainwater Harvesting Filtration Cistern</span>
                    <span className="text-[11px] text-ink2/70 font-sans">Captures precipitation for groundwater recharge and gravity flushing.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                  <input
                    type="checkbox"
                    checked={waterFixtures}
                    onChange={(e) => setWaterFixtures(e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-lime2"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block font-sans">Water-Efficient Low-Flow Fixtures & Dual-Flush WCs</span>
                    <span className="text-[11px] text-ink2/70 font-sans">Pressure-compensating 3.5 LPM aerators cutting volume by 30-40%.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                  <input
                    type="checkbox"
                    checked={wasteRecycling}
                    onChange={(e) => setWasteRecycling(e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-lime2"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block font-sans">On-site Greywater Treatment & Closed Loop Recycling</span>
                    <span className="text-[11px] text-ink2/70 font-sans">Bioremediation wetland or MBBR system for flushing and landscape reuse.</span>
                  </div>
                </label>
              </div>

            </div>
          )}

          {/* STEP 4: Material Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-ink/5 pb-4">
                <span className="text-xs font-mono font-bold uppercase text-emeraldGreen">Step 04</span>
                <h3 className="text-xl font-bold text-ink font-sans">Structural Materials & Circularity</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Concrete Volume (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 320"
                    value={concreteM3}
                    onChange={(e) => setConcreteM3(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                  <span className="text-[10px] text-ink2/50 font-sans">Enter 0 to auto-estimate from area</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Structural Steel Rebar (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 25000"
                    value={steelKg}
                    onChange={(e) => setSteelKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                  <span className="text-[10px] text-ink2/50 font-sans">Enter 0 to auto-estimate from area</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Masonry Brick Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 35000"
                    value={brickCount}
                    onChange={(e) => setBrickCount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                  <span className="text-[10px] text-ink2/50 font-sans">Enter 0 to auto-estimate from area</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Recycled / Pozzolanic Content (% of total)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 35"
                    value={recycledPercentage}
                    onChange={(e) => setRecycledPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Locally Sourced Procurement (% within 400km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 60"
                    value={localPercentage}
                    onChange={(e) => setLocalPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                  Additional Construction Materials Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 40% GGBS slag in foundation, AAC block infill, bamboo sunshades..."
                  value={materialNotes}
                  onChange={(e) => setMaterialNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-paper border border-ink/10 text-sm text-ink focus:ring-2 focus:ring-lime2 focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* STEP 5: Cost Details */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-ink/5 pb-4">
                <span className="text-xs font-mono font-bold uppercase text-emeraldGreen">Step 05</span>
                <h3 className="text-xl font-bold text-ink font-sans">Financial Baseline & Lifecycle Budgets</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Estimated Construction Capital Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={constructionCost}
                    onChange={(e) => setConstructionCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Total Approved Project Budget ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Estimated Annual Electricity Utility Cost ($/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={energyCost}
                    onChange={(e) => setEnergyCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ink2/80 mb-1 font-semibold">
                    Estimated Annual Water Cost ($/yr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={waterCost}
                    onChange={(e) => setWaterCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink font-mono focus:ring-2 focus:ring-lime2 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-ink/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl bg-mist hover:bg-white text-ink text-xs font-mono font-semibold transition-colors flex items-center gap-2 border border-ink/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2.5 rounded-xl bg-ink text-paper hover:bg-forest text-xs font-mono font-semibold transition-all flex items-center gap-2 border border-lime/30 shadow-sm"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 text-lime" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSave(false)}
                  className="px-8 py-3 rounded-xl bg-forest hover:bg-ink text-paper text-xs font-mono font-bold uppercase tracking-wider transition-all border border-lime2 shadow-lg flex items-center gap-2"
                >
                  {submitting ? 'Executing AI Engine...' : 'Submit & Run Environmental Analysis'}
                  <CheckCircle2 className="w-4 h-4 text-lime" />
                </button>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
