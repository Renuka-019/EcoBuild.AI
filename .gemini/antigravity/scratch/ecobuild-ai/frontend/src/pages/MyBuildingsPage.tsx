import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  Building2,
  Search,
  Filter,
  PlusCircle,
  Play,
  FileText,
  Trash2,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MyBuildingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const data = await api.getBuildings(typeFilter, search);
      setBuildings(data);
    } catch (err) {
      console.error('Failed to load buildings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [typeFilter, search]);

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? All associated analyses and reports will be removed.`)) {
      try {
        await api.deleteBuilding(id);
        setBuildings(buildings.filter(b => b.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete building');
      }
    }
  };

  const toggleCompare = (id: number) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(x => x !== id));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare a maximum of 4 designs simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 building designs to compare.');
      return;
    }
    navigate(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Project Repository
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              My Building Designs
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Manage your architectural assets, run environmental assessments, and select designs for multi-attribute comparison.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedForCompare.length >= 2 && (
              <button
                type="button"
                onClick={handleLaunchCompare}
                className="px-4 py-2.5 rounded-xl bg-forest hover:bg-ink text-lime border border-lime text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                Compare ({selectedForCompare.length}) Designs
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <Link
              to="/buildings/new"
              className="px-4 py-2.5 rounded-xl bg-ink text-paper hover:bg-forest text-xs font-mono font-bold uppercase tracking-wider transition-all border border-lime/30 flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-lime" />
              Add New Building
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2/40" />
            <input
              type="text"
              placeholder="Search projects or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-paper border border-ink/10 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-lime2"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {['All', 'Residential', 'Commercial', 'Industrial', 'Educational', 'Healthcare'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                  typeFilter === type
                    ? 'bg-ink text-lime border-lime font-bold'
                    : 'bg-paper text-ink2/70 border-ink/10 hover:border-ink/30'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Buildings Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-mono text-ink2/60 mt-3">Loading your building designs...</p>
          </div>
        ) : buildings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-ink/10 space-y-4">
            <Building2 className="w-12 h-12 text-ink2/40 mx-auto stroke-[1.5]" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-ink font-sans">No Building Designs Found</h3>
              <p className="text-xs text-ink2/60 max-w-sm mx-auto font-sans">
                You haven't added any buildings matching this criteria yet. Create your first project to unlock environmental scoring.
              </p>
            </div>
            <Link
              to="/buildings/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ink text-paper hover:bg-forest text-xs font-mono font-bold"
            >
              <PlusCircle className="w-4 h-4 text-lime" />
              Add Building Design
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((b) => {
              const isSelected = selectedForCompare.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md ${
                    isSelected ? 'border-2 border-forest ring-4 ring-lime/20' : 'border-ink/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mist text-ink2 font-semibold uppercase">
                        {b.building_type}
                      </span>

                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleCompare(b.id)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg transition-colors border ${
                          isSelected
                            ? 'bg-forest text-lime border-forest font-bold'
                            : 'bg-paper text-ink2/70 border-ink/10 hover:border-ink/30'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : '+ Compare'}
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-ink font-sans leading-tight">
                      {b.project_name}
                    </h3>
                    
                    <p className="text-xs text-ink2/60 font-sans">
                      {b.location} • {b.built_up_area_m2} m² • {b.floors} fl • {b.occupants} people
                    </p>
                  </div>

                  {/* Score badge / status */}
                  <div className="p-4 rounded-2xl bg-paper border border-ink/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-ink2/60 block">Sustainability</span>
                      {b.latest_score !== null ? (
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-2xl font-extrabold font-mono text-ink">
                            {b.latest_score}
                          </span>
                          <span className="text-xs font-mono text-emeraldGreen font-bold uppercase">
                            {b.latest_classification}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-amber-700 font-semibold">
                          Not Analyzed
                        </span>
                      )}
                    </div>

                    <div className="text-right text-[11px] font-mono text-ink2/60">
                      <span>Const: {b.construction_year}</span>
                      <span className="block text-[10px] text-ink2/40">{b.orientation}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-ink/5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/analyze/${b.id}`}
                        className="px-3 py-1.5 rounded-lg bg-ink hover:bg-forest text-lime font-bold flex items-center gap-1.5 transition-colors"
                        title="Run AI Analysis"
                      >
                        <Play className="w-3.5 h-3.5 fill-lime" />
                        Analyze
                      </Link>

                      {b.latest_analysis_id && (
                        <Link
                          to={`/analysis/${b.latest_analysis_id}`}
                          className="px-3 py-1.5 rounded-lg bg-mist hover:bg-white text-ink font-medium border border-ink/10 transition-colors"
                          title="View Results"
                        >
                          Results
                        </Link>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(b.id, b.project_name)}
                      className="p-1.5 rounded-lg text-ink2/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Building"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
