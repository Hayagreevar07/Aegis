import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, Verdict, PhysicsDomain, PhysicalProperties, BlueprintPart, EnvironmentalConditions } from "../types";

// --- API Key Management System ---
// To add backup keys, simply add them to this array.
// The system will automatically switch if one hits a rate limit.
const API_KEYS = [
  process.env.API_KEY,
  // "PASTE_YOUR_BACKUP_KEY_HERE", 
  // "PASTE_ANOTHER_BACKUP_KEY_HERE" 
].filter((key): key is string => !!key && key.length > 0);

let currentKeyIndex = 0;

const getClient = () => {
  const key = API_KEYS[currentKeyIndex];
  if (!key) throw new Error("No valid API keys found. Please check your configuration.");
  return new GoogleGenAI({ apiKey: key });
};

// Wrapper to handle API rotation
const executeWithRetry = async <T>(operation: (client: GoogleGenAI) => Promise<T>): Promise<T> => {
  let lastError: any;
  const maxAttempts = API_KEYS.length * 2; // Allow cycling through keys twice

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const client = getClient();
      return await operation(client);
    } catch (error: any) {
      lastError = error;
      const isQuotaError = error.toString().includes('429') || error.status === 429 || error.toString().includes('exhausted');
      
      if (isQuotaError) {
        console.warn(`[Gemini Service] Quota exceeded on Key #${currentKeyIndex + 1}. Switching keys...`);
        
        // Rotate Key
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        
        // If we looped back to the start (or only have 1 key), wait a bit before retrying
        if (currentKeyIndex === 0 || API_KEYS.length === 1) {
          console.warn("[Gemini Service] All keys exhausted or single key used. Waiting 2s backing off...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } else {
        // If it's a non-retriable error (like 400 Bad Request), throw immediately
        throw error;
      }
    }
  }
  throw lastError;
};

// --- Schema Definitions ---

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A concise executive summary of the analysis." },
    riskScore: { type: Type.NUMBER, description: "A calculated risk score from 0.0 (Safe) to 1.0 (Critical Failure)." },
    verdict: { type: Type.STRING, enum: [Verdict.FEASIBLE, Verdict.PLAUSIBLE, Verdict.IMPLAUSIBLE, Verdict.IMPOSSIBLE] },
    domain: { type: Type.STRING, description: "The primary physics domain used for this specific analysis." },
    scores: {
      type: Type.OBJECT,
      properties: {
        physics: { type: Type.NUMBER, description: "Adherence to physical laws (0-100)." },
        engineering: { type: Type.NUMBER, description: "Implementation feasibility (0-100)." },
        economics: { type: Type.NUMBER, description: "Cost/Value viability (0-100)." },
        safety: { type: Type.NUMBER, description: "User and environmental safety (0-100)." },
      },
      required: ["physics", "engineering", "economics", "safety"],
    },
    componentBreakdown: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of fundamental engineering components identified in Step 1."
    },
    appliedPhysicsLaws: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of specific physics laws applied in Step 2 (e.g., 'Bernoulli's Principle', 'Newton's 2nd Law')."
    },
    keyCalculations: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Strings representing math calculations from Step 3 (e.g., 'Thrust = 500kN', 'Stress = 200MPa')."
    },
    manufacturability: {
        type: Type.OBJECT,
        properties: {
            rating: { type: Type.STRING, enum: ["High", "Medium", "Low", "None"] },
            assessment: { type: Type.STRING, description: "Assessment from Step 6 regarding material availability and assembly." }
        },
        required: ["rating", "assessment"]
    },
    violatedConstraints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific physical laws, mathematical principles, or logical constraints violated.",
    },
    failureModes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING },
          probability: { type: Type.STRING, enum: ["Low", "Medium", "High", "Certain"] },
          impact: { type: Type.STRING, enum: ["Minor", "Major", "Catastrophic"] },
          mitigation: { type: Type.STRING, description: "Potential fix or 'None' if impossible." },
        },
        required: ["scenario", "probability", "impact"],
      },
    },
    optimizations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of concrete optimization steps to improve feasibility, reduce mass, increase efficiency, or lower risk.",
    },
    reasoning: { type: Type.STRING, description: "Detailed Markdown explanation of the analysis, citing specific laws (e.g., 2nd Law of Thermodynamics) and calculations where applicable." },
  },
  required: ["summary", "riskScore", "verdict", "domain", "scores", "componentBreakdown", "appliedPhysicsLaws", "keyCalculations", "manufacturability", "violatedConstraints", "failureModes", "optimizations", "reasoning"],
};

export const analyzeIdea = async (
  ideaDescription: string, 
  domain: PhysicsDomain = 'General',
  physicalProps?: PhysicalProperties,
  envConditions?: EnvironmentalConditions
): Promise<AnalysisResult> => {
  return executeWithRetry(async (client) => {
    let promptText = `Execute the AEGIS Engineering Protocol for the following concept.
              
              Input Concept: "${ideaDescription}"
              
              Target Analysis Domain: ${domain}
              (Focus specifically on ${domain} constraints and failure modes)`;

    if (physicalProps) {
        promptText += `
        
        Defined Physical Constraints:
        - Dimensions: ${physicalProps.width}m (W) x ${physicalProps.height}m (H) x ${physicalProps.depth}m (D)
        - Material: ${physicalProps.material}
        - Estimated Volume: ${(physicalProps.width * physicalProps.height * physicalProps.depth).toFixed(2)} m³
        
        INSTRUCTION: Incorporate these physical dimensions and material properties into your physics simulation (Step 4). If analyzing Structural Integrity, calculate stress based on these dimensions.`;
    }

    if (envConditions) {
        promptText += `
        
        CRITICAL ENVIRONMENTAL CONDITIONS (SIMULATION PARAMETERS):
        - Ambient Temperature: ${envConditions.temperature}°C
        - Atmospheric Pressure: ${envConditions.pressure} atm
        - Gravity: ${envConditions.gravity} m/s²
        - Humidity: ${envConditions.humidity}%
        - Wind Speed: ${envConditions.windSpeed} m/s
        - Atmosphere Composition: ${envConditions.atmosphere}
        
        INSTRUCTION: You MUST apply these specific environmental factors to your analysis.
        - If Temperature is extreme (e.g. < -100C or > 500C), evaluate material phase changes, brittleness, or melting.
        - If Pressure is high (e.g. > 10 atm) or low (vacuum), evaluate implosion/explosion risks and seal integrity.
        - If Gravity is different from Earth (9.81), re-calculate structural loads and fluid dynamics.
        - If Atmosphere is corrosive or lacks oxygen, evaluate oxidation, combustion viability, and chemical reactions.
        `;
    }

    promptText += `
              
              PROTOCOL EXECUTION STEPS:
              
              STEP 1: IDEA DECOMPOSITION
              Break the idea into fundamental engineering components (Function, Interfaces, Constraints).
              
              STEP 2: PHYSICS LAW APPLICATION
              Select and apply relevant laws from the Universal Physics Library (e.g., Navier-Stokes, Maxwell's Eqs, General Relativity, Ideal Gas Law, Stefan-Boltzmann, Hooke's Law).
              
              STEP 3: MATHEMATICAL CALCULATIONS
              Perform approximate but realistic calculations for Forces, Loads, Temps, Energy requirements, etc. using the provided Environmental Conditions. Show equations.
              
              STEP 4: DIMENSIONAL & SIZE ANALYSIS
              Analyze the dimensions provided or estimate them. Check tolerances.
              
              STEP 5: FAILURE PREDICTION
              Predict primary and cascading failure modes with probabilities, specifically considering the ${envConditions ? 'DEFINED ENVIRONMENTAL CONDITIONS' : 'environment'}.
              
              STEP 6: MANUFACTURABILITY CHECK
              Evaluate material availability, assembly feasibility, and precision requirements.
              
              STEP 7: OPTIMIZATION SUGGESTIONS
              Suggest concrete redesigns or improvements.
              
              Output the final analysis in strict JSON format matching the schema.`;

    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: `You are AEGIS, a Gemini-powered autonomous engineering AI agent. 
        Your role is to evaluate, design, and validate ideas using fundamental physics laws, mathematical calculations, and system logic before real-world implementation.
        
        You have access to the full spectrum of scientific knowledge, including but not limited to:
        - Classical Mechanics & Dynamics
        - Thermodynamics & Statistical Mechanics
        - Electrodynamics & Magnetism
        - Quantum Mechanics & Particle Physics
        - Relativistic Physics (Special & General)
        - Fluid Dynamics & Aerodynamics
        - Material Science & Crystallography
        - Chemistry & Chemical Kinetics
        
        You must be:
        - Rigorous: Apply actual equations and physics laws.
        - Objective: Assign risk scores based on failure probability, not optimism.
        - Precise: Use SI units and specific material properties.
        - Context-Aware: Strictly adhere to the provided Environmental Conditions (Gravity, Temp, Pressure).
        
        Do not exaggerate certainty. If a design violates physics, state it clearly as IMPOSSIBLE.`,
      }
    });

    if (!response.text) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(response.text);
    return data as AnalysisResult;
  });
};

export const generateBlueprint = async (idea: string): Promise<BlueprintPart[]> => {
  const prompt = `You are the AEGIS CAD Submodule. 
  Decompose the following object/idea into a structural composition of basic geometric primitives for preliminary engineering visualization.
  
  Object to visualize: "${idea}"
  
  Return a JSON array of up to 12 parts. 
  Supported types: 'box', 'cylinder', 'sphere', 'cone', 'capsule'.
  
  Coordinate system: Y is up. Center is (0,0,0).
  Keep the total size roughly within a 5x5x5 unit box.
  Use distinct colors (hex codes) for different components to make it look like a technical schematic.
  Ensure the parts connect to form a cohesive structure representing the object.
  Make it look engineered and structural.`;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['box', 'cylinder', 'sphere', 'cone', 'capsule'] },
        position: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        rotation: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Euler angles in radians [x, y, z]" },
        scale: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "[x, y, z] dimensions" },
        color: { type: Type.STRING },
        name: { type: Type.STRING },
      },
      required: ['id', 'type', 'position', 'rotation', 'scale', 'color', 'name'],
    },
  };

  return executeWithRetry(async (client) => {
    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as BlueprintPart[];
  });
};