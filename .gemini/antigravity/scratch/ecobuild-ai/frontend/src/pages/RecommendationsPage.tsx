import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  Sparkles,
  Zap,
  Droplets,
  CloudFog,
  Boxes,
  CheckCircle2,
  ArrowRight,
  Filter,
  DollarSign,
  TrendingDown
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!analysisId) return;
    try {
      setLoading(true);
      const data = await api.getRecommendations(analysisId);
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [analysisId]);

  const handleApply = async (recId: number, title: string) => {
    try {
      setApplyingId(recId);
      const res = await api.applyRecommendation(recId);
      setAppliedNotice(`Applied '${title}'! New Sustainability Score: ${res.new_score}/100 (${res.new_classification})`);
      setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, applied: true } : r));
    } catch (err: any) {
      alert(err.message || 'Failed to apply recommendation');
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = recommendations.filter(r => {
    if (filterPriority !== 'All' && r.priority !== filterPriority) return false;
    if (filterCategory !== 'All' && !r.category.includes(filterCategory)) return false;
    return true;
  });

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Explainable AI Intelligence
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Smart Green Recommendations
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Personalized interventions derived directly from empirical building deviations and benchmark standards.
            </p>
          </div>

          <Link
            to={`/analysis/${analysisId}`}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-mist text-ink text-xs font-mono font-medium transition-colors border border-ink/10 flex items-center gap-1.5 shadow-sm"
          >
            Back to Analysis Results
          </Link>
        </div>

        {appliedNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emeraldGreen shrink-0" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink2/60 mr-1">Priority:</span>
            {['All', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  filterPriority === p
                    ? 'bg-ink text-lime border-lime font-bold'
                    : 'bg-paper text-ink2/70 border-ink/10 hover:border-ink/30'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-mono text-ink2/60 mr-1">Focus:</span>
            {['All', 'Energy', 'Water', 'Materials', 'Carbon'].map((c) => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                  filterCategory === c
                    ? 'bg-ink text-lime border-lime font-bold'
                    : 'bg-paper text-ink2/70 border-ink/10 hover:border-ink/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

        </div>

        {/* Recommendations List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-mono text-ink2/60 mt-3">Synthesizing AI recommendations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-ink/10 space-y-3">
            <p className="text-sm font-semibold text-ink">No recommendations matching selected filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((r) => {
              const isHigh = r.priority === 'High';
              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-3xl p-8 border shadow-sm transition-all space-y-6 ${
                    r.applied
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : isHigh
                      ? 'border-rose-200'
                      : 'border-ink/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/5 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isHigh ? 'bg-rose-100 text-rose-800' : 'bg-lime/20 text-forest'
                        }`}>
                          {r.priority} Priority
                        </span>
                        <span className="text-xs font-mono text-ink2/60">
                          {r.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-ink font-sans">
                        {r.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {r.applied ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-mono text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emeraldGreen" />
                          Applied to Design
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={applyingId === r.id}
                          onClick={() => handleApply(r.id, r.title)}
                          className="px-5 py-2.5 rounded-xl bg-ink text-paper hover:bg-forest text-xs font-mono font-bold uppercase tracking-wider transition-all border border-lime/30 flex items-center gap-2 shadow-sm"
                        >
                          {applyingId === r.id ? 'Updating Model...' : 'Apply This Recommendation'}
                          <ArrowRight className="w-4 h-4 text-lime" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Problem & Improvement Detail */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                    <div className="space-y-1.5 p-4 rounded-2xl bg-paper border border-ink/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 font-bold block">
                        Problem Identified:
                      </span>
                      <p className="text-ink2/80 leading-relaxed">
                        {r.problem_identified}
                      </p>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-paper border border-ink/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold block">
                        Suggested Improvement:
                      </span>
                      <p className="text-ink2/80 leading-relaxed">
                        {r.suggested_improvement}
                      </p>
                    </div>
                  </div>

                  {/* Environmental Benefit & Reasoning */}
                  <div className="p-4 rounded-2xl bg-mist/60 text-xs font-sans space-y-2">
                    <div>
                      <strong className="text-ink font-sans">Why this matters: </strong>
                      <span className="text-ink2/80">{r.reason}</span>
                    </div>
                    <div>
                      <strong className="text-emeraldGreen font-sans">Environmental Benefit: </strong>
                      <span className="text-ink font-medium">{r.environmental_benefit}</span>
                    </div>
                  </div>

                  {/* Expected Savings Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-ink/5 font-mono text-xs">
                    <div>
                      <span className="text-ink2/50 text-[10px] block">ENERGY SAVINGS</span>
                      <strong className="text-ink">{r.expected_savings_kwh > 0 ? `${r.expected_savings_kwh.toLocaleString()} kWh/yr` : 'Thermal Offset'}</strong>
                    </div>

                    <div>
                      <span className="text-ink2/50 text-[10px] block">WATER SAVINGS</span>
                      <strong className="text-ink">{r.expected_savings_water_l > 0 ? `${r.expected_savings_water_l.toLocaleString()} L/yr` : 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-ink2/50 text-[10px] block">CARBON REDUCTION</span>
                      <strong className="text-emeraldGreen">{r.expected_savings_carbon_tons > 0 ? `-${r.expected_savings_carbon_tons} tCO2e` : 'Zero Operational'}</strong>
                    </div>

                    <div>
                      <span className="text-ink2/50 text-[10px] block">ESTIMATED ANNUAL ROI</span>
                      <strong className="text-ink">{r.estimated_annual_roi_usd > 0 ? `$${r.estimated_annual_roi_usd.toLocaleString()}/yr` : 'Capital Payback'}</strong>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};
