/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutParams } from '../types';
import { Palette, Layers, Sparkles, Sliders } from 'lucide-react';

interface TunisianBannerCreatorProps {
  layoutParams: LayoutParams;
  onChangeParams: (params: LayoutParams) => void;
}

export default function TunisianBannerCreator({
  layoutParams,
  onChangeParams,
}: TunisianBannerCreatorProps) {

  const handleUpdate = (updates: Partial<LayoutParams>) => {
    onChangeParams({
      ...layoutParams,
      ...updates,
    });
  };

  const presetPalettes = [
    { name: 'Carthage Crimson', value: '#c0392b' },
    { name: 'Sahara Amber', value: '#e67e22' },
    { name: 'Sidi Bou Said Blue', value: '#2980b9' },
    { name: 'Tunisian Olive Green', value: '#16a085' },
    { name: 'Medina Gold', value: '#f1c40f' },
  ];

  return (
    <div className="bg-white border border-natural-border-light rounded-xl p-5 shadow-sm flex flex-col gap-5" id="tunisian-banner-creator">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-natural-border-light pb-3">
        <Palette className="w-5 h-5 text-natural-accent" />
        <h2 className="font-serif font-bold text-natural-dark text-base">Tunisian Banner & Pattern customizer</h2>
      </div>

      <p className="text-natural-muted text-xs">
        Design custom geometric banners that line the boundary walls of the Gabes outdoor venue. These patterns are inspired by authentic Tunisian Berber motifs and Medina geometric weaves.
      </p>

      {/* Flag Shape */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block">Motif Geometric Shape</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'triangle', label: 'Triangles', desc: 'Chevron drape' },
            { id: 'rhombus', label: 'Rhombus', desc: 'Medina weave' },
            { id: 'star', label: 'Stars', desc: '8-point mosaic' },
          ].map((pat) => (
            <button
              key={pat.id}
              onClick={() => handleUpdate({ bannerPattern: pat.id as any })}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                layoutParams.bannerPattern === pat.id
                  ? 'bg-natural-aside border-natural-accent shadow-xs'
                  : 'bg-natural-bg/30 border-natural-border hover:bg-natural-aside'
              }`}
            >
              <span className={`text-xs font-bold ${layoutParams.bannerPattern === pat.id ? 'text-natural-accent' : 'text-natural-dark'}`}>
                {pat.label}
              </span>
              <span className="text-[9px] text-natural-muted font-normal">{pat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preset Motif Color palettes */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block">Pattern Outline Color</label>
        <div className="flex flex-wrap gap-2">
          {presetPalettes.map((p) => (
            <button
              key={p.value}
              onClick={() => handleUpdate({ patternColor: p.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer flex items-center gap-2 transition-all ${
                layoutParams.patternColor === p.value
                  ? 'bg-natural-dark text-white border-natural-dark shadow-sm'
                  : 'bg-natural-bg/30 border-natural-border text-natural-muted hover:bg-natural-aside'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full border border-natural-border" style={{ backgroundColor: p.value }} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Live Canvas Preview */}
      <div className="border border-natural-border rounded-lg p-3 bg-natural-bg/40 flex flex-col items-center justify-center">
        <span className="text-[9px] font-bold text-natural-placeholder uppercase tracking-wider mb-2 self-start">Live Motif Preview</span>
        
        <svg viewBox="0 0 300 60" className="w-full max-w-[280px] h-12 bg-white rounded border border-natural-border-light">
          <defs>
            <pattern id="creator-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              {layoutParams.bannerPattern === 'triangle' && (
                <polygon points="0,0 20,40 40,0" fill="none" stroke={layoutParams.patternColor} strokeWidth="1.5" />
              )}
              {layoutParams.bannerPattern === 'rhombus' && (
                <polygon points="20,5 35,20 20,35 5,20" fill="none" stroke={layoutParams.patternColor} strokeWidth="1.5" />
              )}
              {layoutParams.bannerPattern === 'star' && (
                <g stroke={layoutParams.patternColor} strokeWidth="1" fill="none">
                  <rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)" />
                  <rect x="10" y="10" width="20" height="20" />
                  <circle cx="20" cy="20" r="4" fill={layoutParams.patternColor} />
                </g>
              )}
            </pattern>
          </defs>
          <rect width="300" height="60" fill="url(#creator-pattern)" />
        </svg>

        <span className="text-[10px] text-natural-muted mt-2 italic text-center">
          The outlines customize the isometric banner loops decorating the venue perimeter.
        </span>
      </div>
    </div>
  );
}
