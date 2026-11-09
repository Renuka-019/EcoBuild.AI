import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  BarChart3,
  Split,
  Trophy,
  Zap,
  Droplets,
  CloudFog,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const CompareDesignsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [allBuildings, setAllBuildings] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [priority, setPriority] = useState<string>('Balanced Performance');
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getBuildings().then((bList) => {
      setAllBuildings(bList);
      const urlIds = searchParams.get('ids');
      if (urlIds) {
        const parsed = urlIds.split(',').map(Number).filter(Boolean);
        setSelectedIds(parsed);
      } else if (bList.length >= 2) {
        setSelectedIds([bList[0].id, bList[1].id]);
      }
    });
  }, [searchParams]);

  const executeComparison = async () => {
    if (selectedIds.length < 2) return;
    try {
      setLoading(true);
      const res = await api.createComparison({
        title: `Design Comparison (${selectedIds.length} Designs)`,
        building_ids: selectedIds,
        priority_preference: priority
      });
      setComparisonResult(res.data);
    } catch (err: any) {
      alert(err.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length >= 2) {
      executeComparison();
    }
  }, [selectedIds, priority]);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        alert('Comparison requires at least 2 building designs.');
        return;
      }
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert('Maximum of 4 designs can be compared simultaneously.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const chartData = comparisonResult?.designs ? comparisonResult.designs.map((d: any) => ({
    name: d.name,
    Score: d.score,
    EnergyIntensity: d.energy_intensity,
    CarbonIntensity: d.carbon_intensity,
    WaterLPCD: d.water_lpcd,
  })) : [];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Multi-Attribute Decision Engine
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Compare Building Designs
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Side-by-side trade-off assessment evaluating capital cost against lifecycle carbon, energy, and water intensity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink2/60 mr-1">Decision Priority:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white border border-ink/10 text-xs font-mono font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-lime2"
            >
              <option value="Balanced Performance">Balanced Performance</option>
              <option value="Highest Sustainability">Highest Sustainability</option>
              <option value="Lowest Carbon">Lowest Carbon Footprint</option>
              <option value="Lowest Cost">Lowest Construction Cost</option>
            </select>
          </div>
        </div>

        {/* Building Selector Chips */}
        <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
            Select Buildings to Compare ({selectedIds.length} Selected):
          </span>
          <div className="flex flex-wrap gap-2">
            {allBuildings.map((b) => {
              const active = selectedIds.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleSelect(b.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                    active
                      ? 'bg-ink text-lime border-lime font-bold shadow-sm'
                      : 'bg-paper text-ink2/70 border-ink/10 hover:border-ink/30'
                  }`}
                >
                  {active ? '✓ ' : '+ '} {b.project_name} ({b.building_type})
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-mono text-ink2/60 mt-3">Executing multi-criteria trade-off comparison...</p>
          </div>
        ) : comparisonResult ? (
          <div className="space-y-8">
            
            {/* Recommendation Winner Banner */}
            <div className="bg-forest text-paper rounded-3xl p-8 border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-lime font-mono text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-5 h-5 text-lime" />
                Algorithm Recommendation ({priority})
              </div>
              <h2 className="text-2xl font-bold font-sans text-paper">
                Recommended Design Alternative: <span className="text-lime">{comparisonResult.recommended_design}</span>
              </h2>
              <p className="text-xs text-paper/85 font-sans leading-relaxed max-w-3xl">
                {comparisonResult.recommendation_reason}. Review the detailed multi-metric matrix and leader rankings below.
              </p>
            </div>

            {/* Side-by-Side Comparison Matrix Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm overflow-x-auto space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                  Detailed Attribute Breakdown
                </span>
                <h3 className="text-lg font-bold text-ink font-sans">
                  Side-by-Side Performance Comparison
                </h3>
              </div>

              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-ink/10 font-mono text-[11px] text-ink2/60 uppercase">
                    <th className="py-3 px-4">Metric / Dimension</th>
                    {comparisonResult.designs.map((d: any) => (
                      <th key={d.id} className="py-3 px-4">
                        {d.name}
                        {d.name === comparisonResult.recommended_design && (
                          <span className="ml-1 text-emeraldGreen font-bold font-mono">★</span>
                        )}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-emeraldGreen font-bold">Category Leader</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-ink">Sustainability Score</td>
                    {comparisonResult.designs.map((d: any) => (
                      <td key={d.id} className="py-3.5 px-4 font-mono font-bold text-ink">
                        {d.score}/100 ({d.classification})
                      </td>
                    ))}
                    <td className="py-3.5 px-4 font-mono font-bold text-forest">{comparisonResult.leaders.sustainability_score}</td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-ink">Energy Intensity (EUI)</td>
                    {comparisonResult.designs.map((d: any) => (
                      <td key={d.id} className="py-3.5 px-4 font-mono">
                        {d.energy_intensity} kWh/m²/yr
                      </td>
                    ))}
                    <td className="py-3.5 px-4 font-mono font-bold text-forest">{comparisonResult.leaders.energy_intensity}</td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-ink">Water Consumption</td>
                    {comparisonResult.designs.map((d: any) => (
                      <td key={d.id} className="py-3.5 px-4 font-mono">
                        {d.water_lpcd} LPCD
                      </td>
                    ))}
                    <td className="py-3.5 px-4 font-mono font-bold text-forest">{comparisonResult.leaders.water_lpcd}</td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-ink">Carbon Footprint Intensity</td>
                    {comparisonResult.designs.map((d: any) => (
                      <td key={d.id} className="py-3.5 px-4 font-mono">
                        {d.carbon_intensity} kg CO2e/m²
                      </td>
                    ))}
                    <td className="py-3.5 px-4 font-mono font-bold text-forest">{comparisonResult.leaders.carbon_intensity}</td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-ink">Estimated Capital Outlay</td>
                    {comparisonResult.designs.map((d: any) => (
                      <td key={d.id} className="py-3.5 px-4 font-mono">
                        {d.construction_cost > 0 ? `$${d.construction_cost.toLocaleString()}` : 'N/A'}
                      </td>
                    ))}
                    <td className="py-3.5 px-4 font-mono font-bold text-forest">{comparisonResult.leaders.construction_cost}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comparative Visual Bar Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                  Comparative Visualization
                </span>
                <h3 className="text-lg font-bold text-ink font-sans">
                  Overall Sustainability Scores by Design Alternative
                </h3>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#10291A' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#10291A' }} />
                    <Tooltip />
                    <Bar dataKey="Score" fill="#153322" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        ) : null}

      </main>
    </div>
  );
};
