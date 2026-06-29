# Gabes Cultural Fair Visualizer

An elegant, interactive architectural seating planner and AI-powered generative design workspace tailored for a 50-meter open-air cultural fair in **Gabes, Tunisia**. Situated along the picturesque Chott El-Jerid perimeter, this application empowers event planners and architects to design, customize, and visually manifest a traditional Saharan arena.

[![Gabes Cultural Fair Visualizer Banner](https://img.shields.io/badge/Theme-Tunisian%20Desert%20Dusk-E28743?style=for-the-badge)](https://github.com/)

---

## 🌟 Key Features

### 🏛️ 1. Interactive Blueprint Floorplan (`SeatingGrid`)
* **Dynamic SVG Layout**: Fully interactive, highly detailed top-down view of the 50m arena.
* **Three Structured Height Zones**:
  * **Oasis Front** (Rows 1–10): Low-rise ground-level seating, closest to center stage.
  * **Amber Heart** (Rows 11–20): Optimized mid-height incline to bypass front row sightlines.
  * **Terracotta Ridge** (Rows 21–30): High-tiered panoramic slope offering desert landscape vistas.
* **Seat Management**: Click benches to inspect elevation, select seats, search via Bench ID, filter by capacity, and book spectators live.

### 📐 2. Tiered Sightline Elevation Profile (`ElevationProfile`)
* **Side-Angle Cross-Section**: Visualizes how benches rise gradually (from `0.0m` at ground-level up to `+1.50m` at the rear ridge).
* **Raycast Sightlines**: Projects geometric dotted orange/terracotta sightlines from the topmost row directly to the stage micro-stand, ensuring 100% obstruction-free seating.
* **Geotechnical Scales**: Styled with standard 1:50 model metrics, modeling Gabes sand-flat conditions.

### 🎨 3. Tunisian Banner Customizer (`TunisianBannerCreator`)
* **Traditional Berber Motifs**: Configure Boundary wall decorative banners using authentic geometric weaves inspired by Tunisian craftsmanship.
  * *Triangles*: Classic Chevron drapes.
  * *Medina Diamonds*: Intersecting weaves.
  * *Sand Dunes*: Symmetrical wave panels.
* **Natural Mineral Dyes**: Authentic pre-set color schemes:
  * **Oasis Green**: Sourced from Gabes date palms.
  * **Terracotta Clay**: Traditional pottery earth-tone red.
  * **Ochre Sand**: Saffron warm golden-yellow.
  * **Royal Indigo**: Deep desert night blue dye.

### 🌅 4. Atmospheric Dusk Controls (`ControlPanel`)
* **Ambient Sky Lights**: Toggle the lighting from a warm, rich Golden Hour, to a deep Sahara Night, or standard Desert Dusk.
* **Festive String Garlands**: Overlay glowing fairy-light arches directly across the seating plan.
* **Perimeter Foliage Density**: Adjust density settings for native date palms and olive trees lining the outer perimeter.
* **Physical Controls**: Alter row structures, center-benches distribution, and the stage canopy styles (Solid, Striped, Wave).

### 🤖 5. Gemini AI Generative Visualizer (`AIRendererTab`)
* **Server-Side API Proxy**: Fully-stack secure connection using the modern `@google/genai` SDK.
* **3D Perspective Synthesis**: Instantly generate high-fidelity, photorealistic 3D renders matching your current configured layout state.
* **Iterative Image Editing**: Feed custom text modifications (e.g., *"Make it Sahara night sky with starry galaxies"*, *"Add a dense crowd of spectators"*), to re-render and modify the visual canvas iteratively.
* **Wall Backdrop Mode**: Set any generated or blueprint image as an immersive background texture of the active workspace canvas.

---

## 🛠️ Tech Stack & Standards

* **Frontend**: React 18 with Vite and TypeScript.
* **Styling**: Tailwind CSS utilizing a custom-tailwed natural-color palette (sands, terracotta, and soft clays).
* **Animations**: Fluid micro-transitions and indicator pulses.
* **Icons**: Fully standard `lucide-react` graphics.
* **Backend**: Express.js server running in developer mode with integrated Vite middleware.
* **AI Engine**: Google Gemini Developer API proxy securely hosted server-side (using `process.env.GEMINI_API_KEY`).
* **Standards**: Pure React functional hooks, 100% strictly compliant DOM SVG properties (e.g., `stopColor`, `strokeWidth`, `floodOpacity`), and robust responsive design.

---

## 🚀 Getting Started

### 📋 Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [NPM](https://www.npmjs.com/)

### 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gabes-cultural-fair-visualizer.git
   cd gabes-cultural-fair-visualizer
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and define your Gemini API credentials:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(A `.env.example` is provided for reference)*

### 💻 Running the Application

* **Development Mode**: Boots up the local hot-reloading development server:
  ```bash
  npm run dev
  ```
  Open `http://localhost:3000` in your web browser.

* **Production Build**: Compiles both the React bundle and server bundle:
  ```bash
  npm run build
  ```

* **Production Execution**: Launches the compiled standalone server:
  ```bash
  npm run start
  ```

---

## 📁 Directory Structure

```text
├── src/
│   ├── components/
│   │   ├── AIRendererTab.tsx          # Gemini image synthesis & edit panels
│   │   ├── ControlPanel.tsx           # Atmosphere & architectural slider controls
│   │   ├── ElevationProfile.tsx       # Side tiered cross-section sightline visualizer
│   │   ├── ReservationPanel.tsx       # Seat reservation directory & register
│   │   ├── SeatingGrid.tsx            # Main SVG blueprint floorplan seating layout
│   │   ├── StagePlannerHeader.tsx     # Workspace top navbar & search controls
│   │   └── TunisianBannerCreator.tsx  # Berber motif customizer & live motif preview
│   ├── App.tsx                        # Core Application shell & global state orchestrator
│   ├── index.css                      # Global styles and custom Tailwind setup
│   ├── main.tsx                       # React application mount script
│   └── types.ts                       # Shared TypeScript interface definitions
├── server.ts                          # Express.js server with Vite proxy middleware
├── .env.example                       # Documentation for required environment keys
├── metadata.json                      # AI Studio platform configuration metadata
├── package.json                       # Scripts, dev dependencies, and libraries
└── tsconfig.json                      # Strict TypeScript compiler options
```

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.

*Crafted for architectural safety and cultural representation at the Chott El-Jerid Perimeter • Governorate of Gabes, Tunisia.*
