# AEGIS - Requirements Specification

## 1. Project Overview

### 1.1 Purpose
**AEGIS** (Autonomous Engineering Generated Integrity System) is an AI-powered engineering validation tool. Its primary purpose is to rigorously evaluate user-submitted concepts against physical laws, mathematical constraints, and environmental conditions to predict failure modes and calculate risk scores before implementation.

### 1.2 Scope
AEGIS provides engineers, designers, and innovators with:
- Pre-implementation validation of engineering concepts
- Physics-based failure mode prediction
- Risk quantification and scoring
- Manufacturability assessment
- Optimization recommendations
- Interactive 3D visualization and modeling

### 1.3 Target Users
- Mechanical Engineers
- Aerospace Engineers
- Product Designers
- Research Scientists
- Engineering Students
- Innovation Teams
- Concept Developers

### 1.4 Key Benefits
- Reduce prototyping costs by identifying issues early
- Validate concepts against 25 specialized physics domains
- Simulate environmental conditions before physical testing
- Generate comprehensive technical reports
- Maintain design history and iteration tracking

## 2. Functional Requirements

### 2.1. User Input & Configuration

#### 2.1.1 Concept Description
*   **FR-001:** The system must accept free-text input describing the engineering concept, architecture, or object.
*   **FR-002:** The input field must support multi-line text with minimum 500 characters capacity.
*   **FR-003:** The system must provide sample prompts to guide users.
*   **FR-004:** The system must preserve user input during session for editing and refinement.

#### 2.1.2 Physics Domain Selection
*   **FR-005:** Users must be able to select from 25 specialized physics domains including:
    *   General, Structural Integrity, Thermodynamics, Aerodynamics
    *   Electromagnetism, Fluid Dynamics, Quantum Mechanics
    *   Relativistic Physics, Acoustics, Optics, Chemical Kinetics
    *   Biomechanics, Astrophysics, Geophysics, Material Science
    *   Nuclear Physics, Plasma Physics, Cybernetics, Control Theory
    *   Orbital Mechanics, Nanotechnology, Cryogenics
    *   High Energy Physics, Meteorology, Hydrodynamics
*   **FR-006:** The selected domain must influence the AI analysis focus and applied physics laws.
*   **FR-007:** The system must display the selected domain in analysis results.

#### 2.1.3 Physical Properties
*   **FR-008:** Users must be able to define dimensional properties:
    *   Width (meters, range: 0.001 to 1000)
    *   Height (meters, range: 0.001 to 1000)
    *   Depth (meters, range: 0.001 to 1000)
*   **FR-009:** Users must be able to select material from presets:
    *   Aluminum 6061, Titanium Grade 5, Carbon Fiber
    *   Steel, Copper, Plastic, Composite, Custom
*   **FR-010:** The system must use physical properties in structural calculations.
*   **FR-011:** Physical properties must be optional with sensible defaults.

#### 2.1.4 Environmental Conditions
*   **FR-012:** Users must be able to configure environmental parameters:
    *   Temperature (°C, range: -273 to 6000)
    *   Pressure (atm, range: 0 to 1000)
    *   Gravity (m/s², range: 0 to 100)
    *   Humidity (%, range: 0 to 100)
    *   Wind Speed (m/s, range: 0 to 500)
*   **FR-013:** Users must be able to select atmosphere composition:
    *   Earth Standard, Mars (CO2), Vacuum (Space)
    *   Venus (Acidic/High P), Underwater, Titan (Methane)
*   **FR-014:** Environmental conditions must be factored into AI analysis.
*   **FR-015:** The system must provide preset environment profiles (Earth, Mars, Space, etc.).
*   **FR-016:** Environmental configuration must be collapsible/expandable to reduce UI complexity.

### 2.2. 3D Visualization & Modeling

#### 2.2.1 Interactive Viewport
*   **FR-017:** A 3D canvas must allow users to orbit, zoom, and pan around the model.
*   **FR-018:** The viewport must use WebGL rendering via React Three Fiber.
*   **FR-019:** Camera controls must be intuitive (mouse drag to orbit, scroll to zoom).
*   **FR-020:** The viewport must display a grid and axis helpers for spatial reference.
*   **FR-021:** The viewport must be responsive and maintain aspect ratio.

#### 2.2.2 Manual Mode
*   **FR-022:** The system must render a bounding box representation based on user's dimension inputs.
*   **FR-023:** The bounding box must update in real-time as dimensions change.
*   **FR-024:** The system must display dimension labels on the model.
*   **FR-025:** Manual mode must be the default visualization mode.

#### 2.2.3 Generative Blueprint Mode
*   **FR-026:** The system must use AI to interpret the text prompt and generate structural compositions.
*   **FR-027:** Generated models must use geometric primitives:
    *   Box, Cylinder, Sphere, Cone, Capsule
*   **FR-028:** Each generated part must have:
    *   Unique identifier
    *   Position (x, y, z)
    *   Rotation (x, y, z in radians)
    *   Scale (x, y, z)
    *   Color/material
    *   Name/label
*   **FR-029:** Users must be able to select individual parts by clicking.
*   **FR-030:** Users must be able to edit selected parts:
    *   Move via drag or numeric input
    *   Rotate via gizmo or numeric input
    *   Scale via handles or numeric input
*   **FR-031:** The system must support Undo/Redo operations for all model changes.
*   **FR-032:** The system must maintain an edit history stack (minimum 20 operations).
*   **FR-033:** Users must be able to delete selected parts.
*   **FR-034:** Users must be able to add new primitives manually.
*   **FR-035:** The system must allow switching between Manual and Generative modes.

#### 2.2.4 Visual Simulation
*   **FR-036:** The system must provide a "Stress Test" visualization mode.
*   **FR-037:** Stress test must animate the model with:
    *   Vibration/oscillation effects
    *   Color stress mapping (green to red gradient)
    *   Particle effects for critical stress points
*   **FR-038:** Users must be able to start/stop the stress test animation.
*   **FR-039:** The animation must be performant (minimum 30 FPS).

### 2.3. Analysis Engine (Core AI)

#### 2.3.1 Engineering Protocol
*   **FR-040:** The AI must follow a strict multi-step reasoning process:
    1.  **Decomposition:** Break down concept into functional components and constraints
    2.  **Physics Law Application:** Identify and apply relevant physics laws for selected domain
    3.  **Mathematical Calculations:** Perform quantitative analysis with units
    4.  **Dimensional Analysis:** Verify unit consistency and scale appropriateness
    5.  **Failure Prediction:** Identify potential failure modes with probability and impact
    6.  **Manufacturability Check:** Assess production feasibility and complexity
    7.  **Optimization Suggestions:** Recommend design improvements
*   **FR-041:** Each step must be traceable in the analysis output.
*   **FR-042:** The AI must provide reasoning for each conclusion.

#### 2.3.2 Context Awareness
*   **FR-043:** The analysis must explicitly factor in user-defined environmental conditions.
*   **FR-044:** The analysis must consider physical properties (dimensions, material).
*   **FR-045:** The analysis must be domain-specific based on selected physics domain.
*   **FR-046:** The AI must reference specific environmental parameters in calculations.
*   **FR-047:** The system must pass complete context to the AI in a structured format.

#### 2.3.3 Output Schema
*   **FR-048:** The AI must return data in a strict JSON schema including:
    *   `summary` (string): Executive summary of analysis
    *   `riskScore` (number 0.0-1.0): Quantitative risk assessment
    *   `verdict` (enum): FEASIBLE, PLAUSIBLE, IMPLAUSIBLE, IMPOSSIBLE
    *   `scores` (object): Physics, Engineering, Economics, Safety (0-100 each)
    *   `componentBreakdown` (array): List of identified components
    *   `appliedPhysicsLaws` (array): Specific laws applied
    *   `keyCalculations` (array): Mathematical computations performed
    *   `violatedConstraints` (array): Physics/math laws broken
    *   `failureModes` (array): Predicted failures with probability and impact
    *   `manufacturability` (object): Rating and assessment
    *   `optimizations` (array): Improvement suggestions
    *   `reasoning` (string): Detailed markdown-formatted explanation
*   **FR-049:** The system must validate AI output against schema before rendering.
*   **FR-050:** The system must handle malformed AI responses gracefully with error messages.

#### 2.3.4 Reliability & Performance
*   **FR-051:** The system must implement retry logic with exponential backoff for API failures.
*   **FR-052:** The system must support API key rotation for rate limit handling (HTTP 429).
*   **FR-053:** The system must display progress indicators during analysis.
*   **FR-054:** Analysis must complete within 60 seconds under normal conditions.
*   **FR-055:** The system must cache API responses to avoid redundant calls.

### 2.4. Results Visualization

#### 2.4.1 Risk Metric Display
*   **FR-056:** Display calculated Risk Score (0.0 - 1.0) on a circular gauge.
*   **FR-057:** The gauge must use color coding:
    *   Green (0.0-0.3): Low risk
    *   Yellow (0.3-0.6): Medium risk
    *   Orange (0.6-0.8): High risk
    *   Red (0.8-1.0): Critical risk
*   **FR-058:** The gauge must animate smoothly when displaying results.
*   **FR-059:** The gauge must display the numeric score with 2 decimal precision.

#### 2.4.2 Verdict Classification
*   **FR-060:** Display verdict badge with color coding:
    *   FEASIBLE: Green
    *   PLAUSIBLE: Blue
    *   IMPLAUSIBLE: Orange
    *   IMPOSSIBLE: Red
*   **FR-061:** The verdict must be prominently displayed at the top of results.
*   **FR-062:** The verdict must include a brief explanation of the classification.

#### 2.4.3 Multi-Dimensional Scoring
*   **FR-063:** Visualize scores across four dimensions using a radar chart:
    *   Physics (0-100)
    *   Engineering (0-100)
    *   Economics (0-100)
    *   Safety (0-100)
*   **FR-064:** The radar chart must be interactive with hover tooltips.
*   **FR-065:** Each dimension must have a distinct color.
*   **FR-066:** The chart must be responsive and scale appropriately.

#### 2.4.4 Detailed Report Sections
*   **FR-067:** Render Markdown-formatted reasoning with proper styling.
*   **FR-068:** Display component breakdown as an expandable list.
*   **FR-069:** List specific physics laws applied with descriptions.
*   **FR-070:** Display mathematical calculations with proper formatting:
    *   Equations rendered clearly
    *   Units displayed consistently
    *   Results highlighted
*   **FR-071:** List violated constraints with severity indicators.
*   **FR-072:** Display failure modes in a structured table format:
    *   Scenario description
    *   Probability (Low, Medium, High, Certain)
    *   Impact (Minor, Major, Catastrophic)
    *   Mitigation strategies (if available)
*   **FR-073:** Display manufacturability assessment with rating badge.
*   **FR-074:** List optimization suggestions as actionable items.
*   **FR-075:** All sections must be collapsible/expandable for better navigation.

#### 2.4.5 Export Functionality
*   **FR-076:** Users must be able to download the full analysis as a Markdown file.
*   **FR-077:** The exported file must include:
    *   Timestamp and concept description
    *   Selected domain and environmental conditions
    *   All analysis sections
    *   Formatted tables and lists
*   **FR-078:** The filename must include timestamp for easy identification.
*   **FR-079:** Export must trigger browser download without page navigation.

### 2.5. Data Persistence

#### 2.5.1 Local Storage
*   **FR-080:** Recent simulations must be automatically saved to browser's Local Storage.
*   **FR-081:** The system must store minimum 50 most recent simulations.
*   **FR-082:** Each history item must include:
    *   Unique identifier
    *   Timestamp
    *   Concept title (truncated to 100 characters)
    *   Complete analysis result
*   **FR-083:** Users must be able to view history in a sidebar panel.
*   **FR-084:** Users must be able to click history items to reload results.
*   **FR-085:** Users must be able to clear all history with confirmation.
*   **FR-086:** History must persist across browser sessions.
*   **FR-087:** The system must handle Local Storage quota limits gracefully.

#### 2.5.2 Cloud Connectivity (Optional)
*   **FR-088:** Users must be able to connect to a Supabase backend ("Bring Your Own Backend").
*   **FR-089:** The system must provide a configuration modal for cloud setup.
*   **FR-090:** Users must enter:
    *   Supabase Project URL
    *   Supabase API Key (anon/public)
*   **FR-091:** The system must validate credentials before enabling cloud mode.
*   **FR-092:** Cloud connectivity status must be displayed in the navbar.
*   **FR-093:** When cloud is enabled:
    *   New simulations must sync to cloud automatically
    *   History must load from cloud on startup
    *   Local storage must serve as fallback
*   **FR-094:** Users must be able to disconnect from cloud and return to local-only mode.
*   **FR-095:** The system must handle cloud sync failures gracefully without data loss.
*   **FR-096:** Cloud credentials must be stored securely in browser storage.
*   **FR-097:** The system must support multiple users via user_id field in cloud storage.

### 2.6. User Interface & Navigation

#### 2.6.1 Layout
*   **FR-098:** The application must use a responsive grid layout.
*   **FR-099:** Desktop layout must use 8-column main area + 4-column sidebar.
*   **FR-100:** Mobile layout must stack sections vertically.
*   **FR-101:** The navbar must be sticky at the top during scroll.
*   **FR-102:** The history sidebar must be sticky on desktop.

#### 2.6.2 Navigation
*   **FR-103:** The navbar must display:
    *   AEGIS logo and title
    *   Version number
    *   Online status indicator
    *   Cloud connectivity status
    *   Help/info button
*   **FR-104:** The system must provide keyboard shortcuts for common actions.
*   **FR-105:** The system must support browser back/forward navigation.

#### 2.6.3 Modals & Dialogs
*   **FR-106:** The system must provide an Info/About modal with:
    *   Project description
    *   Usage instructions
    *   Support links
    *   Version information
*   **FR-107:** The system must provide a Cloud Connect modal for Supabase configuration.
*   **FR-108:** Modals must be dismissible via ESC key or close button.
*   **FR-109:** Modals must trap focus for accessibility.

#### 2.6.4 Loading States
*   **FR-110:** The system must display a pipeline visualization during analysis.
*   **FR-111:** The pipeline must show 5 steps with progress indicators.
*   **FR-112:** Loading states must include animated spinners or progress bars.
*   **FR-113:** The "RUN SIMULATION" button must be disabled during analysis.

#### 2.6.5 Error Handling
*   **FR-114:** The system must display user-friendly error messages.
*   **FR-115:** Error messages must include:
    *   Clear description of the problem
    *   Suggested actions to resolve
    *   Option to retry or dismiss
*   **FR-116:** API errors must be logged to console for debugging.
*   **FR-117:** The system must recover gracefully from errors without requiring page reload.

## 3. Non-Functional Requirements

### 3.1 Aesthetics & Design
*   **NFR-001:** The UI must adhere to a "Sci-Fi / Engineering" aesthetic.
*   **NFR-002:** The color scheme must use:
    *   Background: Slate 950 (#020617)
    *   Surface: Slate 900 (#0f172a)
    *   Primary accent: Cyan 500 (#06b6d4)
    *   Secondary accent: Purple 500 (#a855f7)
    *   Text: Slate 200 (#e2e8f0)
*   **NFR-003:** Typography must use:
    *   Monospaced fonts for technical data (code, metrics)
    *   Sans-serif fonts for content and descriptions
*   **NFR-004:** The UI must use dark mode exclusively.
*   **NFR-005:** Animations must be subtle and purposeful (fade-in, slide, scale).
*   **NFR-006:** The design must maintain visual hierarchy with proper spacing and grouping.

### 3.2 Performance
*   **NFR-007:** 3D rendering must maintain minimum 30 FPS on mid-range hardware.
*   **NFR-008:** 3D rendering must be optimized using React Three Fiber.
*   **NFR-009:** Initial page load must complete within 3 seconds on broadband connection.
*   **NFR-010:** UI interactions must respond within 100ms.
*   **NFR-011:** The application bundle size must be under 2MB (gzipped).
*   **NFR-012:** Images and assets must be optimized for web delivery.
*   **NFR-013:** The system must use code splitting for optimal loading.

### 3.3 Reliability
*   **NFR-014:** The AI service layer must implement retry logic with exponential backoff.
*   **NFR-015:** The system must handle API rate limits (HTTP 429) with key rotation.
*   **NFR-016:** The application must have 99% uptime (excluding external API dependencies).
*   **NFR-017:** Data persistence must be atomic to prevent corruption.
*   **NFR-018:** The system must gracefully degrade when external services are unavailable.

### 3.4 Responsiveness
*   **NFR-019:** The layout must be responsive across desktop (1920px+), tablet (768px-1919px), and mobile (320px-767px).
*   **NFR-020:** Touch interactions must be supported on mobile devices.
*   **NFR-021:** The 3D viewport must adapt to different screen sizes.
*   **NFR-022:** Text must remain readable at all viewport sizes (minimum 12px).
*   **NFR-023:** Interactive elements must have minimum 44x44px touch targets on mobile.

### 3.5 Accessibility
*   **NFR-024:** The application must meet WCAG 2.1 Level AA standards where feasible.
*   **NFR-025:** All interactive elements must be keyboard accessible.
*   **NFR-026:** Focus indicators must be clearly visible.
*   **NFR-027:** Color must not be the only means of conveying information.
*   **NFR-028:** Images and icons must have appropriate alt text or aria-labels.
*   **NFR-029:** Form inputs must have associated labels.
*   **NFR-030:** The application must support screen reader navigation.

### 3.6 Security
*   **NFR-031:** API keys must be stored in environment variables, not in code.
*   **NFR-032:** User data must not be transmitted to third parties without consent.
*   **NFR-033:** Cloud credentials must be stored securely in browser storage.
*   **NFR-034:** The application must use HTTPS in production.
*   **NFR-035:** Input validation must prevent injection attacks.
*   **NFR-036:** The system must sanitize user input before AI processing.

### 3.7 Maintainability
*   **NFR-037:** Code must follow TypeScript best practices with strict mode enabled.
*   **NFR-038:** Components must be modular and reusable.
*   **NFR-039:** Code must include comments for complex logic.
*   **NFR-040:** The project must use consistent code formatting (Prettier/ESLint).
*   **NFR-041:** Dependencies must be kept up-to-date with security patches.
*   **NFR-042:** The codebase must maintain test coverage above 70% (aspirational).

### 3.8 Scalability
*   **NFR-043:** The system must handle 100+ history items without performance degradation.
*   **NFR-044:** The 3D editor must support models with up to 50 primitives.
*   **NFR-045:** The application must support concurrent users when using cloud backend.
*   **NFR-046:** The system must be deployable to CDN for global distribution.

## 4. System Constraints
*   **API Dependency:** Requires an active internet connection and a valid Google Gemini API Key.
*   **Browser Support:** Requires a modern browser supporting WebGL for 3D rendering.

## 4. System Constraints

### 4.1 Technical Dependencies
*   **CON-001:** Requires an active internet connection for AI analysis.
*   **CON-002:** Requires a valid Google Gemini API Key.
*   **CON-003:** Requires a modern browser supporting:
    *   WebGL 2.0 for 3D rendering
    *   ES2020+ JavaScript features
    *   Local Storage API
    *   Fetch API
*   **CON-004:** Minimum browser versions:
    *   Chrome 90+
    *   Firefox 88+
    *   Safari 14+
    *   Edge 90+

### 4.2 Hardware Requirements
*   **CON-005:** Minimum hardware specifications:
    *   CPU: Dual-core 2.0 GHz
    *   RAM: 4 GB
    *   GPU: WebGL 2.0 compatible
    *   Display: 1280x720 resolution
*   **CON-006:** Recommended hardware specifications:
    *   CPU: Quad-core 2.5 GHz+
    *   RAM: 8 GB+
    *   GPU: Dedicated graphics with WebGL 2.0
    *   Display: 1920x1080+ resolution

### 4.3 External Service Constraints
*   **CON-007:** Google Gemini API rate limits apply (varies by tier).
*   **CON-008:** Supabase free tier limits apply if using cloud backend:
    *   500 MB database storage
    *   1 GB file storage
    *   50,000 monthly active users
*   **CON-009:** API response times may vary based on network conditions.
*   **CON-010:** Cloud sync requires user-provided Supabase credentials.

### 4.4 Data Constraints
*   **CON-011:** Local Storage limited to ~5-10 MB per domain (browser-dependent).
*   **CON-012:** Maximum concept description length: 10,000 characters.
*   **CON-013:** Maximum 3D model complexity: 50 primitives.
*   **CON-014:** Maximum history items in local storage: 50.
*   **CON-015:** Analysis results must fit within JSON size limits (~1 MB).

### 4.5 Operational Constraints
*   **CON-016:** The application is client-side only (no backend server required).
*   **CON-017:** AI analysis quality depends on prompt clarity and detail.
*   **CON-018:** 3D rendering performance depends on device GPU capabilities.
*   **CON-019:** The system cannot perform actual FEA/CFD simulations.
*   **CON-020:** Results are AI-generated predictions, not certified engineering analysis.

## 5. Acceptance Criteria

### 5.1 Core Functionality
*   **AC-001:** User can input concept description and receive analysis results.
*   **AC-002:** User can select from 25 physics domains.
*   **AC-003:** User can configure environmental conditions.
*   **AC-004:** User can define physical properties.
*   **AC-005:** User can view 3D model in manual mode.
*   **AC-006:** User can generate and edit 3D blueprint.
*   **AC-007:** Analysis results display risk score, verdict, and detailed breakdown.
*   **AC-008:** User can export analysis as Markdown file.
*   **AC-009:** User can view and reload history items.
*   **AC-010:** User can connect to Supabase for cloud sync.

### 5.2 Quality Criteria
*   **AC-011:** Analysis completes within 60 seconds.
*   **AC-012:** 3D rendering maintains 30+ FPS.
*   **AC-013:** UI is responsive on desktop, tablet, and mobile.
*   **AC-014:** No console errors during normal operation.
*   **AC-015:** Application loads within 3 seconds.

### 5.3 User Experience
*   **AC-016:** UI follows sci-fi engineering aesthetic consistently.
*   **AC-017:** All interactive elements provide visual feedback.
*   **AC-018:** Error messages are clear and actionable.
*   **AC-019:** Loading states are displayed during async operations.
*   **AC-020:** Help documentation is accessible via info modal.

## 6. Future Enhancements (Out of Scope for v1.0)

### 6.1 Advanced Analysis
*   **FE-001:** Integration with actual FEA/CFD simulation engines.
*   **FE-002:** Machine learning model for failure prediction based on historical data.
*   **FE-003:** Multi-physics coupled analysis (e.g., thermal-structural).
*   **FE-004:** Time-domain simulation and animation.
*   **FE-005:** Sensitivity analysis and parameter sweeps.

### 6.2 Collaboration Features
*   **FE-006:** Real-time collaboration via WebRTC.
*   **FE-007:** Comments and annotations on analysis results.
*   **FE-008:** Team workspaces with shared history.
*   **FE-009:** Version control for design iterations.
*   **FE-010:** Approval workflows for engineering reviews.

### 6.3 Export & Integration
*   **FE-011:** Export 3D models to CAD formats (STEP, IGES, STL).
*   **FE-012:** Import existing CAD models for analysis.
*   **FE-013:** Integration with PLM systems.
*   **FE-014:** API for programmatic access.
*   **FE-015:** Batch processing of multiple concepts.

### 6.4 Enhanced Visualization
*   **FE-016:** VR/AR support for immersive model viewing.
*   **FE-017:** Advanced material rendering (PBR, textures).
*   **FE-018:** Animation timeline for stress test visualization.
*   **FE-019:** Cross-section views and cutaway rendering.
*   **FE-020:** Measurement tools and dimensioning.

### 6.5 Additional Features
*   **FE-021:** Cost estimation module with material pricing.
*   **FE-022:** Regulatory compliance checking (ISO, ASME, etc.).
*   **FE-023:** Advanced material database with property lookup.
*   **FE-024:** Multi-language support (i18n).
*   **FE-025:** Mobile native apps (iOS, Android).
*   **FE-026:** Offline mode with service workers.
*   **FE-027:** AI training on user feedback for improved accuracy.
*   **FE-028:** Integration with generative design tools.
*   **FE-029:** Sustainability and environmental impact assessment.
*   **FE-030:** Patent search and prior art analysis.

## 7. Glossary

*   **AEGIS:** Autonomous Engineering Generated Integrity System
*   **FEA:** Finite Element Analysis
*   **CFD:** Computational Fluid Dynamics
*   **WebGL:** Web Graphics Library (browser 3D rendering API)
*   **Supabase:** Open-source Firebase alternative (cloud backend)
*   **BYOB:** Bring Your Own Backend
*   **Gemini:** Google's AI model for analysis
*   **Primitive:** Basic 3D geometric shape (box, sphere, cylinder, etc.)
*   **Risk Score:** Quantitative measure of concept viability (0.0-1.0)
*   **Verdict:** Qualitative classification (FEASIBLE, PLAUSIBLE, IMPLAUSIBLE, IMPOSSIBLE)
*   **Physics Domain:** Specialized field of physics for focused analysis
*   **Failure Mode:** Potential way a system could fail
*   **Manufacturability:** Ease and feasibility of producing a design

## 8. References

*   Google Gemini API Documentation: https://ai.google.dev/
*   React Three Fiber Documentation: https://docs.pmnd.rs/react-three-fiber/
*   Supabase Documentation: https://supabase.com/docs
*   WebGL Specification: https://www.khronos.org/webgl/
*   WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
