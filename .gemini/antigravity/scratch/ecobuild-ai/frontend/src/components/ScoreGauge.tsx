import React from 'react';

interface ScoreGaugeProps {
  score: number;
  classification?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, classification, size = 'md' }) => {
  const radius = size === 'lg' ? 70 : size === 'sm' ? 38 : 55;
  const strokeWidth = size === 'lg' ? 12 : size === 'sm' ? 8 : 10;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(Math.max(score || 0, 0), 100);
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = '#E11D48'; // Needs Improvement
  let badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
  let ratingLabel = classification || 'Needs Improvement';

  if (clampedScore >= 90) {
    colorClass = '#10B981'; // Emerald (Platinum)
    badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (!classification) ratingLabel = 'Platinum';
  } else if (clampedScore >= 75) {
    colorClass = '#84CC16'; // Lime (Gold)
    badgeBg = 'bg-lime-100 text-lime-900 border-lime-300';
    if (!classification) ratingLabel = 'Gold';
  } else if (clampedScore >= 60) {
    colorClass = '#0EA5E9'; // Sky (Silver)
    badgeBg = 'bg-sky-100 text-sky-800 border-sky-300';
    if (!classification) ratingLabel = 'Silver';
  } else if (clampedScore >= 50) {
    colorClass = '#F59E0B'; // Amber (Certified)
    badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
    if (!classification) ratingLabel = 'Certified';
  }

  const dim = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        <svg className="transform -rotate-90" width={dim} height={dim}>
          {/* Background circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#E7EBE8"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-mono font-extrabold ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'} text-ink`}>
            {clampedScore}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink2/60 -mt-1">
            /100
          </span>
        </div>
      </div>

      <div className="mt-2">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${badgeBg}`}>
          {ratingLabel}
        </span>
      </div>
    </div>
  );
};
