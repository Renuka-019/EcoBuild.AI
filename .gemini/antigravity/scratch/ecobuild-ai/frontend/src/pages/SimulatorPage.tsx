import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  Sliders,
  Zap,
  Droplets,
  CloudFog,
  Save,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Boxes
} from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);

  // Simulation Sliders / Toggles
  const [solarKw, setSolarKw] = useState<number>(30);
  const [recycledPct, setRecycledPct] = useState<number>(40);
  const [naturalVentilation, setNaturalVentilation] = useState<boolean>(false);
  const [rainwaterHarvesting, setRainwaterHarvesting] = useState<boolean>(true);
  const [waterFixtures, setWaterFixtures] = useState<boolean>(true);
  const [lowCarbonConcrete, setLowCarbonConcrete] = useState<boolean>(true);
  const [efficientLighting, setEfficientLighting] = useState<boolean>(true);

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  const [savingDesign, setSavingDesign] = useState(false);
  const [newDesignName, setNewDesignName] = useState('');

  useEffect(() => {
    api.getBuildings().then((bList) => {
      setBuildings(bList);
      const urlId = searchParams.get('building_id');
      if (urlId) {
        setSelectedBuildingId(Number(urlId));
      } else if (bList.length > 0) {
        setSelectedBuildingId(bList[0].id);
      }
    });
  }, [searchParams]);

  const runSimulation = async () => {
    if (!selectedBuildingId) return;
    try {
      setSimulating(true);
      const res = await api.runSimulation({
        building_id: selectedBuildingId,
        solar_capacity_kw: solarKw,
        recycled_percentage: recycledPct,
        natural_ventilation: naturalVentilation,
        rainwater_harvesting: rainwaterHarvesting,
        water_efficient_fixtures: waterFixtures,
        low_carbon_concrete: lowCarbonConcrete,
        energy_efficient_lighting: efficientLighting
      });
      setSimulationResult(res);
      const baseBuilding = buildings.find(b => b.id === selectedBuildingId);
      if (baseBuilding && !newDesignName) {
        setNewDesignName(`${baseBuilding.project_name} (Optimized Scenario)`);
      }
    } catch (err: any) {
      console.error('Simulation error', err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    if (selectedBuildingId) {
      runSimulation();
    }
  }, [
    selectedBuildingId,
    solarKw,
    recycledPct,
    naturalVentilation,
    rainwaterHarvesting,
    waterFixtures,
    lowCarbonConcrete,
    efficientLighting
  ]);

  const handleSaveAsDesign = async () => {
    if (!selectedBuildingId || !newDesignName.trim()) {
      alert('Please enter a name for the new optimized building design');
      return;
    }
    try {
      setSavingDesign(true);
      const res = await api.saveSimulationAsDesign({
        building_id: selectedBuildingId,
        new_project_name: newDesignName,
        simulation_params: {
          solar_capacity_kw: solarKw,
          recycled_percentage: recycledPct,
          natural_ventilation: naturalVentilation,
          rainwater_harvesting: rainwaterHarvesting,
          water_efficient_fixtures: waterFixtures,
          low_carbon_concrete: lowCarbonConcrete,
          energy_efficient_lighting: efficientLighting
        }
      });
      alert(`Design "${res.project_name}" saved with Sustainability Score: ${res.score}/100!`);
      navigate('/buildings');
    } catch (err: any) {
      alert(err.message || 'Failed to save design');
    } finally {
      setSavingDesign(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Interactive What-If Modeling
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Green Design Simulator
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Simulate dynamic parameter upgrades in real time and export the optimized scenario directly into a new project design.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-ink2/60 mr-1">Base Building:</label>
            <select
              value={selectedBuildingId || ''}
              onChange={(e) => setSelectedBuildingId(Number(e.target.value))}
              className="px-3.5 py-2 rounded-xl bg-white border border-ink/10 text-xs font-mono font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-lime2"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.project_name} ({b.building_type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulator Controls & Real-Time Impact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Parametric Sliders (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6">
            <div className="border-b border-ink/5 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                Upgrade Levers
              </span>
              <h3 className="text-lg font-bold text-ink font-sans">
                Active Simulation Inputs
              </h3>
            </div>

            {/* Slider 1: Solar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ink2/80 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Rooftop Solar PV Capacity:
                </span>
                <span className="text-forest font-extrabold text-sm">{solarKw} kWp</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={solarKw}
                onChange={(e) => setSolarKw(Number(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink2/50 font-sans block">
                Off-grid clean electricity generation eliminating Scope 2 grid draw.
              </span>
            </div>

            {/* Slider 2: Recycled Materials */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ink2/80 font-bold flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-forest" />
                  Recycled Materials Ratio:
                </span>
                <span className="text-forest font-extrabold text-sm">{recycledPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={recycledPct}
                onChange={(e) => setRecycledPct(Number(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink2/50 font-sans block">
                Aggregate circularity and electric arc furnace recycled steel scrap.
              </span>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-3 border-t border-ink/5 text-xs font-sans">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                <input
                  type="checkbox"
                  checked={lowCarbonConcrete}
                  onChange={(e) => setLowCarbonConcrete(e.target.checked)}
                  className="rounded text-forest focus:ring-lime2"
                />
                <span className="text-xs text-ink font-semibold">Low-Carbon GGBS Pozzolanic Concrete</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                <input
                  type="checkbox"
                  checked={rainwaterHarvesting}
                  onChange={(e) => setRainwaterHarvesting(e.target.checked)}
                  className="rounded text-forest focus:ring-lime2"
                />
                <span className="text-xs text-ink font-semibold">Dual-Cistern Rooftop Rainwater Harvesting</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                <input
                  type="checkbox"
                  checked={waterFixtures}
                  onChange={(e) => setWaterFixtures(e.target.checked)}
                  className="rounded text-forest focus:ring-lime2"
                />
                <span className="text-xs text-ink font-semibold">Water-Efficient 3.5 LPM Fixtures & Aerators</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                <input
                  type="checkbox"
                  checked={naturalVentilation}
                  onChange={(e) => setNaturalVentilation(e.target.checked)}
                  className="rounded text-forest focus:ring-lime2"
                />
                <span className="text-xs text-ink font-semibold">Passive Stack Natural Cross-Ventilation</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-paper border border-ink/5 cursor-pointer hover:border-lime2">
                <input
                  type="checkbox"
                  checked={efficientLighting}
                  onChange={(e) => setEfficientLighting(e.target.checked)}
                  className="rounded text-forest focus:ring-lime2"
                />
                <span className="text-xs text-ink font-semibold">Smart Solid-State LED Luminaires</span>
              </label>
            </div>

          </div>

          {/* Right Column: Live Before vs After Delta Board (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {simulationResult ? (
              <>
                {/* Score Delta Highlight Card */}
                <div className="bg-forest text-paper rounded-3xl p-8 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-mono uppercase tracking-widest text-lime font-bold">
                      Impact Delta Preview
                    </span>
                    <h3 className="text-3xl font-extrabold text-paper font-sans">
                      Sustainability Score: {simulationResult.simulated.score}/100
                    </h3>
                    <p className="text-xs text-paper/75 font-sans">
                      Improves classification from <strong>{simulationResult.original.classification}</strong> to <strong className="text-lime">{simulationResult.simulated.classification}</strong>.
                    </p>
                  </div>

                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-3xl font-extrabold font-mono text-lime block">
                      +{simulationResult.deltas.score_delta} pts
                    </span>
                    <span className="text-[11px] font-mono text-paper/70 uppercase">
                      ({simulationResult.deltas.percent_score_improvement}% Boost)
                    </span>
                  </div>
                </div>

                {/* 4 Quantitative Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Energy Delta */}
                  <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-ink">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <h4 className="font-bold text-sm font-sans">Annual Electricity</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-ink2/50 block text-[10px]">ORIGINAL</span>
                        <span className="text-ink font-semibold">{Math.round(simulationResult.original.annual_energy_kwh).toLocaleString()} kWh</span>
                      </div>
                      <div>
                        <span className="text-emeraldGreen block text-[10px]">SIMULATED</span>
                        <span className="text-emeraldGreen font-bold">{Math.round(simulationResult.simulated.annual_energy_kwh).toLocaleString()} kWh</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-emeraldGreen pt-2 border-t border-ink/5">
                      Saves: <strong>{Math.round(simulationResult.deltas.energy_saved_kwh).toLocaleString()} kWh/yr</strong>
                    </div>
                  </div>

                  {/* Water Delta */}
                  <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-ink">
                      <Droplets className="w-5 h-5 text-sky-600" />
                      <h4 className="font-bold text-sm font-sans">Annual Water Demand</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-ink2/50 block text-[10px]">ORIGINAL</span>
                        <span className="text-ink font-semibold">{Math.round(simulationResult.original.annual_water_litres).toLocaleString()} L</span>
                      </div>
                      <div>
                        <span className="text-emeraldGreen block text-[10px]">SIMULATED</span>
                        <span className="text-emeraldGreen font-bold">{Math.round(simulationResult.simulated.annual_water_litres).toLocaleString()} L</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-emeraldGreen pt-2 border-t border-ink/5">
                      Saves: <strong>{Math.round(simulationResult.deltas.water_saved_litres).toLocaleString()} L/yr</strong>
                    </div>
                  </div>

                  {/* Carbon Delta */}
                  <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-ink">
                      <CloudFog className="w-5 h-5 text-emeraldGreen" />
                      <h4 className="font-bold text-sm font-sans">Total Carbon Footprint</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-ink2/50 block text-[10px]">ORIGINAL</span>
                        <span className="text-ink font-semibold">{simulationResult.original.total_carbon_tons} tCO2e</span>
                      </div>
                      <div>
                        <span className="text-emeraldGreen block text-[10px]">SIMULATED</span>
                        <span className="text-emeraldGreen font-bold">{simulationResult.simulated.total_carbon_tons} tCO2e</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-emeraldGreen pt-2 border-t border-ink/5">
                      Reduces: <strong>{simulationResult.deltas.carbon_reduced_tons} tCO2e</strong>
                    </div>
                  </div>

                  {/* Carbon Intensity Delta */}
                  <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-ink">
                      <TrendingUp className="w-5 h-5 text-forest" />
                      <h4 className="font-bold text-sm font-sans">Carbon Intensity</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-ink2/50 block text-[10px]">ORIGINAL</span>
                        <span className="text-ink font-semibold">{simulationResult.original.carbon_intensity_kg_m2} kg/m²</span>
                      </div>
                      <div>
                        <span className="text-emeraldGreen block text-[10px]">SIMULATED</span>
                        <span className="text-emeraldGreen font-bold">{simulationResult.simulated.carbon_intensity_kg_m2} kg/m²</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-emeraldGreen pt-2 border-t border-ink/5">
                      Reduced to <strong>{simulationResult.simulated.carbon_intensity_kg_m2} kg/m²</strong>
                    </div>
                  </div>

                </div>

                {/* Save Scenario Box */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
                  <h4 className="font-bold text-base text-ink font-sans">
                    Save This Scenario as a New Building Design
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="New design title..."
                      value={newDesignName}
                      onChange={(e) => setNewDesignName(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-paper border border-ink/10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-lime2"
                    />
                    <button
                      type="button"
                      disabled={savingDesign}
                      onClick={handleSaveAsDesign}
                      className="px-6 py-2.5 rounded-xl bg-ink text-paper hover:bg-forest text-xs font-mono font-bold uppercase tracking-wider transition-all border border-lime/30 flex items-center justify-center gap-2 shrink-0"
                    >
                      <Save className="w-4 h-4 text-lime" />
                      {savingDesign ? 'Saving...' : 'Save As Design'}
                    </button>
                  </div>
                </div>

              </>
            ) : (
              <div className="py-24 text-center">
                <p className="text-xs font-mono text-ink2/60">Select a building design to launch simulation.</p>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
};
