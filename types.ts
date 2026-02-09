export enum Verdict {
  FEASIBLE = 'FEASIBLE',
  PLAUSIBLE = 'PLAUSIBLE',
  IMPLAUSIBLE = 'IMPLAUSIBLE',
  IMPOSSIBLE = 'IMPOSSIBLE',
}

export type PhysicsDomain = 
  | 'General' 
  | 'Structural Integrity' 
  | 'Thermodynamics' 
  | 'Aerodynamics' 
  | 'Electromagnetism'
  | 'Fluid Dynamics'
  | 'Quantum Mechanics'
  | 'Relativistic Physics'
  | 'Acoustics'
  | 'Optics'
  | 'Chemical Kinetics'
  | 'Biomechanics'
  | 'Astrophysics'
  | 'Geophysics'
  | 'Material Science'
  | 'Nuclear Physics'
  | 'Plasma Physics'
  | 'Cybernetics'
  | 'Control Theory'
  | 'Orbital Mechanics'
  | 'Nanotechnology'
  | 'Cryogenics'
  | 'High Energy Physics'
  | 'Meteorology'
  | 'Hydrodynamics';

export interface PhysicalProperties {
  width: number;
  height: number;
  depth: number;
  material: string;
}

export interface EnvironmentalConditions {
  temperature: number; // Celsius
  pressure: number; // Atmospheres
  gravity: number; // m/s^2 relative to Earth (9.81)
  humidity: number; // Percentage
  windSpeed: number; // m/s
  atmosphere: string; // Composition (e.g., "Earth Standard", "Mars CO2", "Vacuum")
}

export type PrimitiveType = 'box' | 'cylinder' | 'sphere' | 'cone' | 'capsule';

export interface BlueprintPart {
  id: string;
  type: PrimitiveType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  name: string;
}

export interface FailureMode {
  scenario: string;
  probability: string; // "Low" | "Medium" | "High" | "Certain"
  impact: string; // "Minor" | "Major" | "Catastrophic"
  mitigation?: string;
}

export interface Manufacturability {
  rating: 'High' | 'Medium' | 'Low' | 'None';
  assessment: string;
}

export interface AnalysisResult {
  summary: string;
  riskScore: number; // 0.0 to 1.0
  verdict: Verdict;
  domain: PhysicsDomain; // Track which domain was analyzed
  scores: {
    physics: number; // 0-100
    engineering: number; // 0-100
    economics: number; // 0-100
    safety: number; // 0-100
  };
  // AEGIS Specific Fields
  componentBreakdown: string[];
  appliedPhysicsLaws: string[];
  keyCalculations: string[];
  manufacturability: Manufacturability;
  
  violatedConstraints: string[]; // Physics/Math laws broken
  failureModes: FailureMode[];
  optimizations: string[]; // New field for optimization steps
  reasoning: string; // Markdown supported
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  title: string;
  result: AnalysisResult;
}