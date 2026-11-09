import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  Compass,
  Zap,
  Droplets,
  CloudFog,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Search
} from 'lucide-react';

export const BenchmarkExplorerPage: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    setLoading(true);
    api.getBenchmarks(selectedType)
      .then(setBenchmarks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedType]);

  const types = ['All', 'Residential', 'Commercial', 'Educational', 'Healthcare', 'Industrial'];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Standards & Baselines
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Benchmark Explorer
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Reference energy, water, and carbon intensity datasets from ASHRAE, IGBC, GRIHA, and ISO standards.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  selectedType === t
                    ? 'bg-ink text-lime border-lime font-bold'
                    : 'bg-white text-ink2/70 border-ink/10 hover:border-ink/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Benchmarks Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-mono text-ink2/60 mt-3">Loading baseline datasets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benchmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-7 border border-ink/10 shadow-sm space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime/20 text-forest font-bold uppercase">
                      {b.building_type}
                    </span>
                    <span className="text-[11px] font-mono text-ink2/50">
                      Year: {b.source_year}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-ink font-sans">
                    {b.building_type} Baseline Standard
                  </h3>

                  <div className="text-xs text-ink2/60 font-mono">
                    Region: <strong>{b.region}</strong> ({b.climate_zone})
                  </div>
                </div>

                {/* 3 Metric Rows */}
                <div className="space-y-2.5 pt-4 border-t border-ink/5 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-paper">
                    <span className="flex items-center gap-1.5 text-ink2/70">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      Target EUI:
                    </span>
                    <strong className="text-ink">{b.energy_intensity_benchmark} kWh/m²/yr</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-paper">
                    <span className="flex items-center gap-1.5 text-ink2/70">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      Target Water:
                    </span>
                    <strong className="text-ink">{b.water_per_occupant_benchmark} LPCD</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-paper">
                    <span className="flex items-center gap-1.5 text-ink2/70">
                      <CloudFog className="w-3.5 h-3.5 text-emeraldGreen" />
                      Carbon Intensity:
                    </span>
                    <strong className="text-ink">{b.carbon_intensity_benchmark} kg CO2e/m²</strong>
                  </div>
                </div>

                <div className="pt-2 text-[11px] font-mono text-ink2/60 border-t border-ink/5">
                  Source: <strong>{b.source}</strong>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Disclaimer Card */}
        <div className="p-6 rounded-3xl bg-mist/60 border border-ink/10 text-xs font-sans text-ink2/80 space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-ink uppercase text-xs">
            <ShieldCheck className="w-4 h-4 text-emeraldGreen" />
            Compliance & Certification Integrity
          </div>
          <p>
            EcoBuild AI maintains rigorous benchmark citations recorded with respective origin bodies, climatic geography, and publication year. These datasets are continuously audited to ensure mathematical parity with modern green building codes.
          </p>
        </div>

      </main>
    </div>
  );
};
