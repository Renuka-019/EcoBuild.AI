import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import { MetricCard } from '../components/MetricCard';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  Building2,
  Zap,
  Droplets,
  CloudFog,
  TrendingDown,
  PlusCircle,
  BarChart3,
  FileText,
  Sliders,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const pieColors = ['#10B981', '#84CC16', '#0EA5E9', '#F59E0B', '#E11D48'];

  const scoreData = summary?.score_distribution ? [
    { name: 'Platinum', value: summary.score_distribution['Platinum'] || 0 },
    { name: 'Gold', value: summary.score_distribution['Gold'] || 0 },
    { name: 'Silver', value: summary.score_distribution['Silver'] || 0 },
    { name: 'Certified', value: summary.score_distribution['Certified'] || 0 },
    { name: 'Needs Improvement', value: summary.score_distribution['Needs Improvement'] || 0 }
  ].filter(d => d.value > 0) : [];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Live Environmental Command
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Sustainability Dashboard
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Aggregated portfolio metrics, certification distribution, and carbon abatement opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/buildings/new"
              className="px-4 py-2.5 rounded-xl bg-ink text-paper hover:bg-forest font-semibold text-xs font-mono uppercase tracking-wider transition-all border border-lime/30 flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-lime" />
              Add Building
            </Link>

            <Link
              to="/compare"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-mist text-ink font-semibold text-xs font-mono uppercase tracking-wider transition-colors border border-ink/10 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-forest" />
              Compare Designs
            </Link>

            <Link
              to="/simulator"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-mist text-ink font-semibold text-xs font-mono uppercase tracking-wider transition-colors border border-ink/10 flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-forest" />
              Simulator
            </Link>
          </div>
        </div>

        {/* Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Portfolio Avg Score"
            value={summary?.average_score || 0}
            unit="/100"
            icon={Building2}
            status="good"
            note={`${summary?.total_analyzed || 0} of ${summary?.total_buildings || 0} buildings evaluated`}
          />

          <MetricCard
            title="Annual Electricity"
            value={summary ? Math.round(summary.total_energy_kwh).toLocaleString() : 0}
            unit="kWh/yr"
            icon={Zap}
            note="Aggregated operational electricity draw across all active sites"
          />

          <MetricCard
            title="Total Carbon Footprint"
            value={summary ? Math.round(summary.total_carbon_tons).toLocaleString() : 0}
            unit="tCO2e"
            icon={CloudFog}
            status="alert"
            note="Combined Scope 2 operational and annualized embodied emissions"
          />

          <MetricCard
            title="Clean Energy Abatement"
            value={summary ? Math.round(summary.potential_energy_savings_kwh).toLocaleString() : 0}
            unit="kWh/yr"
            icon={TrendingDown}
            status="good"
            note="Actionable efficiency & rooftop solar generation potential"
          />
        </div>

        {/* Charts & Portfolio Distribution Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Rating Breakdown Pie */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                Rating Classification
              </span>
              <h3 className="text-lg font-bold text-ink font-sans mt-1">
                Portfolio Certification Tiers
              </h3>
            </div>

            <div className="h-56 flex items-center justify-center">
              {scoreData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {scoreData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-xs text-ink2/50 font-mono">
                  No buildings analyzed yet.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-4 border-t border-ink/5">
              {scoreData.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 text-ink2/80">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                  <span>{s.name}: <strong>{s.value}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Buildings Table / Cards */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                  Active Projects
                </span>
                <h3 className="text-lg font-bold text-ink font-sans mt-1">
                  Recent Building Designs
                </h3>
              </div>
              <Link to="/buildings" className="text-xs font-mono text-emeraldGreen font-semibold hover:underline">
                View All ({summary?.total_buildings || 0})
              </Link>
            </div>

            <div className="space-y-3 overflow-x-auto">
              {summary?.recent_buildings && summary.recent_buildings.length > 0 ? (
                summary.recent_buildings.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-paper border border-ink/5 hover:border-ink/20 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-ink font-sans">{b.project_name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mist text-ink2">
                          {b.building_type}
                        </span>
                      </div>
                      <p className="text-xs text-ink2/60 font-sans">
                        {b.location} • {b.area_m2} m²
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {b.latest_score !== null ? (
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono text-ink block">
                            {b.latest_score}/100
                          </span>
                          <span className="text-[10px] font-mono text-emeraldGreen uppercase">
                            {b.latest_classification}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded">
                          Not Analyzed
                        </span>
                      )}

                      <Link
                        to={`/analysis/${b.latest_analysis_id || b.id}`}
                        className="p-2 rounded-xl bg-white border border-ink/10 hover:bg-lime/20 text-ink transition-colors"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3">
                  <p className="text-xs text-ink2/60 font-sans">No buildings registered yet.</p>
                  <Link
                    to="/buildings/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-paper text-xs font-mono font-bold"
                  >
                    Add First Building
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-2 text-xs text-ink2/50 font-mono flex items-center justify-between">
              <span>Database Sync Status: Real-time</span>
              <span className="text-emeraldGreen">● Engine Ready</span>
            </div>
          </div>

        </div>

        {/* AI Recommendations & Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Opportunities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emeraldGreen" />
              <h3 className="text-lg font-bold text-ink font-sans">
                High-Impact Sustainable Interventions
              </h3>
            </div>
            
            <div className="space-y-3">
              {summary?.top_recommendations && summary.top_recommendations.length > 0 ? (
                summary.top_recommendations.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-paper border border-ink/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink font-sans">{r.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                        {r.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-ink2/70 font-sans leading-relaxed">
                      {r.benefit}
                    </p>
                    <div className="text-[11px] font-mono text-ink2/60 flex justify-between pt-1">
                      <span>Project: <strong>{r.building_name}</strong></span>
                      {r.savings_kwh > 0 && <span className="text-emeraldGreen">+{r.savings_kwh.toLocaleString()} kWh Saved</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink2/60 py-6 text-center">Run an analysis to generate AI recommendations.</p>
              )}
            </div>
          </div>

          {/* Audit Activity Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-ink2" />
              <h3 className="text-lg font-bold text-ink font-sans">
                Activity Audit Trail
              </h3>
            </div>

            <div className="space-y-3">
              {summary?.activity_timeline && summary.activity_timeline.length > 0 ? (
                summary.activity_timeline.map((act: any) => (
                  <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-paper text-xs font-sans">
                    <div className="w-2 h-2 rounded-full bg-emeraldGreen mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold text-ink block">{act.action}</span>
                      <span className="text-ink2/70 block">{act.details}</span>
                    </div>
                    <span className="text-[10px] font-mono text-ink2/50 shrink-0">
                      {new Date(act.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink2/60 py-6 text-center">No logged activity yet.</p>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
