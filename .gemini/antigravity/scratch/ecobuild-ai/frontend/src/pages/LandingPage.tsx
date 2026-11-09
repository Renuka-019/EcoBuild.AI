import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Droplets,
  CloudFog,
  Boxes,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  BarChart4
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeStoryStage, setActiveStoryStage] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const storyStages = [
    {
      title: "01. Architecture Meets Climate Intelligence",
      subtitle: "The Living Building in a Misty Ecosystem",
      desc: "Modern construction accounts for nearly 40% of global greenhouse emissions. EcoBuild AI unifies parametric building models with real-time carbon, water, and thermodynamic intelligence.",
      tag: "PRECISION MODELING"
    },
    {
      title: "02. Solar Harvesting & Passive Envelopes",
      subtitle: "Dynamic Roof Aerodynamics & Photovoltaics",
      desc: "Simulate rooftop solar yield, thermal stack ventilation, and daylight illumination before concrete is poured, turning passive structures into positive-energy powerhouses.",
      tag: "ENERGY RESILIENCE"
    },
    {
      title: "03. Closed-Loop Water Circularity",
      subtitle: "Rainwater Harvesting & Bioremediation",
      desc: "Transform rooftops into active storm runoff sponge surfaces. Calculate rainwater cistern retention capacities and on-site greywater phytoremediation with exact litre metrics.",
      tag: "WATER CONSERVATION"
    },
    {
      title: "04. Cradle-to-Gate Embodied Carbon",
      subtitle: "Low-Carbon Pozzolans & Recycled Steel",
      desc: "Track the invisible carbon hidden in structural cement, rebar, and clay masonry with verified Bath ICE v3.0 emission factors. Cut up to 35% of embodied emissions upfront.",
      tag: "CIRCULAR MATERIALS"
    },
    {
      title: "05. Deterministic AI Optimization",
      subtitle: "Explainable 0-100 Sustainability Scoring",
      desc: "Receive actionable, prioritized engineering recommendations tailored to your local climate zone and building typology, verified against ASHRAE and IGBC benchmarks.",
      tag: "DECISION INTELLIGENCE"
    }
  ];

  const hotspots = [
    {
      id: 1,
      x: '24%',
      y: '32%',
      title: 'Solar PV Canopy',
      detail: 'Monocrystalline array generating up to 1,450 kWh/kWp/year, eliminating 70% of base electrical loads.',
      icon: Sun
    },
    {
      id: 2,
      x: '72%',
      y: '28%',
      title: 'Thermal Chimney & Stack Ventilation',
      detail: 'Natural buoyancy chimney drawing cooler breezes across building floors, reducing air conditioning run hours.',
      icon: Zap
    },
    {
      id: 3,
      x: '38%',
      y: '68%',
      title: 'Dual-Cistern Rainwater Sump',
      detail: 'Integrated first-flush filtration retaining 85% of annual precipitation for flushing and landscape irrigation.',
      icon: Droplets
    },
    {
      id: 4,
      x: '65%',
      y: '65%',
      title: 'Low-Carbon GGBS Structural Concrete',
      detail: '40% industrial slag replacement cutting clinker emissions by 35% with enhanced compressive strength.',
      icon: Boxes
    }
  ];

  return (
    <div className="relative min-h-screen bg-paper text-ink overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Atmospheric misty backdrop */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 pointer-events-none">
          <div className="w-[800px] h-[500px] bg-gradient-to-tr from-lime/20 via-mist to-transparent rounded-full blur-3xl transform -rotate-12" />
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Chip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-paper border border-lime/40 text-xs font-mono uppercase tracking-widest shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime" />
            AI-Powered Sustainability Intelligence
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-ink font-sans leading-[1.08]"
          >
            Build Smarter. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest via-ink2 to-emeraldGreen">
              Build Greener.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-ink2/80 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Transform building designs into measurable sustainability insights with AI-powered environmental intelligence. Calculate energy, water, carbon, and materials in minutes.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/buildings/new"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-ink text-paper hover:bg-forest font-semibold text-base shadow-lg hover:shadow-glow-lime transition-all border border-lime/30 flex items-center justify-center gap-3 group"
            >
              Analyze Your Building
              <ArrowRight className="w-5 h-5 text-lime transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/solutions"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-mist/80 text-ink font-semibold text-base border border-ink/10 transition-all flex items-center justify-center gap-2"
            >
              Explore Solutions Library
            </Link>
          </motion.div>
        </div>

        {/* Cinematic Isometric Building Visual Showcase with Interactive Hotspots */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 relative rounded-3xl overflow-hidden border border-ink/10 shadow-2xl bg-gradient-to-b from-[#E7EBE8] to-[#D5DCD7] p-4 sm:p-8"
        >
          <div className="relative rounded-2xl overflow-hidden bg-forest text-paper min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-10 border border-white/10">
            
            {/* Background Graphic Illustration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-forest to-forestDark opacity-90" />
            
            {/* Architectural Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Top Bar with Real Metrics Pill */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-lime">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                ACTIVE PARAMETRIC TWIN • MODEL ARCH-2026
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-paper/70">Estimated Score:</span>
                <span className="px-2.5 py-1 rounded-lg bg-lime text-ink font-bold font-mono">88.5 Gold</span>
              </div>
            </div>

            {/* Center Interactive Hotspots Layer */}
            <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-2xl h-64 border border-dashed border-lime/30 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-sm">
                
                <div className="text-center p-6 space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-lime/20 border border-lime/50 mx-auto flex items-center justify-center text-lime mb-3 shadow-glow-lime">
                    <Cpu className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h3 className="text-xl font-bold font-sans text-paper">
                    Integrated Bioclimatic Architectural Model
                  </h3>
                  <p className="text-xs text-paper/70 font-mono max-w-md mx-auto">
                    Click the floating sensor pins below to inspect live environmental nodes.
                  </p>
                </div>

                {/* Hotspot Pins */}
                {hotspots.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                    style={{ left: h.x, top: h.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-lime opacity-75" />
                      <span className="relative inline-flex rounded-full h-8 w-8 bg-lime text-ink font-mono font-bold text-xs items-center justify-center shadow-lg border-2 border-forest">
                        {h.id}
                      </span>
                    </div>

                    {/* Popover */}
                    {activeHotspot === h.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-4 rounded-xl bg-ink/95 border border-lime/40 text-left shadow-2xl backdrop-blur-lg z-30"
                      >
                        <div className="flex items-center gap-2 text-lime font-mono text-xs font-semibold mb-1">
                          <h.icon className="w-4 h-4" />
                          {h.title}
                        </div>
                        <p className="text-[11px] text-paper/80 font-sans leading-relaxed">
                          {h.detail}
                        </p>
                      </motion.div>
                    )}
                  </button>
                ))}

              </div>
            </div>

            {/* Bottom Bar: 4 Live Sensor Readouts */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-paper/50 block text-[10px]">EUI ENERGY INTENSITY</span>
                <span className="text-lime text-base font-bold">78 kWh/m²/yr</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-paper/50 block text-[10px]">WATER PER CAPITA</span>
                <span className="text-lime text-base font-bold">82 Litres/day</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-paper/50 block text-[10px]">OPERATIONAL CO2e</span>
                <span className="text-lime text-base font-bold">54.2 tCO2e/yr</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-paper/50 block text-[10px]">RECYCLED MATERIALS</span>
                <span className="text-lime text-base font-bold">42% Circular</span>
              </div>
            </div>

          </div>
        </motion.div>

      </section>

      {/* CINEMATIC 5-STAGE STORYTELLING SECTION */}
      <section className="py-24 bg-mist/60 border-y border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              The EcoBuild AI Methodology
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-ink font-sans tracking-tight">
              Cinematic Environmental Scroll Story
            </h2>
            <p className="text-sm sm:text-base text-ink2/80 font-sans">
              Explore the five integrated stages transforming raw architectural geometry into climate-positive assets.
            </p>
          </div>

          {/* Interactive Stage Selector Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 justify-start sm:justify-center no-scrollbar">
            {storyStages.map((stage, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStoryStage(idx)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all whitespace-nowrap shrink-0 border ${
                  activeStoryStage === idx
                    ? 'bg-ink text-lime border-lime font-bold shadow-md'
                    : 'bg-white text-ink2/70 border-ink/10 hover:border-ink/30'
                }`}
              >
                {stage.tag}
              </button>
            ))}
          </div>

          {/* Selected Stage Detail Display */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-ink/10 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-mono text-9xl font-extrabold text-ink pointer-events-none">
              0{activeStoryStage + 1}
            </div>

            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-lime2 bg-ink px-3 py-1 rounded-md inline-block">
                Stage 0{activeStoryStage + 1}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-ink font-sans">
                {storyStages[activeStoryStage].title}
              </h3>
              <h4 className="text-lg font-semibold text-emeraldGreen font-sans">
                {storyStages[activeStoryStage].subtitle}
              </h4>
              <p className="text-base text-ink2/80 leading-relaxed font-sans">
                {storyStages[activeStoryStage].desc}
              </p>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-emeraldGreen transition-colors group"
                >
                  Learn full engineering methodology
                  <ChevronRight className="w-4 h-4 text-emeraldGreen group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ENVIRONMENTAL IMPACT SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            Environmental Impact
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-ink font-sans tracking-tight">
            Every Building Leaves a Footprint. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emeraldGreen">
              Make Yours Lighter.
            </span>
          </h2>
          <p className="text-base text-ink2/80 font-sans">
            EcoBuild AI evaluates building performance across four critical ecological dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Energy */}
          <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm hover:shadow-lg transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-ink font-sans">Energy Consumption</h3>
            <p className="text-xs text-ink2/70 leading-relaxed font-sans">
              Calculates Energy Use Intensity (EUI), classifies against ASHRAE 90.1 standards, and models rooftop solar offset potential.
            </p>
            <div className="pt-2 text-[11px] font-mono text-ink2/60 border-t border-ink/5 flex justify-between">
              <span>Metric:</span>
              <span className="font-semibold text-ink">kWh / m² / year</span>
            </div>
          </div>

          {/* Card 2: Water */}
          <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm hover:shadow-lg transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200 group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-ink font-sans">Water Consumption</h3>
            <p className="text-xs text-ink2/70 leading-relaxed font-sans">
              Measures litres per occupant daily (LPCD), simulates rooftop rainwater harvesting yields, and quantifies greywater reuse savings.
            </p>
            <div className="pt-2 text-[11px] font-mono text-ink2/60 border-t border-ink/5 flex justify-between">
              <span>Metric:</span>
              <span className="font-semibold text-ink">Litres / person / day</span>
            </div>
          </div>

          {/* Card 3: Carbon */}
          <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm hover:shadow-lg transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
              <CloudFog className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-ink font-sans">Carbon Footprint</h3>
            <p className="text-xs text-ink2/70 leading-relaxed font-sans">
              Separates Scope 2 operational emissions from cradle-to-gate embodied carbon over a 50-year structural life horizon.
            </p>
            <div className="pt-2 text-[11px] font-mono text-ink2/60 border-t border-ink/5 flex justify-between">
              <span>Metric:</span>
              <span className="font-semibold text-ink">kg CO2e / m²</span>
            </div>
          </div>

          {/* Card 4: Materials */}
          <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm hover:shadow-lg transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200 group-hover:scale-105 transition-transform">
              <Boxes className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-ink font-sans">Material Circularity</h3>
            <p className="text-xs text-ink2/70 leading-relaxed font-sans">
              Evaluates concrete cement substitution (GGBS/Fly Ash), recycled steel scrap utilization, and regional supply chain radius.
            </p>
            <div className="pt-2 text-[11px] font-mono text-ink2/60 border-t border-ink/5 flex justify-between">
              <span>Metric:</span>
              <span className="font-semibold text-ink">% Recycled & Local</span>
            </div>
          </div>

        </div>

      </section>

      {/* SOLUTIONS PREVIEW CARDS */}
      <section className="py-24 bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-lime font-semibold">
                Sustainable Interventions
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-paper font-sans tracking-tight">
                Architectural Solutions Designed for High Return
              </h2>
            </div>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-lime font-mono text-xs font-semibold border border-lime/30 transition-all"
            >
              View Full 20+ Solution Library
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Solution Card 1 */}
            <div className="bg-forest rounded-3xl p-8 border border-white/10 flex flex-col justify-between space-y-6 hover:border-lime/40 transition-all group">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-lime px-2.5 py-1 rounded bg-white/10 inline-block font-semibold">
                  Renewables & Passive
                </span>
                <h3 className="text-2xl font-bold text-paper font-sans">
                  Solar Energy & Natural Ventilation
                </h3>
                <p className="text-xs text-paper/75 leading-relaxed font-sans">
                  Deploy elevated bifacial rooftop arrays paired with solar chimney shafts for cross-ventilation, reducing cooling bills by up to 45%.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-lime">
                <span>Payback: 3.5 - 5 Years</span>
                <span className="font-bold">Save 25-45%</span>
              </div>
            </div>

            {/* Solution Card 2 */}
            <div className="bg-forest rounded-3xl p-8 border border-white/10 flex flex-col justify-between space-y-6 hover:border-lime/40 transition-all group">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-lime px-2.5 py-1 rounded bg-white/10 inline-block font-semibold">
                  Water Management
                </span>
                <h3 className="text-2xl font-bold text-paper font-sans">
                  Rainwater Harvesting & Dual Sump Cisterns
                </h3>
                <p className="text-xs text-paper/75 leading-relaxed font-sans">
                  Engineered rooftop catchment sumps with multi-media filtration and smart aerators, capturing up to 85% of annual rainfall for domestic non-potable reuse.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-lime">
                <span>Payback: 2 - 4 Years</span>
                <span className="font-bold">Save 30-40%</span>
              </div>
            </div>

            {/* Solution Card 3 */}
            <div className="bg-forest rounded-3xl p-8 border border-white/10 flex flex-col justify-between space-y-6 hover:border-lime/40 transition-all group">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-lime px-2.5 py-1 rounded bg-white/10 inline-block font-semibold">
                  Low-Carbon Materials
                </span>
                <h3 className="text-2xl font-bold text-paper font-sans">
                  Recycled Pozzolanic Concrete & EAF Steel
                </h3>
                <p className="text-xs text-paper/75 leading-relaxed font-sans">
                  Specifying 40% GGBS slag replacement and electric arc furnace recycled steel cuts embodied structure carbon by 35% without premium cost.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-lime">
                <span>Capital Cost: Neutral</span>
                <span className="font-bold">-35% Embodied CO2</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PLATFORM SAMPLE IMPACT METRICS */}
      <section className="py-20 border-b border-ink/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Platform Benchmark Data
            </span>
            <h3 className="text-2xl font-bold text-ink font-sans mt-1">
              Measurable Sustainable Impact Potential
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-paper border border-ink/5">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-ink block">
                1,420+
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/70 mt-2 block">
                Buildings Modeled
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-ink/5">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-emeraldGreen block">
                4.2M
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/70 mt-2 block">
                kWh Energy Saved
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-ink/5">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-sky-700 block">
                18.5M
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/70 mt-2 block">
                Litres Water Harvested
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-paper border border-ink/5">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-forest block">
                3,890
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/70 mt-2 block">
                Tonnes CO2e Avoided
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-lime/20 border border-lime2 text-xs font-mono font-bold text-forest uppercase tracking-wider">
            Start Right Now
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-ink font-sans tracking-tight">
            "Your Next Building Can Be a Better One."
          </h2>
          <p className="text-lg text-ink2/80 max-w-xl mx-auto font-sans leading-relaxed">
            Run a verified environmental analysis in less than 3 minutes. Free for students, architects, and builders.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-ink text-paper hover:bg-forest font-semibold text-base shadow-xl hover:shadow-glow-lime transition-all border border-lime/30 flex items-center justify-center gap-3"
          >
            Start Your Sustainability Analysis
            <ArrowRight className="w-5 h-5 text-lime" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-mist text-ink font-semibold text-base border border-ink/10 transition-colors"
          >
            Try Demo Account
          </Link>
        </div>
      </section>

    </div>
  );
};
