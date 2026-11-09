import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUpRight, Shield, Award, BookOpen, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-paper border-t border-line/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest text-lime flex items-center justify-center border border-lime/30">
                <Leaf className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-paper font-sans">
                EcoBuild<span className="text-lime">.ai</span>
              </span>
            </div>
            <p className="text-sm text-paper/70 leading-relaxed max-w-sm">
              AI-powered sustainable construction intelligence platform. Analyze carbon footprints, optimize energy & water efficiency, and transform building designs into verified environmental champions.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-lime">
                <Shield className="w-3.5 h-3.5" />
                ISO 14040 • GHG Scope 1-3 • ASHRAE 90.1
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-lime mb-4 font-semibold">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-paper/70">
              <li><Link to="/dashboard" className="hover:text-paper transition-colors">Analytics Dashboard</Link></li>
              <li><Link to="/buildings/new" className="hover:text-paper transition-colors">Analyze Building</Link></li>
              <li><Link to="/compare" className="hover:text-paper transition-colors">Design Comparison</Link></li>
              <li><Link to="/simulator" className="hover:text-paper transition-colors">Green Simulator</Link></li>
              <li><Link to="/cost-savings" className="hover:text-paper transition-colors">Cost & Savings ROI</Link></li>
              <li><Link to="/reports" className="hover:text-paper transition-colors">PDF Sustainability Reports</Link></li>
            </ul>
          </div>

          {/* Knowledge & Science */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-lime mb-4 font-semibold">
              Knowledge Hub
            </h4>
            <ul className="space-y-2.5 text-sm text-paper/70">
              <li><Link to="/solutions" className="hover:text-paper transition-colors">Green Solutions Library</Link></li>
              <li><Link to="/benchmarks" className="hover:text-paper transition-colors">Benchmark Explorer</Link></li>
              <li><Link to="/knowledge-hub" className="hover:text-paper transition-colors">Education & Standards</Link></li>
              <li><Link to="/about" className="hover:text-paper transition-colors">Our Mission & Vision</Link></li>
              <li><Link to="/how-it-works" className="hover:text-paper transition-colors">5-Step AI Methodology</Link></li>
            </ul>
          </div>

          {/* Framework Standards */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-lime mb-4 font-semibold">
              Standards & Baselines
            </h4>
            <div className="space-y-3 text-xs text-paper/60">
              <p>
                Calculation factors calibrated against ASHRAE 90.1, ICE Bath Embodied Carbon v3.0, and National Building Codes.
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="block font-semibold text-paper/90">Educational Disclaimer</span>
                <span className="block leading-tight text-[11px]">
                  EcoBuild AI provides simulation and advisory metrics. Certifications such as LEED, IGBC, and GRIHA require accredited third-party commissioning.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-paper/50 gap-4">
          <p>© {new Date().getFullYear()} EcoBuild AI. Build Smarter. Build Greener. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-lime">Production v1.0.0</span>
            <Link to="/about" className="hover:text-paper transition-colors">Methodology</Link>
            <Link to="/knowledge-hub" className="hover:text-paper transition-colors">Glossary</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
