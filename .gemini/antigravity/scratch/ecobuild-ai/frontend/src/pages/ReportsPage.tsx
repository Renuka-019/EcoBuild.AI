import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  FileText,
  Download,
  PlusCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | ''>('');
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    api.getBuildings().then((bList) => {
      setBuildings(bList);
      if (bList.length > 0) setSelectedBuildingId(bList[0].id);
    });
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedBuildingId) {
      alert('Please select a building to audit');
      return;
    }
    try {
      setGenerating(true);
      const newRep = await api.generateReport(selectedBuildingId, 'Comprehensive Environmental Audit Report');
      await fetchReports();
      window.open(newRep.download_url, '_blank');
    } catch (err: any) {
      alert(err.message || 'Failed to generate report. Make sure the building has been analyzed first.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
              Compliance & Verification
            </span>
            <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
              Sustainability Audit Reports
            </h1>
            <p className="text-xs text-ink2/70 font-sans mt-0.5">
              Generate and download formal, multi-page PDF environmental audit reports formatted with ISO 14040 and GHG standards.
            </p>
          </div>

          {/* Quick Generate Action */}
          <div className="flex items-center gap-2">
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(Number(e.target.value))}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-ink/10 text-xs font-mono text-ink font-semibold focus:outline-none"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.project_name}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={generating || !selectedBuildingId}
              onClick={handleGenerateReport}
              className="px-5 py-2.5 rounded-xl bg-ink text-paper hover:bg-forest text-xs font-mono font-bold uppercase tracking-wider transition-all border border-lime/30 flex items-center gap-2 shadow-sm shrink-0"
            >
              <FileText className="w-4 h-4 text-lime" />
              {generating ? 'Compiling PDF...' : 'Generate New PDF'}
            </button>
          </div>
        </div>

        {/* Reports Archive */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-ink/5 pb-4">
            <h3 className="text-lg font-bold text-ink font-sans">
              Generated Reports Archive ({reports.length})
            </h3>
            <span className="text-xs font-mono text-ink2/60">
              Format: PDF Document (A4/Letter)
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-lime border-t-ink rounded-full animate-spin" />
              <p className="text-xs font-mono text-ink2/60 mt-3">Loading report history...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileText className="w-12 h-12 text-ink2/40 mx-auto stroke-[1.5]" />
              <p className="text-sm font-semibold text-ink font-sans">No reports generated yet.</p>
              <p className="text-xs text-ink2/60 max-w-sm mx-auto font-sans">
                Select one of your analyzed buildings above and click "Generate New PDF" to create an audit certificate.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-paper border border-ink/5 hover:border-ink/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink font-sans">{r.report_title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime/20 text-forest font-bold">
                        Score: {r.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-ink2/70 font-sans">
                      Target Project: <strong>{r.building_name}</strong> • Created: {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={r.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-forest hover:bg-ink text-paper text-xs font-mono font-bold transition-colors flex items-center gap-2 border border-lime2"
                    >
                      <Download className="w-3.5 h-3.5 text-lime" />
                      Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Methodology & Emission Factors Transparency Banner */}
        <div className="bg-mist/60 rounded-3xl p-6 sm:p-8 border border-ink/10 space-y-3 text-xs font-sans text-ink2/80 leading-relaxed">
          <div className="flex items-center gap-2 font-mono font-bold text-ink text-xs uppercase">
            <ShieldCheck className="w-4 h-4 text-emeraldGreen" />
            Audit Standards & Governing Emission Factors
          </div>
          <p>
            All generated reports comply with ISO 14040 environmental life-cycle standards. Scope 2 electricity factors utilize national grid averages (0.716 kg CO2e/kWh). Embodied material intensities are sourced from the University of Bath Inventory of Carbon and Energy (ICE v3.0). Standard residential water baselines follow the National Building Code (135 LPCD).
          </p>
        </div>

      </main>
    </div>
  );
};
