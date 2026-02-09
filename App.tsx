import React, { useState, useEffect } from 'react';
import { analyzeIdea } from './services/gemini';
import { AnalysisResult, HistoryItem, PhysicalProperties, PhysicsDomain } from './types';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { ModelEditor } from './components/ModelEditor';
import { InfoModal } from './components/InfoModal';
import { BrainCircuit, Loader2, Sparkles, History, Trash2, ChevronRight, Terminal, Box, Settings2, PlayCircle, HelpCircle } from 'lucide-react';

const SAMPLE_IDEAS = [
    "Perpetual motion machine using magnets",
    "Dyson sphere construction using Mercury's mass",
    "Flying car using ion thrusters for city commute"
];

const DOMAINS: PhysicsDomain[] = ['General', 'Structural Integrity', 'Thermodynamics', 'Aerodynamics', 'Electromagnetism'];

export default function App() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [showEditor, setShowEditor] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  
  // State for Physics Domain
  const [selectedDomain, setSelectedDomain] = useState<PhysicsDomain>('General');

  // Default Physical Properties
  const [physicalProps, setPhysicalProps] = useState<PhysicalProperties>({
    width: 1.0,
    height: 1.0,
    depth: 1.0,
    material: 'Aluminum 6061'
  });

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('idea_validator_history');
    if (saved) {
        try {
            setHistory(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to load history");
        }
    }
  }, []);

  // Pipeline Animation Logic
  useEffect(() => {
    let interval: number;
    if (isAnalyzing) {
        setPipelineStep(0);
        interval = window.setInterval(() => {
            setPipelineStep(prev => {
                if (prev < 3) return prev + 1; // Progress up to step 3 (Reasoning) automatically
                return prev; // Wait at Reasoning/Failure Prediction until API returns
            });
        }, 1200); // 1.2s per step
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Pass physical props only if editor was opened, or always if you prefer
      const data = await analyzeIdea(input, selectedDomain, physicalProps);
      
      // Fast forward pipeline to end before showing result
      setPipelineStep(4);
      await new Promise(resolve => setTimeout(resolve, 800));

      setResult({ ...data, domain: selectedDomain });
      
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        title: input.length > 40 ? input.substring(0, 40) + '...' : input,
        result: { ...data, domain: selectedDomain }
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10); // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('idea_validator_history', JSON.stringify(updatedHistory));
      
    } catch (err: any) {
      setError(err.message || "Analysis failed due to a system error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadDemoCase = () => {
    setInput("Heavy Duty I-Beam for Skyscraper Construction");
    setPhysicalProps({
        width: 0.5,
        height: 0.5,
        depth: 4.5,
        material: "Stainless Steel"
    });
    setSelectedDomain('Structural Integrity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setInput(item.title); 
    // Restore domain if available in history, else General
    if (item.result.domain) setSelectedDomain(item.result.domain);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('idea_validator_history');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <BrainCircuit className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
                <h1 className="font-bold text-lg tracking-tight text-white">IdeaValidator<span className="text-cyan-400">.AI</span></h1>
                <p className="text-[10px] text-slate-400 font-mono leading-none uppercase tracking-widest">Physics Validation Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>v2.0.0</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE</span>
            </div>
            <button 
                onClick={() => setShowInfo(true)}
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                title="About & Support"
            >
                <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Input Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                 <div className="flex items-center gap-3">
                    <label className="block text-sm font-medium text-slate-400 font-mono uppercase tracking-wider">
                        Domain
                    </label>
                    <select 
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value as PhysicsDomain)}
                        className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
                    >
                        {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>

                <div className="flex gap-2">
                     <button 
                        onClick={loadDemoCase}
                        className="flex items-center gap-2 text-[10px] px-3 py-1.5 rounded border bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-400 transition-all font-bold tracking-wider"
                    >
                        <PlayCircle className="w-3 h-3" /> 
                        LOAD DEMO: BEAM
                    </button>
                    <button 
                        onClick={() => setShowEditor(!showEditor)}
                        className={`flex items-center gap-2 text-[10px] px-3 py-1.5 rounded border transition-all ${
                            showEditor 
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
                        }`}
                    >
                        <Box className="w-3 h-3" /> 
                        {showEditor ? 'HIDE 3D EDITOR' : 'OPEN 3D EDITOR'}
                    </button>
                </div>
            </div>

            {/* 3D Editor Area - visible only when toggled */}
            {showEditor && (
                <div className="animate-fade-in border-b border-slate-800 pb-2 mb-4">
                    <ModelEditor 
                        properties={physicalProps} 
                        onChange={setPhysicalProps} 
                        promptText={input} 
                    />
                </div>
            )}
           
            <div className="relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Terminal className="w-24 h-24 text-cyan-500" />
                </div>
                <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your system architecture, operating principles, and objectives..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed"
                />
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                 {SAMPLE_IDEAS.slice(0, 3).map((idea, i) => (
                    <button 
                        key={i}
                        onClick={() => setInput(idea)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 py-1.5 px-3 rounded-full transition-colors border border-slate-700 whitespace-nowrap"
                    >
                        {idea.length > 20 ? idea.substring(0, 20) + '...' : idea}
                    </button>
                 ))}
               </div>

               <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !input.trim()}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 whitespace-nowrap
                    ${isAnalyzing || !input.trim()
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        PROCESSING
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        RUN SIMULATION
                    </>
                )}
              </button>
            </div>
          </div>

          {/* Pipeline Visualization (Loading State) */}
          {isAnalyzing && (
            <div className="bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed p-8 animate-fade-in">
                <PipelineVisualizer currentStep={pipelineStep} />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-4">
                <div className="p-2 bg-red-500/10 rounded-full">
                    <Trash2 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold">Analysis Failed</h3>
                    <p className="text-sm opacity-80">{error}</p>
                </div>
            </div>
          )}

          {/* Results Display */}
          {!isAnalyzing && result && (
             <AnalysisDisplay result={result} />
          )}

          {!isAnalyzing && !result && !error && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-600 space-y-4 border border-slate-800/50 border-dashed rounded-2xl">
                <BrainCircuit className="w-16 h-16 opacity-20" />
                <p className="text-sm font-mono">Ready to process {selectedDomain.toLowerCase()} constraints...</p>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar / History (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <History className="w-4 h-4 text-cyan-500" />
                        Simulation Logs
                    </h2>
                    {history.length > 0 && (
                        <button onClick={clearHistory} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
                            CLEAR
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-sm text-slate-600 italic text-center py-8">No prior logs found.</p>
                    ) : (
                        history.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => loadHistoryItem(item)}
                                className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-lg p-3 transition-all group relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                    item.result.verdict === 'FEASIBLE' ? 'bg-green-500' :
                                    item.result.verdict === 'PLAUSIBLE' ? 'bg-blue-500' :
                                    item.result.verdict === 'IMPLAUSIBLE' ? 'bg-orange-500' : 'bg-red-500'
                                }`} />
                                
                                <h3 className="text-slate-300 font-medium text-xs mb-1 truncate pr-4">{item.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {item.result.domain || 'General'}
                                    </span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 ${
                                         item.result.riskScore > 0.7 ? 'text-red-400' : 'text-green-400'
                                    }`}>
                                        RISK: {(item.result.riskScore * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-700 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))
                    )}
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-900/20 to-slate-900 border border-cyan-500/10 rounded-2xl p-6">
                <h3 className="text-cyan-400 font-mono text-xs font-bold mb-2">SIMULATION TIP</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                    Try switching domains (e.g., from 'General' to 'Thermodynamics') without changing the prompt to see how the risk profile changes based on physics constraints.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}