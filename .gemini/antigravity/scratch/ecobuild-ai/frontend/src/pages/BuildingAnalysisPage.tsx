import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AppSidebar } from '../components/AppSidebar';
import {
  CheckCircle2,
  Cpu,
  Zap,
  Droplets,
  CloudFog,
  Boxes,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const BuildingAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState('');

  const stages = [
    { title: 'Validating Building Data & Geometry', icon: Cpu },
    { title: 'Calculating Energy Use Intensity (EUI)', icon: Zap },
    { title: 'Estimating Hydrological Demand & Rainwater Yield', icon: Droplets },
    { title: 'Assessing Scope 2 Operational & Embodied Carbon', icon: CloudFog },
    { title: 'Evaluating Concrete Pozzolan & Steel Recycled Circularity', icon: Boxes },
    { title: 'Synthesizing Explainable AI Recommendations', icon: Sparkles }
  ];

  useEffect(() => {
    let isMounted = true;

    const executeAnalysis = async () => {
      if (!id) return;

      try {
        // Stage progress sequencing
        const stepInterval = setInterval(() => {
          setActiveStage((prev) => {
            if (prev < stages.length - 1) return prev + 1;
            return prev;
          });
        }, 400);

        // Actual backend execution
        const analysisResult = await api.runAnalysis(id);

        clearInterval(stepInterval);
        if (isMounted) {
          setActiveStage(stages.length);
          setTimeout(() => {
            navigate(`/analysis/${analysisResult.id}`);
          }, 800);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Environmental assessment failed. Please verify inputs.');
        }
      }
    };

    executeAnalysis();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-12 flex items-center justify-center">
        
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-ink/10 shadow-2xl max-w-xl w-full text-center space-y-8">
          
          {error ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-ink font-sans">Analysis Notice</h2>
              <p className="text-xs text-rose-800 font-sans leading-relaxed">{error}</p>
              <button
                onClick={() => navigate('/buildings')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-ink text-paper text-xs font-mono font-bold"
              >
                Return to My Buildings
              </button>
            </div>
          ) : (
            <>
              {/* Spinner & Graphic */}
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-lime/30 border-t-forest animate-spin" />
                <div className="absolute w-14 h-14 rounded-2xl bg-forest text-lime flex items-center justify-center shadow-lg border border-lime/30">
                  <Cpu className="w-7 h-7 stroke-[2]" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-emeraldGreen font-bold">
                  Calculation Engine Active
                </span>
                <h2 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
                  Analyzing Your Building...
                </h2>
                <p className="text-xs text-ink2/70 font-sans max-w-sm mx-auto">
                  Running GHG Protocol formulas, regional climate baselines, and material lifecycle algorithms.
                </p>
              </div>

              {/* Progress Checklist */}
              <div className="space-y-2.5 text-left border-t border-ink/5 pt-6 font-mono text-xs">
                {stages.map((stg, i) => {
                  const isDone = activeStage > i;
                  const isCurrent = activeStage === i;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-lime/20 text-forest font-bold border border-lime2'
                          : isDone
                          ? 'text-ink font-medium'
                          : 'text-ink2/30'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emeraldGreen shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-forest border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-ink/20 shrink-0" />
                      )}
                      <span className="truncate">{stg.title}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>

      </main>
    </div>
  );
};
