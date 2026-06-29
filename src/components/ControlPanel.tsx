/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutParams } from '../types';
import { Sliders, Sun, Moon, Sparkles, Trees, ShieldAlert, Palette, HelpCircle } from 'lucide-react';

interface ControlPanelProps {
  layoutParams: LayoutParams;
  onChangeParams: (params: LayoutParams) => void;
  onResetLayout: () => void;
}

export default function ControlPanel({
  layoutParams,
  onChangeParams,
  onResetLayout,
}: ControlPanelProps) {

  const handleUpdate = (updates: Partial<LayoutParams>) => {
    onChangeParams({
      ...layoutParams,
      ...updates,
    });
  };

  const handleBenchesPerColumnUpdate = (column: 'left' | 'center' | 'right', val: number) => {
    onChangeParams({
      ...layoutParams,
      benchesPerColumn: {
        ...layoutParams.benchesPerColumn,
        [column]: val,
      },
    });
  };

  return (
    <div className="bg-white border border-natural-border-light rounded-xl p-5 shadow-sm flex flex-col gap-6" id="architectural-control-panel">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-natural-border-light pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-natural-accent" />
          <h2 className="font-serif font-bold text-natural-dark text-base">Architectural Parameters</h2>
        </div>
        <button
          onClick={onResetLayout}
          className="text-xs font-mono text-natural-accent hover:text-natural-dark hover:underline cursor-pointer"
        >
          Reset Default
        </button>
      </div>

      {/* Row Configuration */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif font-bold text-natural-dark text-xs uppercase tracking-wider">Physical Dimensions & Rows</h3>
        
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-natural-muted font-medium">Total Seating Rows</span>
            <span className="font-mono font-bold text-natural-dark">{layoutParams.totalRows} Rows</span>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            step="1"
            value={layoutParams.totalRows}
            onChange={(e) => handleUpdate({ totalRows: parseInt(e.target.value) })}
            className="w-full accent-natural-accent cursor-pointer h-1.5 bg-natural-aside rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-natural-placeholder mt-1">
            <span>10 Rows (Compact)</span>
            <span>30 Rows (Default)</span>
            <span>45 Rows (Dense)</span>
          </div>
        </div>

        {/* Bench Columns Count */}
        <div className="grid grid-cols-3 gap-3 mt-1.5">
          <div>
            <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Left Column</label>
            <input
              type="number"
              min="1"
              max="6"
              value={layoutParams.benchesPerColumn.left}
              onChange={(e) => handleBenchesPerColumnUpdate('left', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-natural-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-natural-accent bg-natural-bg/50 text-natural-dark"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Center Column</label>
            <input
              type="number"
              min="1"
              max="10"
              value={layoutParams.benchesPerColumn.center}
              onChange={(e) => handleBenchesPerColumnUpdate('center', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-natural-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-natural-accent bg-natural-bg/50 text-natural-dark"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Right Column</label>
            <input
              type="number"
              min="1"
              max="6"
              value={layoutParams.benchesPerColumn.right}
              onChange={(e) => handleBenchesPerColumnUpdate('right', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-natural-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-natural-accent bg-natural-bg/50 text-natural-dark"
            />
          </div>
        </div>
      </div>

      {/* Stage Styling */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif font-bold text-natural-dark text-xs uppercase tracking-wider">Stage & Canopy Style</h3>
        
        <div>
          <label className="text-[10px] text-natural-muted font-medium block mb-1">Fabric Canopy Roof Style</label>
          <div className="grid grid-cols-3 gap-2">
            {(['solid', 'striped', 'wave'] as const).map((style) => (
              <button
                key={style}
                onClick={() => handleUpdate({ canopyStyle: style })}
                className={`py-1.5 rounded-lg text-xs capitalize font-medium border cursor-pointer transition-all ${
                  layoutParams.canopyStyle === style
                    ? 'bg-natural-aside border-natural-accent text-natural-accent shadow-xs font-bold'
                    : 'bg-natural-bg/30 border-natural-border text-natural-muted hover:bg-natural-aside'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-natural-muted font-medium">Stage Canopy Width</span>
            <span className="font-mono font-bold text-natural-dark">{layoutParams.stageWidth}m</span>
          </div>
          <input
            type="range"
            min="12"
            max="30"
            step="1"
            value={layoutParams.stageWidth}
            onChange={(e) => handleUpdate({ stageWidth: parseInt(e.target.value) })}
            className="w-full accent-natural-accent cursor-pointer h-1.5 bg-natural-aside rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* Atmospheric Controls */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif font-bold text-natural-dark text-xs uppercase tracking-wider">Tunisian Desert Dusk Atmosphere</h3>
        
        {/* Sky Background Toggles */}
        <div>
          <label className="text-[10px] text-natural-muted font-medium block mb-1.5">Ambient Environment Lighting</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'golden', label: 'Golden Hour', icon: Sun },
              { id: 'dusk', label: 'Dusk Pink', icon: Moon },
              { id: 'night', label: 'Sahara Night', icon: Moon },
            ].map((sky) => {
              const Icon = sky.icon;
              return (
                <button
                  key={sky.id}
                  onClick={() => handleUpdate({ ambientSky: sky.id as any })}
                  className={`py-2 rounded-lg text-xs font-medium border cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${
                    layoutParams.ambientSky === sky.id
                      ? 'bg-natural-aside border-natural-accent text-natural-accent shadow-xs font-bold'
                      : 'bg-natural-bg/30 border-natural-border text-natural-muted hover:bg-natural-aside'
                  }`}
                >
                  <Icon className="w-4 h-4 text-natural-accent" />
                  <span>{sky.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overhead String lights toggles */}
        <div className="flex items-center justify-between bg-natural-bg/30 rounded-lg p-2.5 border border-natural-border-light">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFC000]" />
            <div>
              <span className="text-xs font-bold text-natural-dark block">Festive String Lights</span>
              <span className="text-[10px] text-natural-muted">Garlands overhead the arena</span>
            </div>
          </div>
          <button
            onClick={() => handleUpdate({ lightsEnabled: !layoutParams.lightsEnabled })}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              layoutParams.lightsEnabled ? 'bg-natural-accent' : 'bg-natural-border'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-xs ${
                layoutParams.lightsEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Tree density selector */}
        <div>
          <label className="text-[10px] text-natural-muted font-medium block mb-1">Palm & Olive Trees perimeter</label>
          <div className="grid grid-cols-3 gap-2">
            {(['sparse', 'medium', 'dense'] as const).map((density) => (
              <button
                key={density}
                onClick={() => handleUpdate({ foliageDensity: density })}
                className={`py-1.5 rounded-lg text-xs capitalize font-medium border cursor-pointer transition-all ${
                  layoutParams.foliageDensity === density
                    ? 'bg-natural-aside border-natural-accent text-natural-accent shadow-xs font-bold'
                    : 'bg-natural-bg/30 border-natural-border text-natural-muted hover:bg-natural-aside'
                }`}
              >
                {density}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Notice Card */}
      <div className="bg-[#F2EDE4]/60 border border-[#D9D1C2]/60 rounded-lg p-3 text-[11px] text-natural-text flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-natural-accent shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-natural-dark block mb-0.5">Architectural Safety Constraints</span>
          Each zone has been safety-rated for tiered sightline inclines. Total capacities above 600 seats might require additional lateral exit corridors to support the sandy Gabes soil conditions.
        </div>
      </div>
    </div>
  );
}
