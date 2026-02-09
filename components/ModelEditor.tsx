import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Center, Text, Html, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { PhysicalProperties, BlueprintPart, PrimitiveType } from '../types';
import { Box, Layers, Maximize, Ruler, Sparkles, Wand2, RefreshCw, AlertTriangle, Play, Activity, Gauge, Undo, Redo, Plus, Trash2, Edit3, Move, Rotate3D, Scaling, Palette, MousePointer2 } from 'lucide-react';
import { generateBlueprint } from '../services/gemini';

// JSX.IntrinsicElements are automatically extended by @react-three/fiber

interface ModelEditorProps {
  properties: PhysicalProperties;
  onChange: (props: PhysicalProperties) => void;
  promptText: string;
}

const MATERIALS = [
  { name: 'Generic Polymer', density: '1.2 g/cm³', color: '#22d3ee' },
  { name: 'Carbon Fiber', density: '1.6 g/cm³', color: '#171717' },
  { name: 'Aluminum 6061', density: '2.7 g/cm³', color: '#94a3b8' },
  { name: 'Titanium Grade 5', density: '4.43 g/cm³', color: '#64748b' },
  { name: 'Stainless Steel', density: '7.9 g/cm³', color: '#cbd5e1' },
  { name: 'Aerogel', density: '0.02 g/cm³', color: '#e0f2fe' },
];

interface PrimitiveMeshProps {
    part: BlueprintPart;
    simulating: boolean;
    isSelected: boolean;
    onSelect: (id: string) => void;
    transformMode: 'translate' | 'rotate' | 'scale';
    onPartUpdate: (id: string, updates: Partial<BlueprintPart>) => void;
}

const PrimitiveMesh: React.FC<PrimitiveMeshProps> = ({ 
    part, 
    simulating, 
    isSelected, 
    onSelect,
    transformMode,
    onPartUpdate
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const originalScale = useRef(new THREE.Vector3(...part.scale));
    const baseColor = useRef(new THREE.Color(part.color));
    const [isDragging, setIsDragging] = useState(false);
    
    // Update refs when props change (for editing from sidebar or simulation init)
    useEffect(() => {
        originalScale.current.set(...part.scale);
        baseColor.current.set(part.color);
    }, [part.scale, part.color]);

    // Sync Props to Mesh (when not dragging and not simulating)
    useEffect(() => {
        if (meshRef.current && !simulating && !isDragging) {
            meshRef.current.position.set(...part.position);
            meshRef.current.rotation.set(...part.rotation);
            meshRef.current.scale.set(...part.scale);
            
            if (meshRef.current.material) {
                // @ts-ignore
                meshRef.current.material.color.set(part.color);
                // @ts-ignore
                meshRef.current.material.emissive.setHex(isSelected ? 0x22d3ee : 0x000000);
                // @ts-ignore
                meshRef.current.material.emissiveIntensity = isSelected ? 0.4 : 0;
            }
        }
    }, [part, simulating, isDragging, isSelected]);

    // Simulation Loop (Visual Effects only)
    useFrame((state) => {
        if (!meshRef.current || !simulating) return;

        const time = state.clock.elapsedTime;
        
        // 1. Vibration
        const shakeIntensity = 0.03;
        meshRef.current.position.x = part.position[0] + (Math.random() - 0.5) * shakeIntensity;
        meshRef.current.position.y = part.position[1] + (Math.random() - 0.5) * shakeIntensity;
        meshRef.current.position.z = part.position[2] + (Math.random() - 0.5) * shakeIntensity;

        // 2. Deformation
        const pulse = Math.sin(time * 15) * 0.05 + 1;
        meshRef.current.scale.y = originalScale.current.y * pulse;
        meshRef.current.scale.x = originalScale.current.x * (1 + (1-pulse)*0.3);

        // 3. Stress Color
        const stressLevel = (Math.sin(time * 2) + 1) / 2;
        if (meshRef.current.material) {
            // @ts-ignore
            meshRef.current.material.color.lerpColors(baseColor.current, new THREE.Color('#ef4444'), stressLevel * 0.8);
            // @ts-ignore
            meshRef.current.material.emissive.setHex(0xff2200);
            // @ts-ignore
            meshRef.current.material.emissiveIntensity = stressLevel * 0.5;
        }
    });

    const handleTransformEnd = () => {
        if (meshRef.current) {
            const p = meshRef.current.position;
            const r = meshRef.current.rotation;
            const s = meshRef.current.scale;
            
            onPartUpdate(part.id, {
                position: [Number(p.x.toFixed(2)), Number(p.y.toFixed(2)), Number(p.z.toFixed(2))],
                rotation: [Number(r.x.toFixed(2)), Number(r.y.toFixed(2)), Number(r.z.toFixed(2))],
                scale: [Number(s.x.toFixed(2)), Number(s.y.toFixed(2)), Number(s.z.toFixed(2))]
            });
        }
    };

    return (
        <group>
            <mesh 
                ref={meshRef}
                position={part.position} 
                rotation={part.rotation} 
                scale={part.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(part.id);
                }}
            >
                {part.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
                {part.type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
                {part.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
                {part.type === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
                {part.type === 'capsule' && <capsuleGeometry args={[0.5, 1, 4, 8]} />}
                
                <meshStandardMaterial 
                    color={part.color} 
                    metalness={0.6} 
                    roughness={0.3}
                    transparent
                    opacity={0.95}
                />
            </mesh>

            {isSelected && !simulating && meshRef.current && (
                 <TransformControls 
                    object={meshRef.current}
                    mode={transformMode}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => {
                        setIsDragging(false);
                        handleTransformEnd();
                    }}
                    size={0.8}
                    space="local"
                 />
            )}
        </group>
    );
};

const SimulationHUD = () => {
    const [load, setLoad] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            // Random fluctuate around high load
            setLoad(85 + Math.random() * 14);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <Html position={[0, 3, 0]} center>
            <div className="flex gap-4 pointer-events-none">
                <div className="bg-slate-900/90 text-red-500 border border-red-500/50 p-3 rounded-lg backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.3)] min-w-[140px]">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold uppercase">Structural Load</span>
                    </div>
                    <div className="text-2xl font-mono font-bold tracking-tighter">
                        {load.toFixed(1)}%
                    </div>
                    <div className="w-full h-1 bg-red-900 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${load}%` }} />
                    </div>
                </div>

                <div className="bg-slate-900/90 text-cyan-500 border border-cyan-500/50 p-3 rounded-lg backdrop-blur-md min-w-[140px]">
                    <div className="flex items-center gap-2 mb-1">
                        <Gauge className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold uppercase">Vibration Freq</span>
                    </div>
                    <div className="text-2xl font-mono font-bold tracking-tighter">
                        {(Math.random() * 5 + 12).toFixed(1)} Hz
                    </div>
                     <div className="text-[10px] text-cyan-400/60 font-mono mt-1">
                        NOMINAL
                    </div>
                </div>
            </div>
        </Html>
    );
}

const PrototypeMesh = ({ width, height, depth, color }: { width: number, height: number, depth: number, color: string }) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Simple floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + (height / 2);
    }
  });

  return (
    <group>
        <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.9} 
            metalness={0.5} 
            roughness={0.2}
        />
        </mesh>
        
        {/* Wireframe Box Helper */}
        <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[width + 0.02, height + 0.02, depth + 0.02]} />
            <meshStandardMaterial color="white" wireframe opacity={0.1} transparent />
        </mesh>
    </group>
  );
};

export const ModelEditor: React.FC<ModelEditorProps> = ({ properties, onChange, promptText }) => {
  const [mode, setMode] = useState<'manual' | 'blueprint'>('manual');
  const [blueprint, setBlueprint] = useState<BlueprintPart[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  
  // History State
  const [history, setHistory] = useState<BlueprintPart[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDimensionChange = (key: keyof PhysicalProperties, value: number) => {
    onChange({ ...properties, [key]: parseFloat(value.toFixed(1)) });
  };

  const pushHistory = (newParts: BlueprintPart[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newParts);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setBlueprint(newParts);
  };

  const handleGenerateBlueprint = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setMode('blueprint');
    setError(null);
    setBlueprint([]); 
    setIsSimulating(false); // Reset sim on new gen
    setSelectedPartId(null);
    
    try {
        const parts = await generateBlueprint(promptText);
        if (parts && parts.length > 0) {
            pushHistory(parts);
        } else {
            setError("Could not architect structure. Try a simpler prompt.");
            setBlueprint(history[historyIndex] || []);
        }
    } catch (e) {
        console.error("Blueprint generation failed", e);
        setError("Generation failed or API quota exceeded. Please try again.");
        setBlueprint(history[historyIndex] || []);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setBlueprint(history[newIndex]);
          setIsSimulating(false);
          setSelectedPartId(null);
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setBlueprint(history[newIndex]);
          setIsSimulating(false);
          setSelectedPartId(null);
      }
  };

  const toggleSimulation = () => {
      setIsSimulating(!isSimulating);
  };

  // --- Editing Functions ---

  const handleAddPart = () => {
      const newPart: BlueprintPart = {
          id: crypto.randomUUID(),
          type: 'box',
          name: `New Part ${blueprint.length + 1}`,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          color: '#22d3ee'
      };
      const newBlueprint = [...blueprint, newPart];
      pushHistory(newBlueprint);
      setSelectedPartId(newPart.id);
  };

  const handleRemovePart = (id: string) => {
      const newBlueprint = blueprint.filter(p => p.id !== id);
      pushHistory(newBlueprint);
      if (selectedPartId === id) setSelectedPartId(null);
  };

  const handleUpdatePart = (id: string, updates: Partial<BlueprintPart>) => {
      const newBlueprint = blueprint.map(p => p.id === id ? { ...p, ...updates } : p);
      pushHistory(newBlueprint);
  };

  // Simplified update for sliders to avoid history spam
  const handleRapidUpdatePart = (id: string, updates: Partial<BlueprintPart>) => {
       const newBlueprint = blueprint.map(p => p.id === id ? { ...p, ...updates } : p);
       setBlueprint(newBlueprint);
       // Update history tip without advancing
       const newHistory = [...history];
       newHistory[historyIndex] = newBlueprint;
       setHistory(newHistory);
  };

  const selectedPart = blueprint.find(p => p.id === selectedPartId);
  const currentMaterial = MATERIALS.find(m => m.name === properties.material) || MATERIALS[0];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[600px] w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
      
      {/* 3D Viewport */}
      <div 
        className="relative flex-1 bg-slate-950 min-h-[300px]" 
        onClick={() => setSelectedPartId(null)}
      >
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-auto">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300">
                    {mode === 'manual' ? `ISO VIEW // ${properties.material}` : 'GENERATIVE BLUEPRINT'}
                </span>
            </div>
            {isSimulating && (
                 <div className="flex items-center gap-2 bg-red-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-red-500/50 pointer-events-auto animate-pulse">
                    <Activity className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-mono text-red-100">STRESS TEST ACTIVE</span>
                </div>
            )}
        </div>

        {/* 3D Transform Toolbar */}
        {selectedPart && !isSimulating && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-slate-900/90 backdrop-blur border border-slate-700 p-1 rounded-lg shadow-xl">
                 <button 
                    onClick={(e) => { e.stopPropagation(); setTransformMode('translate'); }}
                    className={`p-2 rounded hover:bg-slate-700 transition-colors ${transformMode === 'translate' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                    title="Translate (Move)"
                >
                    <Move className="w-4 h-4" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setTransformMode('rotate'); }}
                    className={`p-2 rounded hover:bg-slate-700 transition-colors ${transformMode === 'rotate' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                    title="Rotate"
                >
                    <Rotate3D className="w-4 h-4" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setTransformMode('scale'); }}
                    className={`p-2 rounded hover:bg-slate-700 transition-colors ${transformMode === 'scale' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
                    title="Scale"
                >
                    <Scaling className="w-4 h-4" />
                </button>
            </div>
        )}
        
        <Canvas className="w-full h-full" camera={{ position: [5, 5, 8], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="white" />
          
          <Suspense fallback={null}>
            <group position={[0, -0.5, 0]}>
                {mode === 'manual' ? (
                    <PrototypeMesh 
                        width={properties.width} 
                        height={properties.height} 
                        depth={properties.depth}
                        color={currentMaterial.color}
                    />
                ) : (
                    <group>
                        {blueprint.map(part => (
                            <PrimitiveMesh 
                                key={part.id} 
                                part={part} 
                                simulating={isSimulating} 
                                isSelected={selectedPartId === part.id}
                                onSelect={setSelectedPartId}
                                transformMode={transformMode}
                                onPartUpdate={handleUpdatePart}
                            />
                        ))}
                    </group>
                )}
                
                {isSimulating && mode === 'blueprint' && <SimulationHUD />}

                <Center position={[0, 0, 0]}>
                    <Grid infiniteGrid sectionSize={1} cellThickness={0.5} sectionThickness={1} fadeDistance={20} sectionColor="#1e293b" cellColor="#0f172a" />
                </Center>
            </group>
            
            {mode === 'blueprint' && blueprint.length === 0 && !isGenerating && (
                 <Html position={[0, 1, 0]} center>
                    <div className="text-slate-500 text-xs font-mono bg-slate-900/80 p-2 rounded border border-slate-800 backdrop-blur whitespace-nowrap">
                        Waiting for blueprint data...
                    </div>
                 </Html>
            )}
          </Suspense>

          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>

        {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-20">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span className="text-sm font-mono text-cyan-400">Architecting Structure...</span>
                </div>
            </div>
        )}
        
        {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20">
                <div className="flex flex-col items-center gap-3 text-red-400 p-4 bg-slate-900 border border-red-900 rounded-xl">
                    <AlertTriangle className="w-8 h-8" />
                    <span className="text-sm font-mono">{error}</span>
                    <button 
                        onClick={() => { setError(null); setMode('manual'); }}
                        className="mt-2 text-xs bg-red-900/30 hover:bg-red-900/50 px-3 py-1.5 rounded transition-colors"
                    >
                        Return to Manual
                    </button>
                </div>
            </div>
        )}

        {/* Dimensions Overlay */}
        <div className="absolute bottom-4 right-4 text-right pointer-events-none">
             {mode === 'manual' && (
                <div className="text-4xl font-mono font-bold text-slate-700 opacity-20">
                    {properties.width}x{properties.height}x{properties.depth}
                </div>
             )}
             {mode === 'blueprint' && blueprint.length > 0 && (
                 <div className="text-2xl font-mono font-bold text-slate-700 opacity-20">
                    {blueprint.length} PARTS
                </div>
             )}
        </div>
      </div>

      {/* Controls Panel */}
      <div className="w-full md:w-80 bg-slate-900 p-4 border-l border-slate-800 flex flex-col gap-4 overflow-hidden">
        
        {/* Generative Toggle */}
        <div className="bg-slate-800/50 p-1 rounded-lg flex shrink-0">
            <button 
                onClick={() => setMode('manual')}
                className={`flex-1 text-[10px] font-bold py-2 rounded transition-colors ${mode === 'manual' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                MANUAL BOX
            </button>
            <button 
                onClick={() => setMode('blueprint')}
                className={`flex-1 text-[10px] font-bold py-2 rounded transition-colors flex items-center justify-center gap-1 ${mode === 'blueprint' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Sparkles className="w-3 h-3" />
                BLUEPRINT
            </button>
        </div>

        {mode === 'blueprint' ? (
            <div className="flex flex-col h-full overflow-hidden">
                 
                 {/* Generation Box */}
                 <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg space-y-3 shrink-0 mb-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleUndo}
                            disabled={historyIndex === 0 || isGenerating}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded border border-slate-700 flex items-center justify-center transition-all group"
                            title="Undo"
                        >
                            <Undo className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={handleRedo}
                            disabled={historyIndex === history.length - 1 || isGenerating}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded border border-slate-700 flex items-center justify-center transition-all group"
                            title="Redo"
                        >
                            <Redo className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={handleAddPart}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-green-400 rounded border border-slate-700 flex items-center justify-center transition-all"
                            title="Add Part"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    <button
                        onClick={handleGenerateBlueprint}
                        disabled={!promptText.trim() || isGenerating}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all"
                    >
                        <Wand2 className="w-3 h-3" />
                        {blueprint.length > 0 ? 'RE-GENERATE' : 'AUTO-BUILD 3D'}
                    </button>
                 </div>

                 {/* Editor Panel */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4">
                     
                     {selectedPart ? (
                         <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 space-y-4 animate-fade-in">
                             <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                 <div className="flex items-center gap-2">
                                     <Edit3 className="w-3 h-3 text-cyan-400" />
                                     <span className="text-xs font-bold text-slate-200">Edit Component</span>
                                 </div>
                                 <button 
                                    onClick={() => handleRemovePart(selectedPart.id)}
                                    className="text-red-400 hover:text-red-300 p-1"
                                 >
                                     <Trash2 className="w-3 h-3" />
                                 </button>
                             </div>

                             {/* Sidebar Transform Mode Selector */}
                             <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                                <button onClick={() => setTransformMode('translate')} className={`flex-1 flex items-center justify-center py-1 rounded text-[10px] ${transformMode === 'translate' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                                    <Move className="w-3 h-3 mr-1" /> Move
                                </button>
                                <button onClick={() => setTransformMode('rotate')} className={`flex-1 flex items-center justify-center py-1 rounded text-[10px] ${transformMode === 'rotate' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                                    <Rotate3D className="w-3 h-3 mr-1" /> Rotate
                                </button>
                                <button onClick={() => setTransformMode('scale')} className={`flex-1 flex items-center justify-center py-1 rounded text-[10px] ${transformMode === 'scale' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                                    <Scaling className="w-3 h-3 mr-1" /> Scale
                                </button>
                             </div>

                             <div className="space-y-3">
                                 {/* Name & Type */}
                                 <div className="grid grid-cols-2 gap-2">
                                     <div className="space-y-1">
                                         <label className="text-[10px] text-slate-500 font-mono">Name</label>
                                         <input 
                                            type="text" 
                                            value={selectedPart.name} 
                                            onChange={(e) => handleUpdatePart(selectedPart.id, { name: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                                         />
                                     </div>
                                     <div className="space-y-1">
                                         <label className="text-[10px] text-slate-500 font-mono">Type</label>
                                         <select 
                                            value={selectedPart.type}
                                            onChange={(e) => handleUpdatePart(selectedPart.id, { type: e.target.value as PrimitiveType })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                                         >
                                             {['box', 'cylinder', 'sphere', 'cone', 'capsule'].map(t => <option key={t} value={t}>{t}</option>)}
                                         </select>
                                     </div>
                                 </div>

                                 {/* Position */}
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                        <Move className="w-3 h-3" /> Position (x,y,z)
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        {[0, 1, 2].map(axis => (
                                            <input 
                                                key={`pos-${axis}`}
                                                type="number" 
                                                step="0.1"
                                                value={selectedPart.position[axis]}
                                                onChange={(e) => {
                                                    const newPos = [...selectedPart.position] as [number, number, number];
                                                    newPos[axis] = parseFloat(e.target.value);
                                                    handleRapidUpdatePart(selectedPart.id, { position: newPos });
                                                }}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-xs text-slate-200 text-center"
                                            />
                                        ))}
                                    </div>
                                 </div>

                                 {/* Scale */}
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                        <Scaling className="w-3 h-3" /> Scale (x,y,z)
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        {[0, 1, 2].map(axis => (
                                            <input 
                                                key={`scale-${axis}`}
                                                type="number" 
                                                step="0.1"
                                                value={selectedPart.scale[axis]}
                                                onChange={(e) => {
                                                    const newScale = [...selectedPart.scale] as [number, number, number];
                                                    newScale[axis] = parseFloat(e.target.value);
                                                    handleRapidUpdatePart(selectedPart.id, { scale: newScale });
                                                }}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-xs text-slate-200 text-center"
                                            />
                                        ))}
                                    </div>
                                 </div>

                                 {/* Rotation */}
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                        <Rotate3D className="w-3 h-3" /> Rotation (rad)
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        {[0, 1, 2].map(axis => (
                                            <input 
                                                key={`rot-${axis}`}
                                                type="number" 
                                                step="0.1"
                                                value={selectedPart.rotation[axis]}
                                                onChange={(e) => {
                                                    const newRot = [...selectedPart.rotation] as [number, number, number];
                                                    newRot[axis] = parseFloat(e.target.value);
                                                    handleRapidUpdatePart(selectedPart.id, { rotation: newRot });
                                                }}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-1 py-1 text-xs text-slate-200 text-center"
                                            />
                                        ))}
                                    </div>
                                 </div>

                                 {/* Color */}
                                 <div className="space-y-1">
                                     <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                        <Palette className="w-3 h-3" /> Color
                                    </div>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color" 
                                            value={selectedPart.color}
                                            onChange={(e) => handleRapidUpdatePart(selectedPart.id, { color: e.target.value })}
                                            className="h-6 w-8 rounded bg-transparent cursor-pointer"
                                        />
                                        <input 
                                            type="text"
                                            value={selectedPart.color}
                                            onChange={(e) => handleUpdatePart(selectedPart.id, { color: e.target.value })}
                                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono uppercase"
                                        />
                                    </div>
                                 </div>

                             </div>
                         </div>
                     ) : (
                         <div className="space-y-2">
                             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-900 py-1">
                                 Component List ({blueprint.length})
                             </h4>
                             {blueprint.length === 0 ? (
                                 <p className="text-xs text-slate-600 italic p-4 text-center">No parts. Click '+' to add one.</p>
                             ) : (
                                 blueprint.map((part) => (
                                     <button 
                                        key={part.id} 
                                        onClick={() => setSelectedPartId(part.id)}
                                        className={`w-full flex items-center gap-2 text-[10px] p-2 rounded border transition-all ${
                                            selectedPartId === part.id 
                                            ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-200' 
                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                        }`}
                                     >
                                         <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: part.color }} />
                                         <span className="flex-1 text-left truncate">{part.name}</span>
                                         <span className="text-slate-500 font-mono uppercase text-[9px]">{part.type}</span>
                                     </button>
                                 ))
                             )}
                         </div>
                     )}
                 </div>
                
                 {/* Simulation Button */}
                 {blueprint.length > 0 && (
                     <div className="pt-3 border-t border-slate-800 shrink-0">
                        <button
                            onClick={toggleSimulation}
                            className={`w-full py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${
                                isSimulating 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}
                        >
                            {isSimulating ? (
                                <>STOP SIMULATION</>
                            ) : (
                                <>
                                    <Play className="w-3 h-3" /> RUN STRESS TEST
                                </>
                            )}
                        </button>
                     </div>
                 )}
            </div>
        ) : (
            <>
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-4 font-mono uppercase tracking-wider">
                        <Box className="w-3 h-3 text-cyan-500" /> Geometry Control
                    </h3>
                    
                    <div className="space-y-4">
                        {['width', 'height', 'depth'].map((dim) => (
                            <div key={dim}>
                                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono uppercase">
                                    <span>{dim} (m)</span>
                                    <span className="text-cyan-400">{properties[dim as keyof PhysicalProperties]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5.0"
                                    step="0.1"
                                    value={properties[dim as keyof PhysicalProperties]}
                                    onChange={(e) => handleDimensionChange(dim as keyof PhysicalProperties, parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-800 pt-5 mt-5">
                        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2