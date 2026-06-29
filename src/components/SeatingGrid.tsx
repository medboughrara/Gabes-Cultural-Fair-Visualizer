/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Bench, LayoutParams, ZoneType } from '../types';
import { Search, Eye, Sparkles, Filter, Trees, Check, Sliders } from 'lucide-react';

interface SeatingGridProps {
  layoutParams: LayoutParams;
  benches: Bench[];
  onSelectBench: (bench: Bench) => void;
  selectedBench: Bench | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedZoneFilter: 'all' | ZoneType;
  setSelectedZoneFilter: (filter: 'all' | ZoneType) => void;
  showAisles: boolean;
  showSightlines: boolean;
  onReserveQuick: (benchId: string) => void;
}

export default function SeatingGrid({
  layoutParams,
  benches,
  onSelectBench,
  selectedBench,
  searchQuery,
  setSearchQuery,
  selectedZoneFilter,
  setSelectedZoneFilter,
  showAisles,
  showSightlines,
  onReserveQuick,
}: SeatingGridProps) {
  const [hoveredBench, setHoveredBench] = React.useState<Bench | null>(null);

  // Filter benches based on search query and zone selection
  const filteredBenches = useMemo(() => {
    return benches.filter((bench) => {
      const matchesSearch =
        searchQuery === '' ||
        bench.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bench.reservedBy && bench.reservedBy.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesZone = selectedZoneFilter === 'all' || bench.zone === selectedZoneFilter;

      return matchesSearch && matchesZone;
    });
  }, [benches, searchQuery, selectedZoneFilter]);

  // Handle sky background coloring for the map container
  const skyBackground = useMemo(() => {
    switch (layoutParams.ambientSky) {
      case 'dusk':
        return 'from-[#FFE8E1] via-[#FFF3E1] to-[#FAF7F2]';
      case 'night':
        return 'from-[#2D2924] via-[#3D3831] to-[#1E1C18]';
      case 'golden':
      default:
        return 'from-[#FFEBD1]/50 via-[#FFF5E5]/40 to-[#FAF7F2]/50';
    }
  }, [layoutParams.ambientSky]);

  // Pattern color mappings
  const patternStrokeColor = layoutParams.patternColor || '#C55A11';

  return (
    <div className="flex flex-col gap-4 bg-white border border-natural-border-light rounded-xl p-5 shadow-sm" id="seating-grid-section">
      {/* Map Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-natural-border-light pb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-natural-accent" />
          <h2 className="font-serif font-bold text-natural-dark text-lg">Interactive Blueprint Floorplan</h2>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-natural-muted" />
            <input
              type="text"
              placeholder="Search seat ID (e.g., R5-C1) or guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-full sm:w-60 rounded-lg border border-natural-border text-sm focus:outline-none focus:ring-2 focus:ring-natural-accent bg-natural-bg/50 text-natural-text placeholder-natural-placeholder"
            />
          </div>

          {/* Zone Filter */}
          <div className="flex bg-natural-aside p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedZoneFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedZoneFilter === 'all' ? 'bg-white text-natural-dark shadow-xs' : 'text-natural-muted hover:text-natural-dark'
              }`}
            >
              All Zones
            </button>
            <button
              onClick={() => setSelectedZoneFilter('front')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                selectedZoneFilter === 'front' ? 'bg-white text-[#558139] shadow-xs font-semibold' : 'text-natural-muted hover:text-[#558139]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-zone-front" />
              Front
            </button>
            <button
              onClick={() => setSelectedZoneFilter('middle')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                selectedZoneFilter === 'middle' ? 'bg-white text-[#B38600] shadow-xs font-semibold' : 'text-natural-muted hover:text-[#B38600]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-zone-middle" />
              Middle
            </button>
            <button
              onClick={() => setSelectedZoneFilter('back')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                selectedZoneFilter === 'back' ? 'bg-white text-natural-accent shadow-xs font-semibold' : 'text-natural-muted hover:text-natural-accent'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-zone-back" />
              Rear
            </button>
          </div>
        </div>
      </div>

      {/* SVG Stage and Arena Canvas */}
      <div className={`relative overflow-hidden rounded-xl border border-natural-border bg-radial ${skyBackground} p-2 transition-all duration-700`} id="floorplan-canvas">
        <svg
          viewBox="0 0 1000 760"
          className="w-full h-auto drop-shadow-md select-none"
          id="svg-venue-planner"
        >
          {/* DEF DEFINITIONS */}
          <defs>
            <linearGradient id="sandyFloor" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#E8E2D6" />
              <stop offset="100%" stopColor="#FAF7F2" />
            </linearGradient>
            
            {/* Soft shadow filter */}
            <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.12" />
            </filter>

            {/* Stage Amber Light Gradient */}
            <radialGradient id="stageRays" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#FFC000" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#FFE1AF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
            </radialGradient>

            {/* Tunisian Banner Pattern */}
            <pattern id="bannerStripes" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0,20 L 40,20 M 20,0 L 20,40" stroke="#C55A11" strokeWidth="1.5" opacity="0.3" />
              <path d="M 0,0 L 40,40 M 0,40 L 40,0" stroke="#FFC000" strokeWidth="0.75" opacity="0.15" />
            </pattern>
          </defs>

          {/* Sandy Flat Ground Base */}
          <rect x="0" y="0" width="1000" height="760" fill="url(#sandyFloor)" opacity="0.95" />

          {/* OVERHEAD AMBIENT ATMOSPHERE */}
          {/* Night dark overlay */}
          {layoutParams.ambientSky === 'night' && (
            <rect x="0" y="0" width="1000" height="760" fill="#0f172a" opacity="0.5" style={{ mixBlendMode: 'multiply' }} />
          )}
          {/* Dusk pink/purple overlay */}
          {layoutParams.ambientSky === 'dusk' && (
            <rect x="0" y="0" width="1000" height="760" fill="#db2777" opacity="0.12" style={{ mixBlendMode: 'color-burn' }} />
          )}

          {/* STAGE AREA (Top Center) */}
          <g id="stage-arena" filter="url(#soft-shadow)">
            {/* Ambient Lighting Rays */}
            {layoutParams.lightsEnabled && (
              <g opacity="0.9" style={{ mixBlendMode: 'screen' }}>
                <polygon points="500,80 150,760 850,760" fill="url(#stageRays)" />
                <polygon points="400,80 100,760 600,760" fill="url(#stageRays)" opacity="0.3" />
                <polygon points="600,80 400,760 900,760" fill="url(#stageRays)" opacity="0.3" />
              </g>
            )}

            {/* Stage Platform Base */}
            <path
              d="M 380,80 L 620,80 L 650,140 L 350,140 Z"
              fill="#3D3831"
              stroke="#2D2924"
              strokeWidth="2"
            />
            {/* Front Stage Shadow/Depth step */}
            <path d="M 350,140 L 650,140 L 650,148 L 350,148 Z" fill="#1C1A17" />

            {/* Canopy Back wall */}
            <path d="M 380,20 L 620,20 L 620,80 L 380,80 Z" fill="#F2EDE4" opacity="0.85" />

            {/* Fabric Canopy Tent Roof (Rising Arch) */}
            {layoutParams.canopyStyle === 'striped' ? (
              <g>
                <path d="M 360,20 Q 500,-15 640,20 L 620,35 Q 500,0 380,35 Z" fill="#FAF7F2" />
                <path d="M 360,20 L 390,30 L 410,20 L 440,30 L 460,20 L 490,30 L 510,20 L 540,30 L 560,20 L 590,30 L 610,20 L 640,20 Z" fill="#C55A11" opacity="0.7" />
              </g>
            ) : layoutParams.canopyStyle === 'wave' ? (
              <path d="M 360,20 Q 430,5 500,20 Q 570,5 640,20 L 620,35 Q 500,10 380,35 Z" fill="#FFC000" />
            ) : (
              <path d="M 360,20 Q 500,-10 640,20 L 620,35 Q 500,10 380,35 Z" fill="#FAF7F2" />
            )}

            {/* Canopy Stage Pillars */}
            <rect x="375" y="20" width="8" height="60" fill="#9e9e9e" />
            <rect x="617" y="20" width="8" height="60" fill="#9e9e9e" />

            {/* Stage Text */}
            <text
              x="500"
              y="115"
              fill="#ffffff"
              fontFamily="system-ui, sans-serif"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              letterSpacing="3"
              opacity="0.95"
            >
              TUNISIAN NATIONAL STAGE (20M)
            </text>
          </g>

          {/* PERIMETER FOLIAGE (Palm and Olive trees flanking sides) */}
          <g id="perimeter-flora" opacity="0.85">
            {/* Left flank trees */}
            <g transform="translate(60, 200)">
              <line x1="0" y1="0" x2="10" y2="-60" stroke="#5d4037" strokeWidth="6" strokeLinecap="round" />
              <path d="M 10,-60 Q -40,-90 -60,-80 M 10,-60 Q -20,-110 -10,-120 M 10,-60 Q 30,-110 40,-100 M 10,-60 Q 60,-80 50,-60 M 10,-60 Q 20,-40 0,-40" stroke="#1b5e20" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
            <g transform="translate(45, 450)">
              <line x1="0" y1="0" x2="5" y2="-70" stroke="#5d4037" strokeWidth="8" strokeLinecap="round" />
              <path d="M 5,-70 Q -45,-100 -65,-90 M 5,-70 Q -25,-120 -15,-130 M 5,-70 Q 35,-120 45,-110 M 5,-70 Q 65,-90 55,-70" stroke="#2e7d32" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>

            {/* Right flank trees */}
            <g transform="translate(940, 210)">
              <line x1="0" y1="0" x2="-10" y2="-60" stroke="#5d4037" strokeWidth="6" strokeLinecap="round" />
              <path d="M -10,-60 Q 40,-90 60,-80 M -10,-60 Q 20,-110 10,-120 M -10,-60 Q -30,-110 -40,-100 M -10,-60 Q -60,-80 -50,-60" stroke="#1b5e20" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
            <g transform="translate(950, 480)">
              <line x1="0" y1="0" x2="-5" y2="-75" stroke="#5d4037" strokeWidth="8" strokeLinecap="round" />
              <path d="M -5,-75 Q 45,-105 65,-95 M -5,-75 Q 25,-125 15,-135 M -5,-75 Q -35,-125 -45,-115 M -5,-75 Q -65,-95 -55,-75" stroke="#2e7d32" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
          </g>

          {/* TUNISIAN DECORATIVE GEOMETRIC BANNER FLAGS */}
          <g id="decorative-banner-flags" opacity="0.9">
            {/* Banner Guide lines */}
            <path d="M 20,180 Q 200,195 350,180" fill="none" stroke="#b0bec5" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M 650,180 Q 800,195 980,180" fill="none" stroke="#b0bec5" strokeWidth="1" strokeDasharray="2,2" />

            {/* Banners Drawing left side */}
            {layoutParams.bannerPattern === 'triangle' ? (
              <g>
                <polygon points="50,183 75,185 62,210" fill="#c0392b" />
                <polygon points="85,186 110,188 97,213" fill="#e67e22" />
                <polygon points="120,189 145,190 132,215" fill="#16a085" />
                <polygon points="155,191 180,192 167,217" fill="#f1c40f" />
                <polygon points="190,192 215,193 202,218" fill="#c0392b" />
                <polygon points="225,193 250,194 237,219" fill="#16a085" />
                <polygon points="260,193 285,192 272,217" fill="#f1c40f" />
                <polygon points="295,191 320,189 307,214" fill="#e67e22" />
              </g>
            ) : layoutParams.bannerPattern === 'rhombus' ? (
              <g>
                <polygon points="62,185 75,195 62,205 49,195" fill="#e67e22" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="102,188 115,198 102,208 89,198" fill="#c0392b" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="142,190 155,200 142,210 129,200" fill="#16a085" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="182,192 195,202 182,212 169,202" fill="#f1c40f" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="222,193 235,203 222,213 209,203" fill="#e67e22" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="262,193 275,203 262,213 249,203" fill="#c0392b" stroke={patternStrokeColor} strokeWidth="1" />
              </g>
            ) : (
              /* Star Shape representation */
              <g fill="#c0392b" stroke={patternStrokeColor} strokeWidth="0.5">
                <circle cx="62" cy="195" r="8" />
                <circle cx="102" cy="198" r="8" fill="#16a085" />
                <circle cx="142" cy="200" r="8" fill="#f1c40f" />
                <circle cx="182" cy="202" r="8" />
                <circle cx="222" cy="203" r="8" fill="#16a085" />
                <circle cx="262" cy="203" r="8" fill="#e67e22" />
              </g>
            )}

            {/* Banners Drawing right side */}
            {layoutParams.bannerPattern === 'triangle' ? (
              <g>
                <polygon points="660,189 685,191 672,214" fill="#16a085" />
                <polygon points="700,192 725,193 712,217" fill="#f1c40f" />
                <polygon points="740,193 765,194 752,219" fill="#c0392b" />
                <polygon points="780,193 805,193 792,218" fill="#e67e22" />
                <polygon points="820,192 845,191 832,216" fill="#16a085" />
                <polygon points="860,190 885,188 872,213" fill="#f1c40f" />
                <polygon points="900,186 925,184 912,209" fill="#c0392b" />
                <polygon points="940,182 965,180 952,205" fill="#e67e22" />
              </g>
            ) : (
              <g>
                <polygon points="682,192 695,202 682,212 669,202" fill="#c0392b" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="722,193 735,203 722,213 709,203" fill="#16a085" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="762,193 775,203 762,213 749,203" fill="#f1c40f" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="802,193 815,203 802,213 789,203" fill="#e67e22" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="842,192 855,202 842,212 829,202" fill="#c0392b" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="882,190 895,200 882,210 869,200" fill="#16a085" stroke={patternStrokeColor} strokeWidth="1" />
                <polygon points="922,186 935,196 922,206 909,196" fill="#f1c40f" stroke={patternStrokeColor} strokeWidth="1" />
              </g>
            )}
          </g>

          {/* OVERHEAD FESTIVE FESTOON LIGHTS */}
          {layoutParams.lightsEnabled && (
            <g opacity="0.85" filter="drop-shadow(0px 2px 4px rgba(255,255,255,0.25))">
              {/* Curved glowing wire lines */}
              <path d="M 80,180 Q 250,220 500,210 Q 750,220 920,180" fill="none" stroke="#fff8e1" strokeWidth="1.5" />
              <path d="M 60,350 Q 250,400 500,380 Q 750,400 940,350" fill="none" stroke="#fff8e1" strokeWidth="1.5" opacity="0.7" />
              <path d="M 40,540 Q 250,600 500,570 Q 750,600 960,540" fill="none" stroke="#fff8e1" strokeWidth="1.2" opacity="0.5" />

              {/* Glowing bulb elements */}
              <g fill="#fff59d">
                <circle cx="200" cy="195" r="5" />
                <circle cx="350" cy="204" r="5" />
                <circle cx="500" cy="210" r="5" />
                <circle cx="650" cy="204" r="5" />
                <circle cx="800" cy="195" r="5" />

                <circle cx="200" cy="370" r="4" opacity="0.8" />
                <circle cx="350" cy="382" r="4" opacity="0.8" />
                <circle cx="500" cy="380" r="4" opacity="0.8" />
                <circle cx="650" cy="382" r="4" opacity="0.8" />
                <circle cx="800" cy="370" r="4" opacity="0.8" />
              </g>
            </g>
          )}

          {/* MAIN AISLES (Lines visual markers when toggle is on) */}
          {showAisles && (
            <g opacity="0.35" stroke="#795548" strokeWidth="4" strokeDasharray="8,6">
              {/* Central vertical Aisle */}
              <line x1="500" y1="160" x2="500" y2="740" />
              {/* Left Lateral Aisle separator */}
              <line x1="335" y1="160" x2="210" y2="740" />
              {/* Right Lateral Aisle separator */}
              <line x1="665" y1="160" x2="790" y2="740" />
            </g>
          )}

          {/* INTERACTIVE BENCHES (THE SEATS) */}
          <g id="all-benches-layout" filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.08))">
            {filteredBenches.map((bench) => {
              const isSelected = selectedBench && selectedBench.id === bench.id;
              const isHovered = hoveredBench && hoveredBench.id === bench.id;
              
              // Base color by zone
              let seatColor = '#A9D18E'; // Oasis Front
              let seatStroke = '#709d56';
              
              if (bench.zone === 'middle') {
                seatColor = '#FFC000'; // Amber Heart
                seatStroke = '#cc9900';
              } else if (bench.zone === 'back') {
                seatColor = '#C55A11'; // Terracotta Ridge
                seatStroke = '#8d3e0c';
              }

              // Overriding styling based on interactive state
              if (bench.reserved) {
                seatColor = '#D9D1C2'; // Reserved/Occupied neutral warm stone
                seatStroke = '#A19A8E';
              }

              if (isHovered) {
                seatStroke = '#3D3831';
              }

              return (
                <g
                  key={bench.id}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredBench(bench)}
                  onMouseLeave={() => setHoveredBench(null)}
                  onClick={() => onSelectBench(bench)}
                  id={`svg-bench-${bench.id}`}
                >
                  {/* Outer glow ring if selected */}
                  {isSelected && (
                    <rect
                      x={bench.x - 3}
                      y={bench.y - 3}
                      width={bench.width + 6}
                      height={bench.heightPx + 6}
                      rx="3"
                      fill="none"
                      stroke="#C55A11"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Highlight match ring from search */}
                  {searchQuery && (
                    <rect
                      x={bench.x - 4}
                      y={bench.y - 4}
                      width={bench.width + 8}
                      height={bench.heightPx + 8}
                      rx="4"
                      fill="none"
                      stroke="#FFC000"
                      strokeWidth="2"
                    />
                  )}

                  {/* Main Seat block rectangle representation */}
                  <rect
                    x={bench.x}
                    y={bench.y}
                    width={bench.width}
                    height={bench.heightPx}
                    rx="1.5"
                    fill={seatColor}
                    stroke={seatStroke}
                    strokeWidth={isSelected || isHovered ? 1.8 : 0.8}
                  />

                  {/* Reservation pattern hatch representation inside */}
                  {bench.reserved && (
                    <path
                      d={`M ${bench.x},${bench.y} L ${bench.x + bench.width},${bench.y + bench.heightPx} M ${bench.x + bench.width},${bench.y} L ${bench.x},${bench.y + bench.heightPx}`}
                      stroke="#eceff1"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  )}

                  {/* Tiny seating dots representation on the bench */}
                  {bench.width > 12 && (
                    <g opacity="0.55" fill="#ffffff">
                      {Array.from({ length: bench.seatCount }).map((_, sIdx) => {
                        const dotX = bench.x + (bench.width / (bench.seatCount + 1)) * (sIdx + 1);
                        const dotY = bench.y + bench.heightPx / 2;
                        return <circle key={sIdx} cx={dotX} cy={dotY} r="1" />;
                      })}
                    </g>
                  )}

                  {/* Optional: Sightline Rays projected on hover */}
                  {isHovered && showSightlines && (
                    <line
                      x1={bench.x + bench.width / 2}
                      y1={bench.y}
                      x2="500"
                      y2="140"
                      stroke="#d84315"
                      strokeWidth="1.2"
                      strokeDasharray="4,3"
                      opacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* GROUND ELEMENTS / COMPASS MAP MARGIN TEXTS */}
          <text x="50" y="730" fill="#8C8375" fontFamily="monospace" fontSize="11" opacity="0.7">
            [WEST FLANK GATE]
          </text>
          <text x="850" y="730" fill="#8C8375" fontFamily="monospace" fontSize="11" opacity="0.7">
            [EAST FLANK GATE]
          </text>
          <text x="500" y="745" fill="#8C8375" fontFamily="monospace" fontSize="11" opacity="0.7" textAnchor="middle">
            ▲ MAIN ENTRANCE SOUTH (50M WIDTH PLAN-VIEW) ▲
          </text>
        </svg>

        {/* Dynamic Map Hover Tooltip overlay */}
        {hoveredBench && (
          <div
            className="absolute bg-[#3D3831]/95 text-[#FAF7F2] rounded-lg p-3 text-xs shadow-xl pointer-events-none z-35 border border-[#D9D1C2]/30 flex flex-col gap-1 min-w-[170px]"
            style={{
              left: `${Math.min(75, Math.max(5, (hoveredBench.x / 1000) * 100))}%`,
              top: `${Math.max(10, (hoveredBench.y / 760) * 100 - 18)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="flex justify-between items-center border-b border-[#FAF7F2]/10 pb-1 mb-1">
              <span className="font-mono font-bold text-[#FFC000]">{hoveredBench.id}</span>
              <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] uppercase ${
                hoveredBench.zone === 'front' ? 'bg-[#A9D18E]/20 text-[#A9D18E]' :
                hoveredBench.zone === 'middle' ? 'bg-[#FFC000]/20 text-[#FFC000]' : 'bg-[#C55A11]/20 text-[#FFE8E1]'
              }`}>
                {hoveredBench.zone}
              </span>
            </div>
            <div className="flex justify-between text-[#E8E2D6]">
              <span>Capacity:</span>
              <span className="font-semibold text-white">{hoveredBench.seatCount} Persons</span>
            </div>
            <div className="flex justify-between text-[#E8E2D6]">
              <span>Elevation:</span>
              <span className="font-mono text-[#A9D18E]">+{hoveredBench.height.toFixed(2)}m</span>
            </div>
            <div className="flex justify-between text-[#E8E2D6]">
              <span>Sightline Score:</span>
              <span className={`font-mono font-bold ${
                hoveredBench.sightline >= 90 ? 'text-[#A9D18E]' :
                hoveredBench.sightline >= 80 ? 'text-[#FFC000]' : 'text-orange-400'
              }`}>{hoveredBench.sightline}%</span>
            </div>
            <div className="flex justify-between mt-1 pt-1 border-t border-[#FAF7F2]/10 text-[#E8E2D6]">
              <span>Status:</span>
              <span className={hoveredBench.reserved ? "text-[#D9D1C2] italic" : "text-[#A9D18E] font-semibold"}>
                {hoveredBench.reserved ? `${hoveredBench.reservedBy}` : "Available"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Seat Info Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#F2EDE4]/60 border border-[#D9D1C2]/70 rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#A9D18E]/25 border border-[#A9D18E] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A9D18E]" />
          </span>
          <div>
            <div className="font-bold text-natural-dark text-xs">Oasis Front</div>
            <div className="text-[10px] text-natural-muted">Green • Rows 1-10</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#FFC000]/20 border border-[#FFC000] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC000]" />
          </span>
          <div>
            <div className="font-bold text-natural-dark text-xs">Amber Heart</div>
            <div className="text-[10px] text-natural-muted">Yellow • Rows 11-20</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#C55A11]/20 border border-[#C55A11] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C55A11]" />
          </span>
          <div>
            <div className="font-bold text-natural-dark text-xs">Terracotta Ridge</div>
            <div className="text-[10px] text-natural-muted">Terracotta • Rows 21-30</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#D9D1C2]/40 border border-[#A19A8E] flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-natural-muted" />
          </span>
          <div>
            <div className="font-bold text-natural-dark text-xs">Reserved Benches</div>
            <div className="text-[10px] text-natural-muted">Hatched • Locked seats</div>
          </div>
        </div>
      </div>
    </div>
  );
}
