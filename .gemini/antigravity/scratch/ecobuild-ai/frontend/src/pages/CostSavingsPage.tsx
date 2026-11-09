import React, { useState } from 'react';
import { AppSidebar } from '../components/AppSidebar';
import {
  DollarSign,
  TrendingDown,
  Calendar,
  PiggyBank,
  CheckCircle2,
  Zap,
  Droplets,
  CloudFog,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const CostSavingsPage: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState<number>(2000000);
  const [greenPremiumPct, setGreenPremiumPct] = useState<number>(4.5); // 4.5% typical green construction premium
  const [annualEnergyBill, setAnnualEnergyBill] = useState<number>(48000);
  const [energySavingsPct, setEnergySavingsPct] = useState<number>(35); // 35% energy bill savings
  const [annualWaterBill, setAnnualWaterBill] = useState<number>(8500);
  const [waterSavingsPct, setWaterSavingsPct] = useState<number>(30); // 30% water bill savings
  const [solarIncentive, setSolarIncentive] = useState<number>(12000);

  // Computed Financials
  const additionalCapex = Math.round((initialCapital * (greenPremiumPct / 100)) - solarIncentive);
  const annualEnergySaved = Math.round(annualEnergyBill * (energySavingsPct / 100));
  const annualWaterSaved = Math.round(annualWaterBill * (waterSavingsPct / 100));
  const totalAnnualSavings = annualEnergySaved + annualWaterSaved;
  const paybackYears = totalAnnualSavings > 0 ? (additionalCapex / totalAnnualSavings).toFixed(1) : '0';
  const tenYearNetSavings = Math.round((totalAnnualSavings * 10) - additionalCapex);
  const twentyFiveYearNetSavings = Math.round((totalAnnualSavings * 25) - additionalCapex);

  // 25-Year Cumulative Cost Projection Data
  const projectionData = [];
  let convCumulative = initialCapital;
  let greenCumulative = initialCapital + additionalCapex;

  for (let yr = 0; yr <= 25; yr += 5) {
    projectionData.push({
      year: `Yr ${yr}`,
      Conventional: Math.round(convCumulative),
      Sustainable: Math.round(greenCumulative),
    });
    convCumulative += (annualEnergyBill + annualWaterBill) * 5;
    greenCumulative += ((annualEnergyBill - annualEnergySaved) + (annualWaterBill - annualWaterSaved)) * 5;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-paper">
      <AppSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink2/70 font-semibold">
            Financial & Environmental Feasibility
          </span>
          <h1 className="text-3xl font-extrabold text-ink font-sans tracking-tight">
            Cost & Environmental Savings Analysis
          </h1>
          <p className="text-xs text-ink2/70 font-sans mt-0.5">
            Model green construction capital premiums against annual operational utility savings and return on investment (ROI).
          </p>
        </div>

        {/* 4 Financial Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-2">
            <span className="text-xs font-mono uppercase text-ink2/60">Incremental Green CapEx</span>
            <div className="text-3xl font-extrabold font-mono text-ink">${additionalCapex.toLocaleString()}</div>
            <p className="text-[11px] text-ink2/60 font-sans">Net upfront green design premium after tax incentives</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-2">
            <span className="text-xs font-mono uppercase text-ink2/60">Annual Operational Savings</span>
            <div className="text-3xl font-extrabold font-mono text-emeraldGreen">+${totalAnnualSavings.toLocaleString()}/yr</div>
            <p className="text-[11px] text-ink2/60 font-sans">Reduced electricity and municipal water utility bills</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-2">
            <span className="text-xs font-mono uppercase text-ink2/60">Estimated Payback Period</span>
            <div className="text-3xl font-extrabold font-mono text-forest">{paybackYears} Years</div>
            <p className="text-[11px] text-ink2/60 font-sans">Rapid return on initial sustainable investment</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-sm space-y-2">
            <span className="text-xs font-mono uppercase text-ink2/60">25-Year Net Benefit</span>
            <div className="text-3xl font-extrabold font-mono text-lime font-bold bg-ink px-3 py-1 rounded-xl inline-block">
              +${twentyFiveYearNetSavings.toLocaleString()}
            </div>
            <p className="text-[11px] text-ink2/60 font-sans">Long-term cumulative lifecycle cost advantage</p>
          </div>
        </div>

        {/* Interactive Modeling Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sliders Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-ink font-sans pb-3 border-b border-ink/5">
              Financial Assumptions
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ink2/80 flex justify-between">
                <span>Baseline Construction Budget:</span>
                <span className="text-ink font-bold">${initialCapital.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="250000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ink2/80 flex justify-between">
                <span>Green Design Premium:</span>
                <span className="text-forest font-bold">{greenPremiumPct}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={greenPremiumPct}
                onChange={(e) => setGreenPremiumPct(Number(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-ink2/50 block">Industry standard green premium range: 2% - 6%</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ink2/80 flex justify-between">
                <span>Annual Base Electricity Bill:</span>
                <span className="text-ink font-bold">${annualEnergyBill.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="250000"
                step="5000"
                value={annualEnergyBill}
                onChange={(e) => setAnnualEnergyBill(Number(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ink2/80 flex justify-between">
                <span>Energy Bill Reduction (Solar + HVAC):</span>
                <span className="text-emeraldGreen font-bold">{energySavingsPct}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="75"
                step="5"
                value={energySavingsPct}
                onChange={(e) => setEnergySavingsPct(Number(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-ink2/80 flex justify-between">
                <span>Annual Base Water Bill:</span>
                <span className="text-ink font-bold">${annualWaterBill.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={annualWaterBill}
                onChange={(e) => setAnnualWaterBill(Number(e.target.value))}
                className="w-full h-2 bg-mist rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Cumulative 25-Year Cost Projection Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink2/60 font-semibold block">
                Lifecycle Financial Analysis
              </span>
              <h3 className="text-lg font-bold text-ink font-sans">
                25-Year Cumulative Total Cost of Ownership ($)
              </h3>
              <p className="text-xs text-ink2/70 font-sans mt-0.5">
                Conventional Construction vs EcoBuild AI Sustainable Alternative
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#10291A' }} />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11, fill: '#10291A' }}
                  />
                  <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="Conventional" stroke="#B91C1C" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Sustainable" stroke="#153322" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-2xl bg-paper border border-ink/5 text-xs font-sans text-ink2/80 leading-relaxed">
              <strong>Takeaway:</strong> While sustainable construction carries a small initial CapEx premium of ${additionalCapex.toLocaleString()}, operational efficiency compounds each year, delivering a net surplus of <strong>+${tenYearNetSavings.toLocaleString()}</strong> by year 10.
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
