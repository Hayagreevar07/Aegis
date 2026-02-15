# AEGIS - Requirements Specification

## 1. Project Overview
**AEGIS** (Autonomous Engineering Generated Integrity System) is an AI-powered engineering validation tool. Its primary purpose is to rigorously evaluate user-submitted concepts against physical laws, mathematical constraints, and environmental conditions to predict failure modes and calculate risk scores before implementation.

## 2. Functional Requirements

### 2.1. User Input & Configuration
*   **Concept Description:** The system must accept free-text input describing the engineering concept, architecture, or object.
*   **Physics Domain:** Users must be able to select a specific physics domain (e.g., Thermodynamics, Orbital Mechanics, Quantum Mechanics) to focus the analysis.
*   **Physical Properties:** Users must be able to define:
    *   Dimensions (Width, Height, Depth).
    *   Material (Selection from presets like Aluminum, Titanium, Carbon Fiber, or custom interpretation).
*   **Environmental Conditions:** Users must be able to simulate specific environments by configuring:
    *   Temperature (°C).
    *   Pressure (atm).
    *   Gravity (m/s²).
    *   Humidity (%).
    *   Wind Speed (m/s).
    *   Atmosphere Composition (e.g., Earth, Mars, Vacuum).

### 2.2. 3D Visualization & Modeling
*   **Interactive Viewport:** A 3D canvas must allow users to orbit, zoom, and pan around the model.
*   **Manual Mode:** The system must render a bounding box representation based on the user's manual dimension inputs.
*   **Generative Blueprint Mode:**
    *   The system must use AI to interpret the text prompt and generate a structural composition of geometric primitives (Box, Cylinder, Sphere, Cone, Capsule).
    *   Users must be able to edit, move, rotate, and scale individual generated parts.
    *   The system must support Undo/Redo operations for model changes.
*   **Visual Simulation:** The system must provide a "Stress Test" visualization that animates the model (vibration, color stress mapping) to simulate active load.

### 2.3. Analysis Engine (Core AI)
*   **Engineering Protocol:** The AI must follow a strict multi-step reasoning process:
    1.  Decomposition (Function/Constraints).
    2.  Physics Law Application.
    3.  Mathematical Calculations.
    4.  Dimensional Analysis.
    5.  Failure Prediction.
    6.  Manufacturability Check.
    7.  Optimization Suggestions.
*   **Context Awareness:** The analysis must explicitly factor in the user-defined environmental conditions and physical properties.
*   **Strict Output:** The AI must return data in a specific JSON schema to ensure consistent rendering of metrics.

### 2.4. Results Visualization
*   **Risk Metric:** Display a calculated Risk Score (0.0 - 1.0) on a gauge.
*   **Verdict:** Classify the concept as FEASIBLE, PLAUSIBLE, IMPLAUSIBLE, or IMPOSSIBLE.
*   **Radar Chart:** Visualize scores across Physics, Engineering, Economics, and Safety.
*   **Detailed Report:**
    *   Render Markdown-formatted reasoning.
    *   List specific physics laws applied.
    *   List mathematical calculations performed.
    *   List identified failure modes with probability and impact.
*   **Export:** Users must be able to download the full analysis as a Markdown report.

### 2.5. Data Persistence
*   **Local History:** Recent simulations must be saved to the browser's Local Storage.
*   **Cloud Connectivity (Optional):** Users must be able to connect to a Supabase backend by providing a URL and API Key to persist data across devices ("Bring Your Own Backend").

## 3. Non-Functional Requirements
*   **Aesthetics:** The UI must adhere to a "Sci-Fi / Engineering" aesthetic using dark mode, slate/cyan color palettes, and monospaced fonts.
*   **Performance:** 3D rendering must be optimized using React Three Fiber.
*   **Reliability:** The AI service layer must implement key rotation and retry logic to handle API rate limits (HTTP 429).
*   **Responsiveness:** The layout must be responsive across desktop and mobile devices.

## 4. System Constraints
*   **API Dependency:** Requires an active internet connection and a valid Google Gemini API Key.
*   **Browser Support:** Requires a modern browser supporting WebGL for 3D rendering.
