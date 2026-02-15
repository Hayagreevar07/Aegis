# AEGIS - System Design Document

## 1. Architecture Overview

AEGIS (Autonomous Engineering Generated Integrity System) is a React-based web application that leverages AI to validate engineering concepts against physical laws and environmental constraints. The system uses a modular architecture with clear separation between UI components, services, and data models.

### Technology Stack
- **Frontend Framework**: React 19.2.4 with TypeScript
- **Build Tool**: Vite 6.2.0
- **3D Rendering**: React Three Fiber + Three.js
- **AI Service**: Google Gemini API (@google/genai)
- **Data Persistence**: Local Storage + Optional Supabase Cloud Backend
- **Visualization**: Recharts for data visualization
- **UI Components**: Lucide React icons

## 2. System Components

### 2.1 Core Application (App.tsx)
The main application orchestrator that manages:
- User input and configuration state
- Analysis workflow and pipeline visualization
- History management and cloud connectivity
- Environmental conditions and physical properties
- Domain-specific physics analysis

### 2.2 Service Layer

#### Gemini Service (services/gemini.ts)
- Interfaces with Google Gemini AI API
- Implements structured prompt engineering for physics validation
- Handles API key rotation and retry logic for rate limiting
- Enforces strict JSON schema output for consistent parsing
- Passes environmental conditions and physical properties to AI context

#### Storage Service (services/storage.ts)
- Abstracts data persistence layer
- Supports dual-mode operation:
  - **Local Mode**: Browser LocalStorage for offline usage
  - **Cloud Mode**: Supabase backend for cross-device sync
- Implements "Bring Your Own Backend" pattern
- Manages history CRUD operations

### 2.3 UI Components

#### AnalysisDisplay.tsx
Renders comprehensive analysis results including:
- Risk gauge visualization
- Verdict classification badge
- Multi-dimensional radar chart (Physics, Engineering, Economics, Safety)
- Detailed breakdown sections (Laws, Calculations, Failure Modes)
- Markdown-formatted reasoning
- Export functionality for reports

#### PipelineVisualizer.tsx
Animated step-by-step visualization of the analysis pipeline:
1. Input Processing
2. Physics Domain Selection
3. Environmental Context Loading
4. AI Reasoning & Calculation
5. Results Generation

#### ModelEditor.tsx
Interactive 3D model editor with two modes:
- **Manual Mode**: Bounding box based on user-defined dimensions
- **Generative Blueprint Mode**: AI-generated geometric primitives
- Features: Orbit controls, part manipulation, undo/redo, stress test animation

#### Gauge.tsx
Circular risk score gauge with color-coded severity levels

#### RadarChart.tsx
Multi-axis visualization for comparative scoring across domains

#### InfoModal.tsx
About dialog with project information and support links

#### CloudConnect.tsx
Configuration interface for Supabase backend connection

## 3. Data Models (types.ts)

### Core Types
- **PhysicsDomain**: 25 specialized physics domains for focused analysis
- **PhysicalProperties**: Dimensional and material specifications
- **EnvironmentalConditions**: Temperature, pressure, gravity, humidity, wind, atmosphere
- **BlueprintPart**: 3D primitive definitions for generative modeling
- **FailureMode**: Structured failure prediction with probability and impact
- **AnalysisResult**: Comprehensive validation output schema
- **HistoryItem**: Persisted simulation record

## 4. Analysis Pipeline

### Step 1: Input Collection
- User provides concept description (free text)
- Selects physics domain for specialized analysis
- Configures physical properties (dimensions, material)
- Sets environmental conditions (temperature, pressure, gravity, etc.)

### Step 2: 3D Modeling (Optional)
- Manual mode: Simple bounding box visualization
- Generative mode: AI interprets prompt to create geometric composition
- Interactive editing with real-time preview

### Step 3: AI Analysis
The Gemini service executes a structured reasoning protocol:
1. **Decomposition**: Break down system into functional components
2. **Physics Law Application**: Identify relevant laws for selected domain
3. **Mathematical Calculations**: Perform quantitative analysis
4. **Dimensional Analysis**: Verify unit consistency
5. **Failure Prediction**: Identify potential failure modes
6. **Manufacturability Check**: Assess production feasibility
7. **Optimization Suggestions**: Recommend improvements

### Step 4: Results Visualization
- Risk score (0.0-1.0) displayed on gauge
- Verdict classification (FEASIBLE, PLAUSIBLE, IMPLAUSIBLE, IMPOSSIBLE)
- Radar chart showing multi-dimensional scores
- Detailed breakdown of applied laws, calculations, and failure modes
- Markdown-formatted reasoning with export capability

### Step 5: Persistence
- Save to local storage for immediate access
- Optional cloud sync via Supabase for cross-device availability

## 5. Key Features

### Multi-Domain Physics Analysis
25 specialized domains including:
- Structural Integrity, Thermodynamics, Aerodynamics
- Quantum Mechanics, Relativistic Physics, Orbital Mechanics
- Material Science, Nuclear Physics, Plasma Physics
- And 16 more specialized fields

### Environmental Simulation
Configurable conditions:
- Temperature (-273°C to 6000°C)
- Pressure (0 to 1000+ atm)
- Gravity (0 to 100+ m/s²)
- Humidity (0-100%)
- Wind speed (0-500+ m/s)
- Atmosphere composition (Earth, Mars, Vacuum, Venus, Underwater, Titan)

### 3D Visualization
- WebGL-based rendering via React Three Fiber
- Interactive camera controls (orbit, zoom, pan)
- Generative blueprint mode with AI-driven geometry
- Stress test animation for visual feedback

### Data Persistence
- Local-first architecture for offline capability
- Optional cloud backend (Supabase) for sync
- User-controlled data ownership (BYOB pattern)

## 6. Security & Performance

### API Key Management
- Environment variable storage (.env.local)
- Key rotation support for rate limit handling
- Retry logic with exponential backoff

### Performance Optimizations
- React Three Fiber for efficient 3D rendering
- Lazy loading of analysis results
- Debounced input handling
- Optimistic UI updates

### Data Privacy
- Local-first storage by default
- Optional cloud sync with user-provided credentials
- No data transmitted without explicit user configuration

## 7. Extensibility

### Adding New Physics Domains
1. Add domain to `PhysicsDomain` type in types.ts
2. Update DOMAINS array in App.tsx
3. Enhance Gemini prompt in services/gemini.ts with domain-specific context

### Adding New Primitive Types
1. Extend `PrimitiveType` in types.ts
2. Add rendering logic in ModelEditor.tsx
3. Update AI prompt to recognize new geometry

### Custom Storage Backends
1. Implement StorageService interface
2. Add configuration UI in CloudConnect.tsx
3. Update storage service factory logic

## 8. Future Enhancements

- Real-time collaboration via WebRTC
- Export to CAD formats (STEP, IGES)
- Integration with FEA/CFD simulation tools
- Machine learning model for failure prediction
- Multi-language support
- Mobile-optimized responsive design
- Advanced material database with property lookup
- Cost estimation module
- Regulatory compliance checking
