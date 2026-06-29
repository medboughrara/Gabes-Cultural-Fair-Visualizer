/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import StagePlannerHeader from './components/StagePlannerHeader';
import SeatingGrid from './components/SeatingGrid';
import ElevationProfile from './components/ElevationProfile';
import ControlPanel from './components/ControlPanel';
import ReservationPanel from './components/ReservationPanel';
import TunisianBannerCreator from './components/TunisianBannerCreator';
import AIRendererTab from './components/AIRendererTab';
import { Bench, LayoutParams, SeatingStats, GeneratedImage, AISession, ZoneType } from './types';
import { Sparkles, Map, Sliders, Brush, Compass, HelpCircle } from 'lucide-react';

const DEFAULT_LAYOUT: LayoutParams = {
  totalRows: 30,
  benchesPerColumn: {
    left: 4,
    center: 8,
    right: 4,
  },
  stageWidth: 20,
  stageHeight: 4,
  venueWidth: 50,
  venueDepth: 40,
  rowSpacing: 16,
  aisleWidth: 60,
  canopyStyle: 'striped',
  ambientSky: 'golden',
  lightsEnabled: true,
  foliageDensity: 'medium',
  bannerPattern: 'rhombus',
  patternColor: '#c0392b',
};

// Initial preset reservation dictionary to make the visualizer instantly occupied and active
const DEFAULT_RESERVATIONS: Record<string, { reservedBy: string; notes: string }> = {
  'R1-CC-B4': { reservedBy: 'Gabes Cultural Committee', notes: 'VIP front row central seating' },
  'R1-CC-B5': { reservedBy: 'Mayor of Gabes Delegation', notes: 'Honorary delegation seating' },
  'R2-CC-B3': { reservedBy: 'Tunisian Ministry of Culture', notes: 'Ministerial invitees' },
  'R10-CL-B2': { reservedBy: 'Local Radio Gafsa Crew', notes: 'Live coverage staff' },
  'R12-CR-B3': { reservedBy: 'National TV 1 Cameraman', notes: 'Camera mount space' },
  'R25-CC-B5': { reservedBy: 'Traditional Ceramics Guild', notes: 'Artisans delegation' },
};

export default function App() {
  const [layoutParams, setLayoutParams] = useState<LayoutParams>(DEFAULT_LAYOUT);
  const [reservations, setReservations] = useState<Record<string, { reservedBy: string; notes: string }>>(DEFAULT_RESERVATIONS);
  const [selectedBench, setSelectedBench] = useState<Bench | null>(null);
  
  // UI filter / search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<'all' | ZoneType>('all');
  const [showAisles, setShowAisles] = useState(true);
  const [showSightlines, setShowSightlines] = useState(true);

  // Active workspace backdrop state (can set any generated render as application wallpaper)
  const [activeBackdrop, setActiveBackdrop] = useState<string | null>(null);

  // AI Session State
  const [aiSession, setAiSession] = useState<AISession>({ status: 'idle', message: '' });
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);

  // Initialize gallery with a beautiful pre-designed simulated vector blueprint
  useEffect(() => {
    const defaultImage: GeneratedImage = {
      id: 'default-sim',
      prompt: 'Aerial perspective architectural visualization of an outdoor cultural fair in Gabes, Tunisia. 50m open-air arena at golden hour sunset, palm trees lining perimeter, 20m stage with red striped fabric canopy, wood benches organized in tiered height-zones.',
      imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
          <rect width="1600" height="900" fill="#FAF7F2" />
          <path d="M0,0 L1600,0 L1600,180 Q800,130 0,180 Z" fill="#F2EDE4" opacity="0.8" />
          <rect x="500" y="80" width="600" height="80" fill="#3D3831" />
          <rect x="550" y="20" width="500" height="60" fill="#C55A11" />
          <circle cx="800" cy="110" r="150" fill="#fff" opacity="0.25" />
          <text x="800" y="250" fill="#3D3831" font-family="serif" font-size="36" font-weight="bold" text-anchor="middle">GABES CULTURAL FAIR Blueprint</text>
          <text x="800" y="300" fill="#8C8375" font-family="sans-serif" font-size="18" text-anchor="middle">Click Generate to synthesize full AI photorealistic visuals</text>
        </svg>
      `),
      timestamp: new Date().toLocaleDateString(),
      style: 'Architectural Visualization',
      isCustom: false,
    };
    setGallery([defaultImage]);
  }, []);

  // Bench Layout Generation Algorithm
  const benches = useMemo(() => {
    const list: Bench[] = [];
    const totalRows = layoutParams.totalRows;
    const leftCols = layoutParams.benchesPerColumn.left;
    const centerCols = layoutParams.benchesPerColumn.center;
    const rightCols = layoutParams.benchesPerColumn.right;

    // SVG coordinate boundary setups
    const startY = 220;
    const endY = 720;
    const ySpacing = totalRows > 1 ? (endY - startY) / (totalRows - 1) : 0;

    // Define x boundary intervals for Left, Center, and Right seating columns
    const leftBlockXStart = 80;
    const leftBlockXEnd = 310;
    
    const centerBlockXStart = 380;
    const centerBlockXEnd = 620;
    
    const rightBlockXStart = 690;
    const rightBlockXEnd = 920;

    const benchSpacingX = 6;
    const benchH = 10;

    for (let r = 1; r <= totalRows; r++) {
      // Determine physical tiered height & zone
      let zone: ZoneType = 'front';
      let height = 0.0;
      let seatCount = 2; // Front rows are smaller, 2-seaters

      if (r <= 10) {
        zone = 'front';
        height = (r - 1) * 0.03; // gently rise by 3cm per row
        seatCount = 2;
      } else if (r <= 20) {
        zone = 'middle';
        height = 0.3 + (r - 11) * 0.05; // rise by 5cm per row in middle
        seatCount = 3; // 3-seaters in middle
      } else {
        zone = 'back';
        height = 0.8 + (r - 21) * 0.065; // rise by 6.5cm per row at back
        seatCount = 4; // 4-seaters at rear
      }

      const y = startY + (r - 1) * ySpacing;

      // 1. LEFT BLOCK COLUMN
      const leftBlockWidth = leftBlockXEnd - leftBlockXStart;
      const leftBenchW = (leftBlockWidth - (leftCols - 1) * benchSpacingX) / leftCols;
      for (let b = 0; b < leftCols; b++) {
        const x = leftBlockXStart + b * (leftBenchW + benchSpacingX);
        const id = `R${r}-CL-B${b + 1}`;
        const isReserved = !!reservations[id];

        // Sightline logic (center-front of stage is 500, 140)
        const dist = Math.sqrt(Math.pow(x + leftBenchW / 2 - 500, 2) + Math.pow(y - 140, 2));
        const sightline = Math.min(100, Math.max(70, Math.round(100 - (dist / 800) * 15 - (1.5 - height) * 4)));

        list.push({
          id,
          row: r,
          columnBlock: 'left',
          benchIndex: b + 1,
          seatCount,
          zone,
          height,
          sightline,
          x,
          y,
          width: leftBenchW,
          heightPx: benchH,
          reserved: isReserved,
          reservedBy: isReserved ? reservations[id].reservedBy : undefined,
          notes: isReserved ? reservations[id].notes : undefined,
        });
      }

      // 2. CENTER BLOCK COLUMN
      const centerBlockWidth = centerBlockXEnd - centerBlockXStart;
      const centerBenchW = (centerBlockWidth - (centerCols - 1) * benchSpacingX) / centerCols;
      for (let b = 0; b < centerCols; b++) {
        const x = centerBlockXStart + b * (centerBenchW + benchSpacingX);
        const id = `R${r}-CC-B${b + 1}`;
        const isReserved = !!reservations[id];

        const dist = Math.sqrt(Math.pow(x + centerBenchW / 2 - 500, 2) + Math.pow(y - 140, 2));
        const sightline = Math.min(100, Math.max(70, Math.round(100 - (dist / 800) * 15 - (1.5 - height) * 3)));

        list.push({
          id,
          row: r,
          columnBlock: 'center',
          benchIndex: b + 1,
          seatCount,
          zone,
          height,
          sightline,
          x,
          y,
          width: centerBenchW,
          heightPx: benchH,
          reserved: isReserved,
          reservedBy: isReserved ? reservations[id].reservedBy : undefined,
          notes: isReserved ? reservations[id].notes : undefined,
        });
      }

      // 3. RIGHT BLOCK COLUMN
      const rightBlockWidth = rightBlockXEnd - rightBlockXStart;
      const rightBenchW = (rightBlockWidth - (rightCols - 1) * benchSpacingX) / rightCols;
      for (let b = 0; b < rightCols; b++) {
        const x = rightBlockXStart + b * (rightBenchW + benchSpacingX);
        const id = `R${r}-CR-B${b + 1}`;
        const isReserved = !!reservations[id];

        const dist = Math.sqrt(Math.pow(x + rightBenchW / 2 - 500, 2) + Math.pow(y - 140, 2));
        const sightline = Math.min(100, Math.max(70, Math.round(100 - (dist / 800) * 15 - (1.5 - height) * 4)));

        list.push({
          id,
          row: r,
          columnBlock: 'right',
          benchIndex: b + 1,
          seatCount,
          zone,
          height,
          sightline,
          x,
          y,
          width: rightBenchW,
          heightPx: benchH,
          reserved: isReserved,
          reservedBy: isReserved ? reservations[id].reservedBy : undefined,
          notes: isReserved ? reservations[id].notes : undefined,
        });
      }
    }

    return list;
  }, [layoutParams, reservations]);

  // Seating statistics
  const stats: SeatingStats = useMemo(() => {
    const totalBenches = benches.length;
    const totalSeats = benches.reduce((acc, b) => acc + b.seatCount, 0);
    const reservedBenches = benches.filter((b) => b.reserved).length;
    const reservedSeats = benches.filter((b) => b.reserved).reduce((acc, b) => acc + b.seatCount, 0);

    const frontSeats = benches.filter((b) => b.zone === 'front').reduce((acc, b) => acc + b.seatCount, 0);
    const middleSeats = benches.filter((b) => b.zone === 'middle').reduce((acc, b) => acc + b.seatCount, 0);
    const backSeats = benches.filter((b) => b.zone === 'back').reduce((acc, b) => acc + b.seatCount, 0);

    const sumSightlines = benches.reduce((acc, b) => acc + b.sightline, 0);
    const avgSightline = totalBenches > 0 ? Math.round(sumSightlines / totalBenches) : 0;

    return {
      totalBenches,
      totalSeats,
      reservedSeats,
      reservedBenches,
      capacityByZone: {
        front: frontSeats,
        middle: middleSeats,
        back: backSeats,
      },
      avgSightline,
    };
  }, [benches]);

  // Handle bench reservations
  const handleReserve = (benchId: string, guestName: string, notes: string) => {
    const updated = {
      ...reservations,
      [benchId]: { reservedBy: guestName, notes },
    };
    setReservations(updated);

    // Sync active selection
    if (selectedBench && selectedBench.id === benchId) {
      setSelectedBench({
        ...selectedBench,
        reserved: true,
        reservedBy: guestName,
        notes,
      });
    }
  };

  const handleRelease = (benchId: string) => {
    const updated = { ...reservations };
    delete updated[benchId];
    setReservations(updated);

    // Sync active selection
    if (selectedBench && selectedBench.id === benchId) {
      setSelectedBench({
        ...selectedBench,
        reserved: false,
        reservedBy: undefined,
        notes: undefined,
      });
    }
  };

  // Helper to locate a seat in the grid by updating states
  const handleLocateBench = (bench: Bench) => {
    setSelectedBench(bench);
    setSearchQuery(bench.id);
    const element = document.getElementById(`svg-bench-${bench.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // AI API Integration: Generate Image from Express route
  const handleGenerateImage = async (prompt: string, aspectRatio: string, style: string) => {
    setAiSession({ status: 'generating', message: 'Connecting to server proxy...' });
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, style }),
      });
      const data = await response.json();

      if (data.imageUrl) {
        const newImage: GeneratedImage = {
          id: `ai-${Date.now()}`,
          prompt,
          imageUrl: data.imageUrl,
          timestamp: new Date().toLocaleDateString(),
          style,
          isCustom: !data.isFallback,
        };
        setGallery((prev) => [newImage, ...prev]);
        setAiSession({
          status: 'success',
          message: data.message || 'AI rendering generated successfully!',
        });
      } else {
        throw new Error(data.error || 'Server did not return a valid rendering.');
      }
    } catch (err: any) {
      console.error(err);
      setAiSession({
        status: 'error',
        message: err.message || 'Gemini API connection error. Traditional vector blueprint simulated instead!',
      });
    }
  };

  // AI API Integration: Edit existing image
  const handleEditImage = async (prompt: string, base64Image: string) => {
    setAiSession({ status: 'generating', message: 'Synthesizing edit request...' });
    try {
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, base64Image }),
      });
      const data = await response.json();

      if (data.imageUrl) {
        const newImage: GeneratedImage = {
          id: `ai-edit-${Date.now()}`,
          prompt: `Edit: ${prompt}`,
          imageUrl: data.imageUrl,
          timestamp: new Date().toLocaleDateString(),
          style: 'AI Edited Perspective',
          isCustom: !data.isFallback,
        };
        setGallery((prev) => [newImage, ...prev]);
        setAiSession({
          status: 'success',
          message: data.message || 'Scene edit merged successfully!',
        });
      } else {
        throw new Error(data.error || 'Server could not complete edit.');
      }
    } catch (err: any) {
      console.error(err);
      setAiSession({
        status: 'error',
        message: err.message || 'Editing service failed. Blueprint simulated instead.',
      });
    }
  };

  const handleResetLayout = () => {
    setLayoutParams(DEFAULT_LAYOUT);
    setReservations(DEFAULT_RESERVATIONS);
    setSelectedBench(null);
    setSearchQuery('');
  };

  return (
    <div
      className="min-h-screen bg-natural-bg text-natural-text font-sans relative"
      id="app-root-container"
      style={
        activeBackdrop
          ? {
              backgroundImage: `linear-gradient(rgba(250,247,242,0.92), rgba(250,247,242,0.95)), url(${activeBackdrop})`,
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
            }
          : undefined
      }
    >
      {/* Brand Header */}
      <StagePlannerHeader
        totalSeats={stats.totalSeats}
        reservedSeats={stats.reservedSeats}
        avgSightline={stats.avgSightline}
      />

      {/* Main Layout Workspace Grid */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6" id="app-workspace">
        
        {/* Row 1: Interactive Arena Plan + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map Visualizer Grid (Takes 2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <SeatingGrid
              layoutParams={layoutParams}
              benches={benches}
              onSelectBench={setSelectedBench}
              selectedBench={selectedBench}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedZoneFilter={selectedZoneFilter}
              setSelectedZoneFilter={setSelectedZoneFilter}
              showAisles={showAisles}
              showSightlines={showSightlines}
              onReserveQuick={(id) => handleReserve(id, 'Quick Guest', 'Quick-logged seat')}
            />
            
            {/* Elevation Cross-Section Diagram */}
            <ElevationProfile
              layoutParams={layoutParams}
              benches={benches}
            />
          </div>

          {/* Right Panel: Seating form & params config (Takes 1/3 width) */}
          <div className="flex flex-col gap-5">
            {/* Seating form Desk */}
            <ReservationPanel
              selectedBench={selectedBench}
              onReserve={handleReserve}
              onRelease={handleRelease}
              onClose={() => setSelectedBench(null)}
              allBenches={benches}
              onLocateBench={handleLocateBench}
            />

            {/* Layout parameters */}
            <ControlPanel
              layoutParams={layoutParams}
              onChangeParams={setLayoutParams}
              onResetLayout={handleResetLayout}
            />

            {/* Tunisian banner design tool */}
            <TunisianBannerCreator
              layoutParams={layoutParams}
              onChangeParams={setLayoutParams}
            />
          </div>
        </div>

        {/* Row 2: AI Perspective Workspace (Gemini generator & editor) */}
        <AIRendererTab
          gallery={gallery}
          onGenerateImage={handleGenerateImage}
          onEditImage={handleEditImage}
          session={aiSession}
          onSetBackdrop={setActiveBackdrop}
          activeBackdrop={activeBackdrop}
        />

        {/* Floating backdrop reset toggle if active */}
        {activeBackdrop && (
          <button
            onClick={() => setActiveBackdrop(null)}
            className="fixed bottom-6 left-6 bg-natural-dark text-white font-bold font-mono text-xs px-3.5 py-2 rounded-full shadow-lg border border-natural-border-light cursor-pointer hover:bg-[#2D2924] z-50 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#FFC000]" />
            <span>Reset Canvas Wall</span>
          </button>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-natural-border-light bg-natural-aside py-6 text-center text-xs text-natural-muted">
        <p>© 2026 Gabes Cultural Fair Infrastructure. Architectural modeling designed for sand-flat conditions.</p>
        <p className="mt-1 font-mono">Chott El-Jerid Perimeter • Governorate of Gabes, Tunisia</p>
      </footer>
    </div>
  );
}
