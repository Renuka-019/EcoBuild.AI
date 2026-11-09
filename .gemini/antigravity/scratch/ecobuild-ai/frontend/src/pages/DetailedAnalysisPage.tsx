import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import { ScoreGauge } from '../components/ScoreGauge';
import { MetricCard } from '../components/MetricCard';
import {
  Zap,
  Droplets,
  CloudFog,
  Boxes,
  Download,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building2,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export const DetailedAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (id) {
      api.getAnalysis(id)
        .then(setAnalysis)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!analysis) return;
    try {
      setGeneratingPdf(true);
      const rep = await api.generateReport(analysis.building_id, `Audit Report – Project #${analysis.building_id}`);
      window.open(rep.download_url, '_blank');
    } catch (err: any) {
      alert(err.message || 'Failed to generate PDF report');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] bg-paper">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] bg-paper">
        <AppSidebar />
        <main className="flex-1 p-12 text-center">
          <p>Analysis record not found.</p>
          <Link to="/buildings" className="text-emeraldGreen font-semibold mt-2 inline-block">Return to Buildings</Link>
        </main>
      </div>
    );
  }

  const categoryRadarData = [
    { subject: 'Energy Efficiency', score: analysis.energy_score, fullMark: 100 },
    { subject: 'Carbon Footprint', score: analysis.carbon_score, fullMark: 100 },
    { subject: 'Water Conservation', score: analysis.water_score, fullMark: 100 },
    { subject: 'Materials & Circularity', score: analysis.materials_score, fullMark: 100 }
  ];

  const carbonBreakdownData = [
    { name: 'Operational Grid', tons: analysis.operational_carbon_tons },
    { name: 'Concrete Embodied', tons: analysis.concrete_carbon_tons },
    { name: 'Steel Embodied', tons: analysis.steel_carbon_tons },
    { name: 'Brick Embodied', tons: analysis.brick_carbon_tons }
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Verified Environmental Assessment
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Sustainability Analysis Results
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Assessed on {new Date(analysis.created_at).toLocaleDateString()} • Calibrated against ASHRAE 90.1 & IGBC Baseline
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="px-4 py-2.5 rounded-xl bg-forest hover:bg-ink text-paper text-xs font-mono font-bold transition-all border border-lime2 flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-lime" />
              {generatingPdf ? 'Building PDF...' : 'Download PDF Report'}
            </button>

            <Link
              to={`/recommendations/${analysis.id}`}
              className="px-4 py-2.5 rounded-xl bg-ink hover:bg-forest text-lime text-xs font-mono font-bold transition-all border border-lime/30 flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              AI Recommendations ({analysis.recommendations?.length || 0})
            </Link>
          </div>
        </div>

        {/* Top Executive Score Banner */}
        <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold">
              Overall Performance
            </span>
            <h2 className="text-2xl font-extrabold text-ink font-sans">
              Sustainability Score
            </h2>
            <p className="text-xs text-ink2/70 font-sans leading-relaxed">
              Composite index weighted across energy efficiency (35%), lifecycle carbon intensity (30%), water stewardship (20%), and recycled materials (15%).
            </p>
          </div>

          <div className="flex justify-center">
            <ScoreGauge
              score={analysis.overall_sustainability_score}
              classification={analysis.classification}
              size="lg"
            />
          </div>

          <div className="space-y-3 font-mono text-xs border-t md:border-t-0 md:border-l border-ink/5 pt-4 md:pt-0 md:pl-8">
            <div className="flex justify-between text-ink2/80">
              <span>Energy Score:</span>
              <strong className="text-ink">{analysis.energy_score}/100</strong>
            </div>
            <div className="flex justify-between text-ink2/80">
              <span>Carbon Score:</span>
              <strong className="text-ink">{analysis.carbon_score}/100</strong>
            </div>
            <div className="flex justify-between text-ink2/80">
              <span>Water Score:</span>
              <strong className="text-ink">{analysis.water_score}/100</strong>
            </div>
            <div className="flex justify-between text-ink2/80">
              <span>Materials Score:</span>
              <strong className="text-ink">{analysis.materials_score}/100</strong>
            </div>
          </div>

        </div>

        {/* 4 Core Dimensions Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Energy Intensity (EUI)"
            value={analysis.energy_intensity_kwh_m2}
            unit="kWh/m²/yr"
            benchmark={analysis.calculation_metadata?.benchmarks?.eui || 120}
            icon={Zap}
            status={analysis.energy_intensity_kwh_m2 < (analysis.calculation_metadata?.benchmarks?.eui || 120) ? 'good' : 'warning'}
            note={`Rated Class ${analysis.energy_efficiency_class} under commercial thermodynamic standards`}
          />

          <MetricCard
            title="Daily Water per Capita"
            value={analysis.water_per_occupant_lpcd}
            unit="LPCD"
            benchmark={analysis.calculation_metadata?.benchmarks?.water_lpcd || 100}
            icon={Droplets}
            status={analysis.water_per_occupant_lpcd <= (analysis.calculation_metadata?.benchmarks?.water_lpcd || 100) ? 'good' : 'warning'}
            note={`Harvest potential: ${Math.round(analysis.rainwater_harvest_potential_litres).toLocaleString()} L/yr`}
          />

          <MetricCard
            title="Annual Carbon Footprint"
            value={analysis.total_carbon_tons}
            unit="tCO2e/yr"
            icon={CloudFog}
            status="alert"
            note={`Intensity: ${analysis.carbon_intensity_kg_m2} kg CO2e/m²`}
          />

          <MetricCard
            title="Embodied Materials Carbon"
            value={analysis.embodied_carbon_tons}
            unit="tCO2e"
            icon={Boxes}
            note={`Concrete: ${analysis.concrete_carbon_tons}t | Steel: ${analysis.steel_carbon_tons}t`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Radar Category Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                Multi-Attribute Balance
              </span>
              <h3 className="text-lg font-bold text-ink font-sans">
                Sustainability Category Breakdown
              </h3>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={categoryRadarData}>
                  <PolarGrid stroke="#E7EBE8" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#10291A', fontSize: 11, fontFamily: 'monospace' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Performance Score" dataKey="score" stroke="#153322" fill="#C6F35C" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Carbon Contribution Bar Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                Emissions Inventory
              </span>
              <h3 className="text-lg font-bold text-ink font-sans">
                Operational vs Embodied Carbon Contributions (tCO2e)
              </h3>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonBreakdownData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#2C4434' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#2C4434' }} />
                  <Tooltip />
                  <Bar dataKey="tons" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Benchmark Assessment Comparison Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4 overflow-x-auto">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
              Gap Analysis
            </span>
            <h3 className="text-lg font-bold text-ink font-sans">
              Current Performance vs Industry Benchmarks
            </h3>
          </div>

          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-ink/10 font-mono text-[11px] text-ink2/60 uppercase">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4">Current Assessed Value</th>
                <th className="py-3 px-4">Standard Benchmark Target</th>
                <th className="py-3 px-4">Status & Actionable Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-ink">Energy Use Intensity</td>
                <td className="py-3.5 px-4 font-mono">{analysis.energy_intensity_kwh_m2} kWh/m²/yr</td>
                <td className="py-3.5 px-4 font-mono">{analysis.calculation_metadata?.benchmarks?.eui} kWh/m²/yr</td>
                <td className="py-3.5 px-4 font-mono text-emeraldGreen">
                  {analysis.energy_intensity_kwh_m2 <= (analysis.calculation_metadata?.benchmarks?.eui || 120) ? 'Compliant with Target' : 'Elevated Energy Intensity'}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-ink">Water Consumption per Capita</td>
                <td className="py-3.5 px-4 font-mono">{analysis.water_per_occupant_lpcd} LPCD</td>
                <td className="py-3.5 px-4 font-mono">{analysis.calculation_metadata?.benchmarks?.water_lpcd} LPCD</td>
                <td className="py-3.5 px-4 font-mono text-emeraldGreen">
                  {analysis.water_per_occupant_lpcd <= (analysis.calculation_metadata?.benchmarks?.water_lpcd || 100) ? 'Optimized Fixtures' : 'Exceeds WHO/NBC Baseline'}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-ink">Carbon Footprint Intensity</td>
                <td className="py-3.5 px-4 font-mono">{analysis.carbon_intensity_kg_m2} kg CO2e/m²</td>
                <td className="py-3.5 px-4 font-mono">{analysis.calculation_metadata?.benchmarks?.carbon_intensity} kg CO2e/m²</td>
                <td className="py-3.5 px-4 font-mono text-emeraldGreen">
                  {analysis.carbon_intensity_kg_m2 <= (analysis.calculation_metadata?.benchmarks?.carbon_intensity || 90) ? 'Within Baseline' : 'Abatement Required'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Simulator CTA Card */}
        <div className="bg-forest text-paper rounded-3xl p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-sans text-paper">Want to test upgrades on this building?</h3>
            <p className="text-xs text-paper/75 font-sans">Adjust rooftop solar capacity, rainwater harvesting, and low-carbon concrete in the interactive Green Simulator.</p>
          </div>
          <Link
            to={`/simulator?building_id=${analysis.building_id}`}
            className="px-6 py-3.5 rounded-xl bg-lime text-ink font-bold text-xs uppercase tracking-wider font-mono hover:bg-lime2 transition-colors shrink-0 flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            Launch Green Simulator
          </Link>
        </div>

      </main>
    </div>
  );
};
