import React from 'react';
import { Box, Atom, BrainCircuit, AlertTriangle, TrendingUp, Check } from 'lucide-react';

interface Props {
  currentStep: number; // 0 to 4
}

const STEPS = [
  { icon: Box, label: "3D Model" },
  { icon: Atom, label: "Physics Sim" },
  { icon: BrainCircuit, label: "Reasoning" },
  { icon: AlertTriangle, label: "Failure Pred" },
  { icon: TrendingUp, label: "Optimization" },
];

export const PipelineVisualizer: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="relative flex justify-between items-center">
        
        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full -z-10" />

        {/* Active Line Progress */}
        <div 
            className="absolute top-1/2 left-0 h-1 bg-cyan-500 -translate-y-1/2 rounded-full -z-10 transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <div 
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                  isActive 
                    ? 'bg-cyan-500/20 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                    : isCompleted 
                    ? 'bg-slate-900 border-cyan-800 text-cyan-500' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                {isCompleted ? (
                   <Check className="w-6 h-6" />
                ) : (
                   <Icon className={`w-6 h-6 ${isActive ? 'text-cyan-400 animate-pulse' : ''}`} />
                )}
                
                {/* Active Indicator Dot */}
                {isActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                )}
              </div>
              
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold transition-colors duration-300 ${
                isActive ? 'text-cyan-400' : isCompleted ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center h-6">
        <p className="font-mono text-cyan-500 text-sm animate-pulse">
            {STEPS[currentStep]?.label === "3D Model" && "Constructing conceptual geometry..."}
            {STEPS[currentStep]?.label === "Physics Sim" && "Applying thermodynamic constraints..."}
            {STEPS[currentStep]?.label === "Reasoning" && "Evaluating logical coherence..."}
            {STEPS[currentStep]?.label === "Failure Pred" && "Stress testing for break points..."}
            {STEPS[currentStep]?.label === "Optimization" && "Synthesizing improvements..."}
        </p>
      </div>
    </div>
  );
};