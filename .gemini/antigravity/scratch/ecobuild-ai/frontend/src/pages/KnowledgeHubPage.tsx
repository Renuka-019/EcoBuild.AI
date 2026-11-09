import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Award,
  Zap,
  Droplets,
  CloudFog,
  Boxes,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export const KnowledgeHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'certifications' | 'glossary'>('concepts');
  const [glossarySearch, setGlossarySearch] = useState('');

  const fundamentals = [
    {
      title: "1. Embodied vs Operational Carbon",
      icon: CloudFog,
      color: "emerald",
      summary: "Understanding the dual life-cycle carbon footprint of buildings.",
      content: "Operational carbon covers emissions from daily heating, cooling, lighting, and plug loads (Scope 2 electricity). Embodied carbon represents greenhouse gases emitted during material extraction, manufacturing, transport, and on-site assembly (Scope 3). As grids decarbonize, embodied carbon will represent up to 70% of new construction carbon."
    },
    {
      title: "2. Energy Use Intensity (EUI)",
      icon: Zap,
      color: "amber",
      summary: "The universal benchmark metric for building thermodynamic performance.",
      content: "EUI is calculated by dividing total annual electricity consumption (kWh) by the gross built-up floor area (m²). Standard commercial office buildings typically operate around 140-180 kWh/m²/year; high-performance net-zero buildings operate below 65 kWh/m²/year."
    },
    {
      title: "3. Per-Capita Water Consumption (LPCD)",
      icon: Droplets,
      color: "sky",
      summary: "Litres Per Capita per Day standards for sustainable plumbing.",
      content: "WHO and the National Building Code (NBC) prescribe standard domestic demand of 135 LPCD for residential dwellings. By integrating 3.5 LPM aerated fixtures and dual-flush valves (3/6L), consumption can be slashed to 80-90 LPCD without comfort loss."
    },
    {
      title: "4. Concrete Clinker Substitution (GGBS / Fly Ash)",
      icon: Boxes,
      color: "teal",
      summary: "Reducing the carbon intensity of standard Portland cement.",
      content: "Producing 1 tonne of traditional Ordinary Portland Cement (OPC) clinker emits nearly 0.85 tonnes of CO2 due to calcium carbonate calcination. Substituting 35-45% of clinker with Ground Granulated Blast-Furnace Slag (GGBS) or Class F fly ash eliminates clinker emissions while improving long-term durability."
    }
  ];

  const certifications = [
    {
      acronym: "LEED v4.1",
      full: "Leadership in Energy and Environmental Design",
      issuing: "U.S. Green Building Council (USGBC)",
      levels: "Certified (40-49 pts), Silver (50-59 pts), Gold (60-79 pts), Platinum (80+ pts)",
      focus: "Holistic site selection, water efficiency, energy optimization, materials & resources, indoor environmental quality.",
      note: "EcoBuild AI estimates performance alignment but does not grant certified status."
    },
    {
      acronym: "IGBC Green Homes & New Buildings",
      full: "Indian Green Building Council",
      issuing: "Confederation of Indian Industry (CII)",
      levels: "Certified, Silver, Gold, Platinum, Super Platinum",
      focus: "Water harvesting, thermal comfort in tropical climates, local material sourcing within 400km, energy conservation building codes (ECBC).",
      note: "EcoBuild AI's water and regional sourcing factors directly reflect IGBC methodology."
    },
    {
      acronym: "GRIHA",
      full: "Green Rating for Integrated Habitat Assessment",
      issuing: "TERI & Ministry of New and Renewable Energy (MNRE)",
      levels: "1 to 5 Stars (based on points scored out of 100)",
      focus: "Native landscape preservation, passive solar architecture, solar water heating, low-toxicity materials.",
      note: "Widely adopted across public sector institutions and academic campuses."
    }
  ];

  const glossaryTerms = [
    { term: "EUI (Energy Use Intensity)", def: "Annual energy consumed divided by total floor area (kWh/m²/yr). The standard yardstick for energy efficiency." },
    { term: "LPCD (Litres Per Capita per Day)", def: "Unit measuring daily water consumption per occupant." },
    { term: "Embodied Carbon", def: "CO2e emissions resulting from the extraction, processing, transportation, and assembly of building materials." },
    { term: "Scope 2 Emissions", def: "Indirect GHG emissions associated with the purchase of grid electricity, heat, or cooling." },
    { term: "Bifacial Solar PV", def: "Photovoltaic panels that absorb solar radiation from both front and rear surfaces, boosting yield by 10-25%." },
    { term: "GGBS (Ground Granulated Blast-Furnace Slag)", def: "By-product of steel manufacturing used as a supplementary cementitious material to cut concrete clinker carbon." },
    { term: "Thermal Stack Effect", def: "Buoyancy-driven natural airflow where warm indoor air rises and exhausts through upper vents, drawing cooler air below." },
    { term: "Low-E Glazing", def: "Window glass coated with microscopic metallic layers that reflect infrared heat while admitting visible daylight." },
    { term: "Rainwater Harvesting Yield", def: "Calculated as: Roof Area (m²) × Annual Rainfall (mm) × Runoff Coefficient (0.85) × Filter Efficiency (0.80)." }
  ];

  const filteredGlossary = glossaryTerms.filter(g =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-paper text-ink py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            Educational Resources
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-ink font-sans tracking-tight">
            Education & Knowledge Hub
          </h1>
          <p className="text-base sm:text-lg text-ink2/80 font-sans leading-relaxed">
            Essential concepts, rating systems, and terminology for engineering students, architects, and construction practitioners.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-ink/10 flex gap-2 shadow-sm">
            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'concepts' ? 'bg-ink text-lime shadow-sm' : 'text-ink2/70 hover:text-ink'
              }`}
            >
              Core Concepts
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'certifications' ? 'bg-ink text-lime shadow-sm' : 'text-ink2/70 hover:text-ink'
              }`}
            >
              Rating Frameworks (LEED/IGBC/GRIHA)
            </button>
            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'glossary' ? 'bg-ink text-lime shadow-sm' : 'text-ink2/70 hover:text-ink'
              }`}
            >
              Interactive Glossary
            </button>
          </div>
        </div>

        {/* TAB 1: Core Concepts */}
        {activeTab === 'concepts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fundamentals.map((f, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-mist flex items-center justify-center text-ink border border-ink/10">
                    <f.icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink font-sans">{f.title}</h3>
                    <span className="text-xs font-mono text-emeraldGreen">{f.summary}</span>
                  </div>
                </div>
                <p className="text-xs text-ink2/80 leading-relaxed font-sans pt-2 border-t border-ink/5">
                  {f.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Certifications */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-sans">
              <strong>Educational Disclosure:</strong> EcoBuild AI provides simulation and estimation analytics aligned with these benchmarks. Official green certification requires formal registration and third-party audit through authorized certifying bodies (GBCI, CII-IGBC, or GRIHA Council).
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((c, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest bg-lime/20 px-2.5 py-1 rounded inline-block">
                      {c.acronym}
                    </span>
                    <h3 className="text-xl font-bold text-ink font-sans">{c.full}</h3>
                    <div className="text-xs font-mono text-ink2/60">Issuing Body: {c.issuing}</div>
                    <div className="pt-2 text-xs text-ink2/80 leading-relaxed font-sans">
                      <strong>Focus Areas:</strong> {c.focus}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-ink/5 space-y-2 text-xs font-mono">
                    <div className="text-ink2/70"><strong>Levels:</strong> {c.levels}</div>
                    <div className="text-[11px] text-ink2/50 font-sans italic">{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Glossary */}
        {activeTab === 'glossary' && (
          <div className="space-y-6">
            <div className="relative max-w-md mx-auto">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2/40" />
              <input
                type="text"
                placeholder="Search glossary terms (e.g., EUI, Slag, Embodied)..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-ink/10 focus:outline-none focus:ring-2 focus:ring-lime2 text-sm text-ink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGlossary.map((g, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-ink font-mono">{g.term}</h4>
                  <p className="text-xs text-ink2/80 leading-relaxed font-sans">{g.def}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
