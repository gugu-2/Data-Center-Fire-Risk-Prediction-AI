# AI Data Center Rack Risk Prediction Dashboard

This plan outlines the development of a high-fidelity, interactive web application to monitor AI data center racks, visualize real-time temperature and GPU metrics, and predict potential fire risks before they occur.

## User Review Required

> [!IMPORTANT]
> **Simulated Data vs. Real Backend**
> For this initial version, the "predictive AI" and real-time metrics (temperature, GPU load, and data from your software integrations and thermal/security cameras) will be simulated using client-side JavaScript. This allows us to build and demonstrate a highly dynamic and interactive dashboard immediately, representing the integrated data from your software and thermal cams. Integrating the real backend and actual live camera feeds would be a subsequent phase once the UI/UX is finalized. Please confirm if this approach is acceptable.

> [!WARNING]
> **Styling Choice**
> Per my instructions to provide premium custom aesthetics, I will build this using Vanilla CSS (with CSS variables for a strict design system) rather than a utility framework like Tailwind, ensuring maximum control over complex glowing effects, micro-animations, and responsive layouts.

## Requirements Confirmed

- **Data Sources:** The system is designed to ingest data from software integrations and your installed thermal/security cameras (simulated for the initial UI prototype to show how heat maps would look).
- **Default Racks:** 100 racks visualized by default.
- **Views:** The dashboard will support toggling between a 2D floor plan and a dynamic grid view.

## Proposed Changes

We will create a new Vite React application in the `Heat circuit` directory using Vanilla CSS and standard React patterns.

### Setup and Configuration

#### [NEW] Vite React App Initialization
Initialize a new React application using Vite with TypeScript. Install necessary UI dependencies like `lucide-react` for icons and `recharts` for data visualization.

### Core Layout and Design System

#### [NEW] `src/index.css`
Establish the core design system. This includes custom CSS variables for a deep dark sci-fi aesthetic, utilizing glowing accents (cyan, neon blue, warning orange, critical red) and setting up typography (e.g., Google Fonts 'Inter' or 'Outfit').

#### [NEW] `src/App.tsx`
The main application layout, featuring:
- A top navigation/status bar showing global data center health.
- A main content area split between the Rack Grid visualization and a details/analytics panel.
- An alert overlay system for critical predictions.

### Components

#### [NEW] `src/components/RackViews.tsx` & `src/components/RackViews.css`
A toggleable visual representation of the 100 server racks, supporting two views:
1. **Dynamic Grid View**: A dense, organized grid where racks change color and pulse based on their simulated real-time temperature and predicted fire risk.
2. **2D Floor Plan View**: A spatial layout of the data center showing the racks in their physical configuration, incorporating simulated thermal camera overlay data to highlight areas where "temperature is rising than other places." 

#### [NEW] `src/components/RackDetailPanel.tsx` & `src/components/RackDetailPanel.css`
A slide-out or side panel that appears when a specific rack is selected. It will display:
- Live line charts of temperature and GPU load over time.
- The calculated "Fire Risk Probability" score.
- Action buttons to "Initiate Precision Cooling" or "Emergency Shutdown".

#### [NEW] `src/components/AlertSystem.tsx` & `src/components/AlertSystem.css`
A dynamic notification system that pops up when a rack's predictive risk exceeds a safe threshold, prompting immediate user action.

### Logic and State Management

#### [NEW] `src/hooks/useDataCenterSimulation.ts`
A custom React hook that generates realistic, fluctuating telemetry data (temperature, power draw, GPU utilization) and calculates a predictive risk score based on rapid temperature rises or sustained high loads.

## Verification Plan

### Automated/Local Tests
- Run `npm run dev` to verify the Vite server starts correctly.
- Verify that the simulated data hook successfully updates component state every 1-2 seconds without causing performance lag.

### Manual Verification
  - **Visuals**: Check that the interface meets the "Premium" criteria with dark mode aesthetics, smooth gradients, and clear visual hierarchy.
- **Interactivity**: Click on individual racks to ensure the detail panel populates with the correct simulated history.
- **Alert Flow**: Wait for a rack to hit a "critical risk" state and ensure the alert system effectively captures attention and allows for simulated mitigation (cooling/shutdown).

## Phase 2: AI Vision Analysis Module

Based on the requirement to analyze simulated camera footages (thermal heat maps and security cameras) and provide conclusions, we will add an "AI Vision Analysis" module to the dashboard.

### Proposed Changes for Phase 2

#### [MODIFY] `src/components/RackDetailPanel.tsx` & `.css`
We will expand the side panel to include a new **AI Vision Analysis** section when a rack is selected. This section will feature:
1. **Simulated Camera Feeds**: Two side-by-side mock image feeds—one representing the "Thermal Camera Heat Map" and the other representing the standard "Security Camera Visual Feed". We will use our image generation capabilities to create authentic, premium-looking mockups of these feeds.
2. **AI Conclusion Synthesizer**: A dynamic text block that analyzes the mock feeds alongside the rack's real-time data (`temperature`, `visualSmokeDetected`, `thermalAnomalyScore`). It will output a clear, actionable conclusion (e.g., "Thermal Feed shows 40% localized heat gain. Visual Feed clear. Conclusion: Warning state, monitor closely.").

### User Review Required

> [!IMPORTANT]
> For this frontend prototype, the actual "video feeds" will be static placeholder images that we generate to look like real thermal/security feeds. The "AI Conclusion" will be dynamic text generated by logic on the frontend based on the rack's telemetry, simulating what an actual AI vision model would output. Please confirm if this simulated approach is acceptable for Phase 2.

---

## Phase 3: Enterprise/Defense Aesthetic Overhaul & Advanced Routing

Based on the feedback that the UI feels too generic/AI-generated, we will pivot the design language to a highly austere, professional, Palantir/Anduril-inspired aesthetic. This involves moving away from "glowy/neon" effects and towards strict, military-grade precision interfaces (deep blacks, sharp 1px borders, high-density monospace data arrays, and highly deliberate, non-bloomy accent colors).

### Proposed Changes for Phase 3

#### 1. Architectural Routing & Navigation
- **[MODIFY] `src/App.tsx`**: We will introduce a top-level sidebar or tabbed navigation system to support multiple distinct full-page screens, moving away from the single-page overlay model.

#### 2. Advanced Filtering
- **[MODIFY] `src/components/RackViews.tsx`**: Add persistent, clickable filter toggles at the top of the command view to instantly filter the 100 racks by **"Total (All)"**, **"Warnings"**, and **"Critical"**.

#### 3. Dedicated Notification Screen
- **[NEW] `src/components/NotificationLog.tsx`**: A completely new full-screen view. It will maintain a persistent array of historical events. Every time a rack breaches a warning or critical threshold, a detailed log entry (with precise timestamp, rack ID, and specific anomaly reason) will be added to this centralized ledger.

#### 4. Dedicated "Deep Vision" AI Screen
- **[NEW] `src/components/AIVisionConsole.tsx`**: We will expand the AI Vision Analysis from a small side-panel section into a massive, dedicated full-screen console. When a user clicks "Deep Analyze" on a rack, they are taken here.
- It will feature:
  - Enlarged, central views of the Thermal and Security feeds.
  - Simulated "frame-by-frame" scanning animations overlaying the images.
  - Granular telemetry breakdowns (simulating bounding boxes, hardware component identification, and multi-factor probability vectors).

### User Review Required

> [!WARNING]
> **Complete CSS Overhaul**
> Achieving the Palantir/Anduril look requires ripping out almost all the current CSS (the rounded corners, soft gradients, and neon glows) in favor of harsh right angles, muted dark grays, stark white text, and grid-paper backgrounds. Please confirm you are ready to completely replace the current aesthetic.
