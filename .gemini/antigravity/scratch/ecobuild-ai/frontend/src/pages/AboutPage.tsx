import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Target,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Globe2,
  LineChart,
  Lightbulb,
  Building
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const workflowSteps = [
    { title: "Building Data", desc: "Geometry, Occupancy, HVAC & Material Inputs", icon: Building },
    { title: "AI Analysis", desc: "Scientific thermodynamic & material simulation", icon: Cpu },
    { title: "Environmental Assessment", desc: "Energy EUI, Water LPCD & Embodied Carbon", icon: LineChart },
    { title: "Sustainable Recommendations", desc: "Personalized, prioritized green interventions", icon: Lightbulb },
    { title: "Better Design Decisions", desc: "Optimized lifecycle cost & certification readiness", icon: ShieldCheck }
  ];

  const technologies = [
    { name: "React 18 & TypeScript", role: "Type-safe, component-driven client architecture" },
    { name: "FastAPI & Python 3.14", role: "High-performance asynchronous REST backend" },
    { name: "SQLAlchemy & Relational DB", role: "Strict data integrity with audit history logs" },
    { name: "Scikit-Learn Machine Learning", role: "Baseline predictive regressions on building energy" },
    { name: "ReportLab Engine", role: "ISO-standard formatted PDF sustainability audit generation" },
    { name: "GHG Protocol & ICE v3.0", role: "Calibrated cradle-to-gate carbon emission factors" }
  ];

  return (
    <div className="min-h-screen bg-paper text-ink py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            About EcoBuild AI
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-ink font-sans tracking-tight">
            Engineering a Climate-Positive Built Environment
          </h1>
          <p className="text-base sm:text-lg text-ink2/80 font-sans leading-relaxed">
            EcoBuild AI exists to empower architects, structural engineers, builders, and students with transparent, deterministic environmental intelligence.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-ink/10 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-lime/20 text-forest border border-lime/40 flex items-center justify-center font-bold">
              <Target className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
              Our Mission
            </span>
            <h2 className="text-2xl font-extrabold text-ink font-sans">
              "To make sustainable construction decisions accessible, measurable, and intelligent through AI-powered environmental analysis."
            </h2>
            <p className="text-sm text-ink2/80 leading-relaxed font-sans">
              We eliminate complex manual spreadsheets and opaque estimates, providing instant, repeatable, scientific calculations for every building design.
            </p>
          </div>

          <div className="bg-forest text-paper rounded-3xl p-8 sm:p-10 border border-white/10 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-lime border border-white/20 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-lime block font-semibold">
              Our Vision
            </span>
            <h2 className="text-2xl font-extrabold text-paper font-sans">
              "To create a future where every building is designed with environmental responsibility."
            </h2>
            <p className="text-sm text-paper/80 leading-relaxed font-sans">
              A global construction ecosystem where low-carbon materials, clean renewable generation, and water resilience are standard design baselines, not expensive afterthoughts.
            </p>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-mist/60 rounded-3xl p-8 sm:p-12 border border-ink/10 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            The Industry Problem
          </span>
          <h2 className="text-3xl font-extrabold text-ink font-sans">
            The Urgent Need for Accessible Green Construction Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-sm text-ink2/80 leading-relaxed font-sans">
            <div className="p-6 bg-white rounded-2xl border border-ink/5 space-y-2">
              <h4 className="font-bold text-ink text-base">Massive Carbon Lock-In</h4>
              <p>
                Once concrete is poured and structural steel is erected, a building's embodied carbon footprint is locked in permanently for its 50+ year operational life.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-ink/5 space-y-2">
              <h4 className="font-bold text-ink text-base">Prohibitive Tooling Costs</h4>
              <p>
                Legacy building simulation software costs thousands of dollars in license fees and requires months of specialized training, locking out students and independent builders.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-ink/5 space-y-2">
              <h4 className="font-bold text-ink text-base">Fragmented Decision Data</h4>
              <p>
                Architects design for aesthetics, structural engineers for load-bearing strength, and MEP consultants for capacity, with no unified platform tracking environmental impact.
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Diagram */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              System Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-ink font-sans">
              The EcoBuild AI Decision Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm flex flex-col justify-between space-y-4 relative group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center text-ink group-hover:bg-lime/30 group-hover:text-forest transition-colors">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-ink2/40">0{idx + 1}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-ink mb-1 font-sans">{step.title}</h4>
                  <p className="text-xs text-ink2/70 leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Behind EcoBuild AI */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-ink/10 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Under the Hood
            </span>
            <h2 className="text-3xl font-extrabold text-ink font-sans mt-1">
              Technology Stack & Scientific Foundations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((t, i) => (
              <div key={i} className="p-5 rounded-2xl bg-paper border border-ink/5 space-y-1.5">
                <span className="text-sm font-bold text-ink font-mono block">{t.name}</span>
                <span className="text-xs text-ink2/70 font-sans block">{t.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-ink text-paper hover:bg-forest font-semibold text-base shadow-lg hover:shadow-glow-lime transition-all border border-lime/30"
          >
            Start Analyzing Your Building
            <ArrowRight className="w-5 h-5 text-lime" />
          </Link>
        </div>

      </div>
    </div>
  );
};
