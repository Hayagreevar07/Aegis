import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult, Verdict } from '../types';
import { Gauge } from './Gauge';
import { AnalysisRadar } from './RadarChart';
import { AlertTriangle, CheckCircle, XCircle, Zap, ShieldAlert, Activity, TrendingUp, ArrowRight, Download, Atom, Calculator, Wrench, Layers } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

export const AnalysisDisplay: React.FC<Props> = ({ result }) => {
  const radarData = [
    { subject: 'Physics', A: result.scores.physics, fullMark: 100 },
    { subject: 'Engineering', A: result.scores.engineering, fullMark: 100 },
    { subject: 'Economics', A: result.scores.economics, fullMark: 100 },
    { subject: 'Safety', A: result.scores.safety, fullMark: 100 },
  ];

  const getVerdictColor = (v: Verdict) => {
    switch (v) {
      case Verdict.FEASIBLE: return "text-green-400 border-green-400/30 bg-green-400/10";
      case Verdict.PLAUSIBLE: return "text-blue-400 border-blue-400/30 bg-blue-400/10";
      case Verdict.IMPLAUSIBLE: return "text-orange-400 border-orange-400/30 bg-orange-400/10";
      case Verdict.IMPOSSIBLE: return "text-red-500 border-red-500/30 bg-red-500/10";
      default: return "text-slate-400";
    }
  };

  const getVerdictIcon = (v: Verdict) => {
    switch (v) {
      case Verdict.FEASIBLE: return <CheckCircle className="w-8 h-8" />;
      case Verdict.PLAUSIBLE: return <Activity className="w-8 h-8" />;
      case Verdict.IMPLAUSIBLE: return <AlertTriangle className="w-8 h-8" />;
      case Verdict.IMPOSSIBLE: return <XCircle className="w-8 h-8" />;
    }
  };

  const handleExport = () => {
    const report = `# AEGIS Engineering Report: ${result.verdict}
    
**Summary:** ${result.summary}
**Risk Score:** ${(result.riskScore * 100).toFixed(0)}%
**Domain:** ${result.domain || 'General'}

## System Metrics
- Physics: ${result.scores.physics}/100
- Engineering: ${result.scores.engineering}/100
- Economics: ${result.scores.economics}/100
- Safety: ${result.scores.safety}/100

## Manufacturability
- Rating: ${result.manufacturability.rating}
- Assessment: ${result.manufacturability.assessment}

## Component Breakdown
${result.componentBreakdown.map(c => `- ${c}`).join('\n')}

## Physics Laws Applied
${result.appliedPhysicsLaws.map(l => `- ${l}`).join('\n')}

## Key Calculations
${result.keyCalculations.map(k => `- ${k}`).join('\n')}

## Detailed Logic
${result.reasoning}

## Critical Violations
${result.violatedConstraints.map(c => `- ${c}`).join('\n')}

## Failure Modes
${result.failureModes.map(f => `- [${f.impact}] ${f.scenario} (Prob: ${f.probability})`).join('\n')}

## Optimizations
${result.optimizations.map(o => `- ${o}`).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AEGIS-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-200">AEGIS Analysis Results</h2>
            <p className="text-[10px] text-slate-500 font-mono">AUTONOMOUS ENGINEERING GENERATED INTEGRITY SYSTEM</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" /> EXPORT REPORT
          </button>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Verdict Card */}
        <div className={`col-span-1 p-6 rounded-xl border flex flex-col items-center justify-center space-y-2 ${getVerdictColor(result.verdict)}`}>
          {getVerdictIcon(result.verdict)}
          <h2 className="text-3xl font-bold font-mono tracking-tighter">{result.verdict}</h2>
          <span className="text-xs uppercase tracking-widest opacity-80">Final Verdict</span>
        </div>

        {/* Risk Gauge */}
        <div className="col-span-1">
          <Gauge value={result.riskScore} label="Calculated Risk Factor" />
        </div>

        {/* Radar Chart */}
        <div className="col-span-1 bg-slate-900/50 rounded-xl border border-slate-800 p-2">
            <h3 className="text-center text-xs text-slate-500 font-mono mt-2 uppercase">System Metrics</h3>
            <AnalysisRadar data={radarData} />
        </div>
      </div>

      {/* Manufacturability & Laws Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manufacturability */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <h3 className="text-slate-300 font-mono text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-500" /> Manufacturability
            </h3>
            <div className="flex items-center justify-between mb-2">
                 <span className="text-xs text-slate-500">Feasibility Rating</span>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                     result.manufacturability.rating === 'High' ? 'bg-green-500/20 text-green-400' :
                     result.manufacturability.rating === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                     'bg-red-500/20 text-red-400'
                 }`}>
                     {result.manufacturability.rating.toUpperCase()}
                 </span>
            </div>
            <p className="text-sm text-slate-400 leading-snug">
                {result.manufacturability.assessment}
            </p>
        </div>

        {/* Physics Laws */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
             <h3 className="text-slate-300 font-mono text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Atom className="w-4 h-4 text-purple-500" /> Applied Physics Laws
            </h3>
            <div className="flex flex-wrap gap-2">
                {result.appliedPhysicsLaws.map((law, i) => (
                    <span key={i} className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        {law}
                    </span>
                ))}
            </div>
        </div>
      </div>

      {/* Component Breakdown & Calculations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5">
             <h3 className="text-slate-300 font-mono text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" /> Component Decomposition
            </h3>
            <ul className="space-y-1.5">
                {result.componentBreakdown.map((comp, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="w-1 h-1 mt-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        {comp}
                    </li>
                ))}
            </ul>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5">
             <h3 className="text-slate-300 font-mono text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-pink-500" /> Mathematical Validation
            </h3>
            <div className="space-y-2">
                {result.keyCalculations.map((calc, i) => (
                    <div key={i} className="text-xs font-mono bg-slate-950 p-2 rounded border-l-2 border-pink-500/50 text-slate-300">
                        {calc}
                    </div>
                ))}
            </div>
          </div>
      </div>

      {/* Constraints & Violations */}
      {result.violatedConstraints.length > 0 && (
        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-6">
          <h3 className="flex items-center space-x-2 text-red-400 font-bold mb-4 font-mono">
            <ShieldAlert className="w-5 h-5" />
            <span>CRITICAL CONSTRAINT VIOLATIONS DETECTED</span>
          </h3>
          <ul className="space-y-2">
            {result.violatedConstraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-red-200/80 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Analysis Text */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
        <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" /> System Logic Analysis ({result.domain || 'General'})
        </h3>
        <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans leading-relaxed">
          <ReactMarkdown>{result.reasoning}</ReactMarkdown>
        </div>
      </div>

      {/* Failure Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.failureModes.map((mode, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-slate-500">FAILURE MODE #{idx + 1}</span>
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                    mode.impact === 'Catastrophic' ? 'bg-red-500/20 text-red-400' : 
                    mode.impact === 'Major' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                    {mode.impact.toUpperCase()}
                </span>
            </div>
            <h4 className="font-bold text-slate-200 mb-2">{mode.scenario}</h4>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <span className="text-slate-600">Prob:</span>
                <span className={mode.probability === 'Certain' || mode.probability === 'High' ? 'text-red-400' : 'text-slate-300'}>
                    {mode.probability}
                </span>
            </div>
            {mode.mitigation && (
                <p className="text-xs text-slate-500 mt-2 border-t border-slate-800 pt-2">
                    <span className="text-cyan-600 font-semibold">Mitigation:</span> {mode.mitigation}
                </p>
            )}
          </div>
        ))}
      </div>

      {/* Optimizations */}
      {result.optimizations && result.optimizations.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-emerald-400 font-mono text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Optimization Opportunities
            </h3>
            <div className="grid gap-3">
                {result.optimizations.map((opt, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                        <div className="mt-1 bg-emerald-500/10 p-1 rounded-full text-emerald-500">
                             <ArrowRight className="w-3 h-3" />
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{opt}</p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};