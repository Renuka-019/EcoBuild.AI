import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Filter, Sparkles, CheckCircle2, DollarSign, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SolutionsLibraryPage: React.FC = () => {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Renewable Energy',
    'Water Management',
    'Green Building Materials',
    'Passive Architecture',
    'Energy Efficiency',
    'Sustainable Landscaping'
  ];

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const data = await api.getSolutions(selectedCategory, searchQuery);
      setSolutions(data);
    } catch (err) {
      console.error('Failed to fetch solutions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-paper text-ink py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            Sustainable Interventions
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-ink font-sans tracking-tight">
            Sustainable Solutions Library
          </h1>
          <p className="text-base sm:text-lg text-ink2/80 font-sans leading-relaxed">
            Curated repository of proven green construction technologies, materials, and passive systems verified against ASHRAE, IGBC, and ISO benchmarks.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink2/40" />
              <input
                type="text"
                placeholder="Search solutions, materials, HVAC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-paper border border-ink/10 focus:outline-none focus:ring-2 focus:ring-lime2 text-sm text-ink font-sans"
              />
            </div>

            <div className="text-xs font-mono text-ink2/60">
              Showing <span className="font-bold text-ink">{solutions.length}</span> verified solutions
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-2 pt-2 pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-ink text-lime border-lime shadow-sm font-bold'
                    : 'bg-paper text-ink2/70 border-ink/10 hover:border-ink/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
            <p className="text-xs font-mono text-ink2/60 mt-3">Loading solutions catalog...</p>
          </div>
        ) : solutions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-ink/10 space-y-3">
            <p className="text-base font-semibold text-ink">No solutions matched your search criteria.</p>
            <p className="text-xs text-ink2/60">Try searching for generic terms such as "Solar", "Concrete", "Rainwater", or "Ventilation".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-7 border border-ink/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emeraldGreen bg-lime/20 border border-lime2 px-2.5 py-1 rounded-md font-bold">
                      {s.category}
                    </span>
                    <span className="text-[10px] font-mono text-ink2/50 uppercase">
                      Diff: {s.implementation_difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-ink font-sans group-hover:text-emeraldGreen transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-ink2/80 leading-relaxed font-sans line-clamp-3">
                    {s.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-ink/5 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-ink2/60 font-semibold block">
                      Environmental Benefit:
                    </span>
                    <p className="text-xs text-forest font-medium leading-tight">
                      {s.environmental_benefit}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-ink2/60 font-semibold block">
                      Application Scope:
                    </span>
                    <p className="text-xs text-ink2/70 leading-tight">
                      {s.application}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between font-mono text-[11px] border-t border-ink/5">
                    <span className="text-ink2/60">Cost: <strong className="text-ink">{s.cost_category}</strong></span>
                    <span className="text-emeraldGreen font-bold">{s.potential_savings_desc}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Action Callout */}
        <div className="bg-forest text-paper rounded-3xl p-8 sm:p-10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-sans text-paper">Want to see which solutions best fit your building?</h3>
            <p className="text-xs text-paper/75 font-sans">Create a free project to get an automated, tailored recommendation rank list.</p>
          </div>
          <Link
            to="/buildings/new"
            className="px-6 py-3.5 rounded-xl bg-lime text-ink font-bold text-xs uppercase tracking-wider font-mono hover:bg-lime2 transition-colors shrink-0 flex items-center gap-2"
          >
            Start Building Analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
