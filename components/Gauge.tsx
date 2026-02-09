import React from 'react';

interface GaugeProps {
  value: number; // 0 to 1
  label: string;
}

export const Gauge: React.FC<GaugeProps> = ({ value, label }) => {
  const percentage = Math.min(Math.max(value, 0), 1);
  const rotation = percentage * 180;
  
  // Color calculation based on risk
  let colorClass = "text-green-500";
  if (percentage > 0.4) colorClass = "text-yellow-500";
  if (percentage > 0.7) colorClass = "text-red-500";

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
      <div className="relative w-40 h-20 overflow-hidden mb-2">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-800 rounded-t-full"></div>
        <div 
          className={`absolute top-full left-0 w-full h-full origin-top transform transition-transform duration-1000 ease-out ${colorClass.replace('text', 'bg')}`}
          style={{ transform: `rotate(${rotation - 180}deg)`, transformOrigin: 'top center' }}
        ></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-slate-900 rounded-t-full flex items-end justify-center pb-2">
           <span className={`text-2xl font-mono font-bold ${colorClass}`}>
            {(percentage * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
};