import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileEdit,
  Cpu,
  Calculator,
  Lightbulb,
  Split,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Zap,
  Droplets,
  Boxes
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [calcArea, setCalcArea] = useState<number>(2500);
  const [calcKwh, setCalcKwh] = useState<number>(220000);
  const [calcOccupants, setCalcOccupants] = useState<number>(45);

  const sampleEui = Math.round(calcKwh / Math.max(calcArea, 1));
  const sampleWaterDaily = Math.round(calcOccupants * 110);
  const sampleOperationalCarbon = Math.round((calcKwh * 0.716) / 1000);

  const steps = [
    {
      step: "01",
      title: "Enter Building Information",
      subtitle: "Multi-parameter bioclimatic input form",
      desc: "Provide basic architectural parameters: built-up area (m²), number of floors, occupancy count, planned year, HVAC cooling systems, lighting types, and primary structural materials (concrete m³, steel kg, brick count). Incomplete drafts are automatically saved.",
      icon: FileEdit
    },
    {
      step: "02",
      title: "Analyze Energy, Water and Materials",
      subtitle: "High-precision empirical ingestion pipeline",
      desc: "The ingestion engine normalizes your inputs against regional climate zones and building typology standards (Residential, Commercial, Healthcare, Educational). If exact electricity or water bills are not yet known, the machine learning baseline estimator computes statistically calibrated initial targets.",
      icon: Cpu
    },
    {
      step: "03",
      title: "Calculate Environmental Impact",
      subtitle: "Deterministic GHG Protocol & ICE v3.0 mathematical formulations",
      desc: "Executes deterministic equations for Energy Use Intensity (EUI), per-capita water demand (LPCD), rooftop rainwater harvest potential, Scope 2 operational emissions, and 50-year cradle-to-gate embodied carbon.",
      icon: Calculator
    },
    {
      step: "04",
      title: "Receive AI Recommendations",
      subtitle: "Personalized, impact-weighted remediation measures",
      desc: "Based on empirical deviations from ASHRAE 90.1 and IGBC benchmarks, the recommendation engine delivers targeted interventions (Rooftop Solar PV, VRF HVAC, Rainwater Filtration, GGBS Low-Carbon Concrete) with exact expected kWh, water, and dollar savings.",
      icon: Lightbulb
    },
    {
      step: "05",
      title: "Compare and Optimize Building Designs",
      subtitle: "Multi-design trade-off analysis & What-if simulation",
      desc: "Compare multiple architectural iterations side-by-side across Cost, Carbon, Energy, Water, and Sustainability Score. Use interactive sliders in the Green Design Simulator to dynamically test upgrades and save optimized variants as new designs.",
      icon: Split
    }
  ];

  return (
    <div className="min-h-screen bg-paper text-ink py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            Operational Methodology
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-ink font-sans tracking-tight">
            How EcoBuild AI Works
          </h1>
          <p className="text-base sm:text-lg text-ink2/80 font-sans leading-relaxed">
            A 5-step scientific pipeline bridging architectural design, environmental physics, and explainable artificial intelligence.
          </p>
        </div>

        {/* 5-Step Process */}
        <div className="space-y-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-ink/10 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-4xl sm:text-5xl font-mono font-extrabold text-forest">
                  {s.step}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-mist flex items-center justify-center text-ink border border-ink/10">
                  <s.icon className="w-7 h-7 stroke-[1.8]" />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-xs font-mono uppercase tracking-wider text-emeraldGreen font-semibold block">
                  {s.subtitle}
                </span>
                <h3 className="text-2xl font-bold text-ink font-sans">
                  {s.title}
                </h3>
                <p className="text-sm text-ink2/80 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Example Calculation Sandbox */}
        <div className="bg-forest text-paper rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-lime font-semibold">
              Live Interactive Calculator
            </span>
            <h2 className="text-3xl font-extrabold text-paper font-sans mt-1">
              Sample Environmental Formulas
            </h2>
            <p className="text-xs sm:text-sm text-paper/75 font-sans mt-1">
              Adjust the sample building parameters below to see how EcoBuild AI calculates real-time intensity metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-paper/70 flex justify-between">
                <span>Built-Up Area (m²):</span>
                <span className="text-lime font-bold">{calcArea.toLocaleString()} m²</span>
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={calcArea}
                onChange={(e) => setCalcArea(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-paper/70 flex justify-between">
                <span>Annual Electricity (kWh):</span>
                <span className="text-lime font-bold">{calcKwh.toLocaleString()} kWh</span>
              </label>
              <input
                type="range"
                min="30000"
                max="800000"
                step="10000"
                value={calcKwh}
                onChange={(e) => setCalcKwh(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-paper/70 flex justify-between">
                <span>Occupants (People):</span>
                <span className="text-lime font-bold">{calcOccupants} people</span>
              </label>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={calcOccupants}
                onChange={(e) => setCalcOccupants(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time calculated formula cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10 font-mono">
            <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] text-paper/60 uppercase block">ENERGY USE INTENSITY (EUI)</span>
              <div className="text-2xl font-bold text-lime">{sampleEui} <span className="text-xs text-paper/70">kWh/m²/yr</span></div>
              <span className="text-[10px] text-paper/50 block">Formula: kWh ÷ Built-up Area</span>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] text-paper/60 uppercase block">OPERATIONAL SCOPE 2 CARBON</span>
              <div className="text-2xl font-bold text-lime">{sampleOperationalCarbon} <span className="text-xs text-paper/70">tCO2e/yr</span></div>
              <span className="text-[10px] text-paper/50 block">Formula: kWh × 0.716 kg/kWh ÷ 1000</span>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
              <span className="text-[10px] text-paper/60 uppercase block">ESTIMATED WATER INTAKE</span>
              <div className="text-2xl font-bold text-lime">{sampleWaterDaily.toLocaleString()} <span className="text-xs text-paper/70">L/day</span></div>
              <span className="text-[10px] text-paper/50 block">Formula: Occupants × 110 LPCD</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/buildings/new"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-ink text-paper hover:bg-forest font-semibold text-base shadow-lg hover:shadow-glow-lime transition-all border border-lime/30"
          >
            Input Your Building Design
            <ArrowRight className="w-5 h-5 text-lime" />
          </Link>
        </div>

      </div>
    </div>
  );
};
