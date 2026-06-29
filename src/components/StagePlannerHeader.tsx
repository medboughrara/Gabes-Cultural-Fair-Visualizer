/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles, MapPin, Calendar, Clock, Info } from 'lucide-react';

interface StagePlannerHeaderProps {
  totalSeats: number;
  reservedSeats: number;
  avgSightline: number;
}

export default function StagePlannerHeader({
  totalSeats,
  reservedSeats,
  avgSightline,
}: StagePlannerHeaderProps) {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-natural-border bg-natural-aside/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4" id="app-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title Brand Block */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-natural-accent text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-xs">
              Gabes, Tunisia
            </span>
            <div className="flex items-center gap-1 text-natural-muted text-xs">
              <MapPin className="w-3 h-3 text-natural-accent" />
              <span>Chott El-Jerid Perimeter Venue</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-natural-dark tracking-tight flex items-center gap-2">
            <Compass className="w-8 h-8 text-natural-accent animate-spin-slow" />
            Gabes Cultural Fair Visualizer
            <span className="text-xs font-mono font-medium text-natural-muted bg-natural-bg border border-natural-border-light px-2 py-0.5 rounded">v1.2</span>
          </h1>
          <p className="text-natural-muted text-sm mt-1 max-w-xl font-sans italic">
            Architectural seating planner and generative design workspace. Tailored for a 50m open-air venue featuring tiered sightlines, palm perimeter, and Tunisian banner flag customizers.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/50 border border-natural-border-light shadow-xs rounded-lg p-2.5 flex items-center gap-3 min-w-[120px]">
            <div className="w-2 h-2 rounded-full bg-zone-front animate-pulse" />
            <div>
              <div className="text-[10px] font-mono text-natural-muted uppercase tracking-wider">Total Seats</div>
              <div className="text-lg font-bold text-natural-dark font-mono">{totalSeats}</div>
            </div>
          </div>

          <div className="bg-white/50 border border-natural-border-light shadow-xs rounded-lg p-2.5 flex items-center gap-3 min-w-[120px]">
            <div className="w-2 h-2 rounded-full bg-zone-middle" />
            <div>
              <div className="text-[10px] font-mono text-natural-muted uppercase tracking-wider">Reserved</div>
              <div className="text-lg font-bold text-natural-dark font-mono">
                {reservedSeats} <span className="text-xs text-natural-muted font-normal">({Math.round((reservedSeats / (totalSeats || 1)) * 100)}%)</span>
              </div>
            </div>
          </div>

          <div className="bg-white/50 border border-natural-border-light shadow-xs rounded-lg p-2.5 flex items-center gap-3 min-w-[120px]">
            <div className="w-2 h-2 rounded-full bg-zone-back" />
            <div>
              <div className="text-[10px] font-mono text-natural-muted uppercase tracking-wider">Avg Sightline</div>
              <div className="text-lg font-bold text-natural-dark font-mono">{avgSightline}%</div>
            </div>
          </div>

          <div className="bg-natural-dark text-white rounded-lg px-3 py-2 flex items-center gap-2.5 shadow-md">
            <Clock className="w-4 h-4 text-zone-middle" />
            <div className="text-right">
              <div className="text-[9px] font-mono text-[#D9D1C2] uppercase">Gabes Local Time</div>
              <div className="text-sm font-bold font-mono tracking-wider">{time}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
