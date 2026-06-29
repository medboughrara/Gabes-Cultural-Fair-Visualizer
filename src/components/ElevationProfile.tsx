/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Bench, LayoutParams } from '../types';
import { Ruler, Activity, Eye, Compass } from 'lucide-react';

interface ElevationProfileProps {
  layoutParams: LayoutParams;
  benches: Bench[];
}

export default function ElevationProfile({ layoutParams, benches }: ElevationProfileProps) {
  // Aggregate row statistics for elevation view
  const rowsData = useMemo(() => {
    const data: {
      row: number;
      avgHeight: number;
      avgSightline: number;
      zone: 'front' | 'middle' | 'back';
    }[] = [];

    for (let r = 1; r <= layoutParams.totalRows; r++) {
      const rowBenches = benches.filter((b) => b.row === r);
      if (rowBenches.length > 0) {
        const avgHeight = rowBenches.reduce((acc, b) => acc + b.height, 0) / rowBenches.length;
        const avgSightline = rowBenches.reduce((acc, b) => acc + b.sightline, 0) / rowBenches.length;
        data.push({
          row: r,
          avgHeight,
          avgSightline,
          zone: rowBenches[0].zone,
        });
      }
    }
    return data;
  }, [benches, layoutParams.totalRows]);

  // Max height for drawing scaling
  const maxHeight = useMemo(() => {
    if (rowsData.length === 0) return 1.5;
    return Math.max(...rowsData.map((d) => d.avgHeight)) || 1.5;
  }, [rowsData]);

  return (
    <div className="bg-white border border-natural-border-light rounded-xl p-5 shadow-sm" id="elevation-profile-section">
      <div className="flex items-center justify-between border-b border-natural-border-light pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-natural-accent" />
          <h2 className="font-serif font-bold text-natural-dark text-base">Tiered Sightline Elevation Profile (Side Cross-Section)</h2>
        </div>
        <span className="text-[10px] font-mono bg-natural-aside text-natural-muted px-2.5 py-1 rounded border border-natural-border-light">
          Scale: 1:50 Model
        </span>
      </div>

      <p className="text-natural-muted text-xs mb-4">
        As rows move toward the back, the natural wood benches are elevated (gently rising from <span className="text-[#558139] font-semibold">0.0m (front)</span> to over <span className="text-natural-accent font-semibold">+{maxHeight.toFixed(2)}m (rear)</span>). The dotted terracotta rays show the clear sightlines of spectators in the terracotta rear zone, looking directly at the center stage.
      </p>

      {/* SVG Container */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox="0 0 800 240"
          className="w-full min-w-[650px] h-auto border border-natural-border rounded-lg bg-natural-bg"
        >
          {/* Grid lines */}
          <line x1="50" y1="20" x2="750" y2="20" stroke="#E8E2D6" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="50" y1="70" x2="750" y2="70" stroke="#E8E2D6" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="50" y1="120" x2="750" y2="120" stroke="#E8E2D6" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="50" y1="170" x2="750" y2="170" stroke="#E8E2D6" strokeWidth="0.5" strokeDasharray="5,5" />
          
          {/* Ground sand line */}
          <line x1="50" y1="200" x2="750" y2="200" stroke="#D9D1C2" strokeWidth="4" />
          <path d="M 50,200 L 750,200 L 750,240 L 50,240 Z" fill="#F2EDE4" opacity="0.6" />

          {/* LEFT: THE STAGE (Side view representation) */}
          <g transform="translate(50, 0)">
            {/* Wooden base */}
            <rect x="0" y="160" width="80" height="40" fill="#3D3831" stroke="#2D2924" />
            <text x="40" y="185" fill="#FAF7F2" fontSize="9" fontWeight="bold" textAnchor="middle">
              STAGE
            </text>
            {/* Fabric canopy side view */}
            <line x1="10" y1="160" x2="10" y2="60" stroke="#8C8375" strokeWidth="4" />
            <line x1="70" y1="160" x2="70" y2="60" stroke="#8C8375" strokeWidth="4" />
            <path d="M 5,60 Q 40,40 75,60 L 70,70 Q 40,55 10,70 Z" fill="#FAF7F2" stroke="#D9D1C2" />
            {/* Micro / Speaker symbol */}
            <circle cx="40" cy="145" r="4" fill="#FFC000" />
            <line x1="40" y1="145" x2="40" y2="160" stroke="#3D3831" strokeWidth="2" />
          </g>

          {/* RULERS / HEIGHT LABELS */}
          <g stroke="#A19A8E" strokeWidth="1" opacity="0.7">
            <line x1="50" y1="20" x2="50" y2="200" />
            <line x1="45" y1="20" x2="55" y2="20" />
            <line x1="45" y1="70" x2="55" y2="70" />
            <line x1="45" y1="120" x2="55" y2="120" />
            <line x1="45" y1="170" x2="55" y2="170" />
          </g>
          <text x="35" y="24" fill="#8C8375" fontSize="8" fontFamily="monospace" textAnchor="end">2.0m</text>
          <text x="35" y="74" fill="#8C8375" fontSize="8" fontFamily="monospace" textAnchor="end">1.5m</text>
          <text x="35" y="124" fill="#8C8375" fontSize="8" fontFamily="monospace" textAnchor="end">1.0m</text>
          <text x="35" y="174" fill="#8C8375" fontSize="8" fontFamily="monospace" textAnchor="end">0.5m</text>
          <text x="35" y="204" fill="#8C8375" fontSize="8" fontFamily="monospace" textAnchor="end">0.0m</text>

          {/* SIGHTLINE RAY (Projected from back row to stage center) */}
          {rowsData.length > 0 && (
            <g>
              {/* Sightline ray from rear row to stage center */}
              <line
                x1={150 + (rowsData.length - 1) * (580 / (layoutParams.totalRows || 1))}
                y1={200 - (rowsData[rowsData.length - 1]?.avgHeight || 1) * 75 - 12}
                x2="90"
                y2="145"
                stroke="#C55A11"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <circle cx="90" cy="145" r="4" fill="#C55A11" />
            </g>
          )}

          {/* THE ROW BENCH BLOCKS (Side cross section) */}
          {rowsData.map((data, rIdx) => {
            const stepX = 150 + rIdx * (580 / (layoutParams.totalRows || 1));
            // Height scaled (0 to 2 meters fits within 150px space: 200 - (height * 75))
            const benchH = 8;
            const benchY = 200 - data.avgHeight * 75 - benchH;
            
            let color = '#A9D18E'; // Green
            if (data.zone === 'middle') color = '#FFC000'; // Amber
            if (data.zone === 'back') color = '#C55A11'; // Terracotta

            return (
              <g key={data.row}>
                {/* Ground supporting pillar for elevation */}
                {data.avgHeight > 0.05 && (
                  <rect
                    x={stepX + 2}
                    y={benchY + benchH}
                    width="4"
                    height={200 - benchY - benchH}
                    fill="#D9D1C2"
                    opacity="0.6"
                  />
                )}

                {/* Bench seat */}
                <rect
                  x={stepX}
                  y={benchY}
                  width="8"
                  height={benchH}
                  rx="1"
                  fill={color}
                  stroke="#3D3831"
                  strokeWidth="0.5"
                />

                {/* Tiny spectator head indicator */}
                <circle
                  cx={stepX + 4}
                  cy={benchY - 6}
                  r="3.5"
                  fill="#8C8375"
                  opacity="0.8"
                />

                {/* Row number indicator at bottom */}
                {data.row % 5 === 0 && (
                  <g>
                    <line x1={stepX + 4} y1="200" x2={stepX + 4} y2="210" stroke="#A19A8E" strokeWidth="0.5" />
                    <text x={stepX + 4} y="222" fill="#8C8375" fontSize="7" textAnchor="middle" fontFamily="monospace">
                      R{data.row}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stats explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
        <div className="bg-[#F2EDE4]/60 border border-[#D9D1C2]/60 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[#558139] font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A9D18E]" />
            Oasis Front (Rows 1-10)
          </div>
          <p className="text-natural-muted">
            Ground level sightlines (<span className="font-mono text-natural-dark font-medium">0.0m - 0.3m</span> rise). Maximum closeness to the stage. Sightline rating is an elite <span className="font-mono font-semibold text-[#558139]">95%+</span>.
          </p>
        </div>

        <div className="bg-[#F2EDE4]/60 border border-[#D9D1C2]/60 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[#B38600] font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC000]" />
            Amber Heart (Rows 11-20)
          </div>
          <p className="text-natural-muted">
            Mid-height incline (<span className="font-mono text-natural-dark font-medium">0.35m - 0.85m</span> rise). Optimized to view center stage over the heads of the front rows without obstruction.
          </p>
        </div>

        <div className="bg-[#F2EDE4]/60 border border-[#D9D1C2]/60 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-natural-accent font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C55A11]" />
            Terracotta Ridge (Rows 21-30)
          </div>
          <p className="text-natural-muted">
            High tiered slope (<span className="font-mono text-natural-dark font-medium">0.9m - 1.5m</span> rise). Offers panoramic birds-eye perspective of the cultural fair and desert landscape.
          </p>
        </div>
      </div>
    </div>
  );
}
