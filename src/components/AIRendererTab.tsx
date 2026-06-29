/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GeneratedImage, AISession } from '../types';
import { Sparkles, Image as ImageIcon, Download, Check, AlertCircle, RefreshCw, Send, ZoomIn, Sliders, Brush } from 'lucide-react';

interface AIRendererTabProps {
  gallery: GeneratedImage[];
  onGenerateImage: (prompt: string, aspectRatio: string, style: string) => Promise<void>;
  onEditImage: (prompt: string, base64Image: string) => Promise<void>;
  session: AISession;
  onSetBackdrop: (imageUrl: string) => void;
  activeBackdrop: string | null;
}

const PRESETS = [
  {
    title: 'Default Visualizer (Aerial)',
    prompt: 'Aerial perspective architectural visualization of an outdoor cultural fair in Gabes, Tunisia. A 50-meter-wide open-air venue at golden hour. At the top, a 20-meter rectangular stage with a fabric canopy roof and warm amber stage lighting. Below the stage, natural wood benches organized in three color-coded zones: pale green at the front, warm amber in the middle, terracotta at the back on sand. Palm trees on sides, warm pink/purple sky. Isometric tilted blueprint style.',
    style: 'Architectural Visualization',
    ratio: '16:9',
  },
  {
    title: 'Stage Close-Up (Malouf Performance)',
    prompt: 'Close-up photorealistic rendering of the Gabes Fair stage. Tunisian Malouf musicians playing traditional Oud and violin on stage, illuminated by warm amber spotlights. Large fabric canopy roof, traditional flags with geometric patterns waving. Sand ground, majestic palm trees framing the sides under a purple desert sunset.',
    style: 'Photorealistic',
    ratio: '16:9',
  },
  {
    title: 'Spectator View (Rear Zone)',
    prompt: 'Perspective from the rear terracotta wooden seating rows, looking down the sand aisles towards the main stage at a lively Tunisian cultural fair. String lights overhead casting a cozy glow. Palm trees swaying, sand dunes in the distant horizon under Sahara night sky with stars.',
    style: '3D Render',
    ratio: '16:9',
  },
];

export default function AIRendererTab({
  gallery,
  onGenerateImage,
  onEditImage,
  session,
  onSetBackdrop,
  activeBackdrop,
}: AIRendererTabProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [selectedStyle, setSelectedStyle] = useState('Architectural Visualization');
  const [activeImage, setActiveImage] = useState<GeneratedImage | null>(null);
  
  // Edit mode state
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);

  // Dynamic loading log steps
  const [loadingLog, setLoadingLog] = useState('');

  // Auto-select the first image (blueprint or generated) in the canvas
  React.useEffect(() => {
    if (!activeImage && gallery.length > 0) {
      setActiveImage(gallery[0]);
    }
  }, [gallery, activeImage]);

  React.useEffect(() => {
    if (session.status === 'generating') {
      const logs = [
        'Connecting to Gemini API...',
        'Checking secure environment credentials...',
        'Parsing Gabes Fair prompt parameters...',
        'Synthesizing Sahara golden hour atmosphere...',
        'Rendering 50-meter-wide sandy arena model...',
        'Positioning 500 wood benches & tiered heights...',
        'Draping fabric canopy over the 20m stage...',
        'Stringing overhead festive garlands and light bulbs...',
        'Applying Sidi Bou Said color palette highlights...',
        'Synthesizing photorealistic final rendering...',
      ];
      let logIdx = 0;
      setLoadingLog(logs[0]);

      const interval = setInterval(() => {
        logIdx = (logIdx + 1) % logs.length;
        setLoadingLog(logs[logIdx]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [session.status]);

  const handleApplyPreset = (p: typeof PRESETS[0]) => {
    setCustomPrompt(p.prompt);
    setSelectedStyle(p.style);
    setAspectRatio(p.ratio);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim() === '') return;
    onGenerateImage(customPrompt, aspectRatio, selectedStyle);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeImage || editPrompt.trim() === '') return;
    setIsEditingMode(true);
    await onEditImage(editPrompt, activeImage.imageUrl);
    setEditPrompt('');
    setIsEditingMode(false);
  };

  return (
    <div className="bg-white border border-natural-border-light rounded-xl p-5 shadow-sm flex flex-col gap-6" id="ai-generative-section">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-natural-border-light pb-3">
        <Sparkles className="w-5 h-5 text-natural-accent" />
        <h2 className="font-serif font-bold text-natural-dark text-base">Gemini Architectural Visualizer</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form & Presets */}
        <div className="flex flex-col gap-4">
          <p className="text-natural-muted text-xs leading-relaxed">
            Generate customized 3D perspectives of the fair. Describe scene lighting, specific traditional Tunisian elements, or crowd configurations. Our Gemini service will translate your prompt directly.
          </p>

          {/* Presets List */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block"> Tunisia Thematic Presets </span>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-lg border border-natural-border-light bg-natural-bg/20 hover:bg-natural-aside hover:border-natural-accent text-left text-xs transition-all cursor-pointer flex flex-col gap-1"
                >
                  <span className="font-bold text-natural-dark">{p.title}</span>
                  <span className="text-natural-muted line-clamp-1">{p.prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="flex flex-col gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Custom Workspace Prompt</label>
              <textarea
                placeholder="Describe your scene in detail... e.g. An atmospheric dusk view of the Tunisian fair with golden lanterns floating near palm trees on the sand."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-natural-border text-xs focus:outline-none focus:ring-2 focus:ring-natural-accent bg-natural-bg/10 text-natural-dark placeholder-natural-placeholder"
              />
            </div>

            {/* Layout parameters */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-natural-border text-xs bg-white text-natural-dark focus:outline-none focus:ring-2 focus:ring-natural-accent"
                >
                  <option value="16:9">16:9 Wide Screen</option>
                  <option value="4:3">4:3 Card Photo</option>
                  <option value="1:1">1:1 Profile Avatar</option>
                  <option value="9:16">9:16 Portrait Canvas</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Render Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-natural-border text-xs bg-white text-natural-dark focus:outline-none focus:ring-2 focus:ring-natural-accent"
                >
                  <option value="Architectural Visualization">Architectural Render</option>
                  <option value="Photorealistic">Photorealistic</option>
                  <option value="3D Render">Cinematic 3D Render</option>
                  <option value="Watercolor Blueprint">Watercolor Sketch</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={session.status === 'generating'}
              className="bg-natural-dark hover:bg-black disabled:bg-natural-border text-white font-sans font-bold text-xs py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-1 shadow-md"
            >
              {session.status === 'generating' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Scene...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-[#FFC000]" />
                  <span>Generate AI Visualization</span>
                </>
              )}
            </button>
          </form>

          {/* Loading Logs block */}
          {session.status === 'generating' && (
            <div className="bg-natural-dark text-white rounded-lg p-3 font-mono text-[10px] flex flex-col gap-1 border border-natural-border animate-pulse">
              <div className="text-[#FFC000] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFC000] animate-ping" />
                <span>Generating logs:</span>
              </div>
              <div className="text-natural-border-light truncate">{loadingLog}</div>
            </div>
          )}

          {/* Feedback message banner */}
          {session.message && session.status !== 'generating' && (
            <div className={`p-3 rounded-lg text-xs flex gap-2.5 ${
              session.status === 'error'
                ? 'bg-natural-accent/10 border border-natural-accent/30 text-natural-dark'
                : 'bg-[#A9D18E]/10 border border-[#A9D18E]/30 text-natural-dark'
            }`}>
              <AlertCircle className={`w-5 h-5 shrink-0 ${session.status === 'error' ? 'text-natural-accent' : 'text-[#558139]'}`} />
              <div>
                <span className="font-bold block mb-0.5">
                  {session.status === 'error' ? 'Quota Notice & Blueprint Fallback' : 'Success!'}
                </span>
                {session.message}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Expanded View & Image Editor */}
        <div className="flex flex-col gap-4 border-l border-natural-border-light pl-0 lg:pl-6">
          <span className="text-[10px] font-bold text-natural-muted uppercase tracking-wider block">Workspace Canvas</span>
          
          {activeImage ? (
            <div className="flex flex-col gap-3">
              {/* Canvas Preview Frame */}
              <div className="relative group overflow-hidden rounded-xl border border-natural-border bg-natural-bg/40 shadow-sm aspect-video flex items-center justify-center">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.prompt}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="bg-natural-dark/95 text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded backdrop-blur-xs border border-natural-border/30">
                    {activeImage.style}
                  </span>
                  {activeImage.isCustom ? (
                    <span className="bg-natural-accent text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-[#FFC000]" /> Custom
                    </span>
                  ) : (
                    <span className="bg-[#A9D18E] text-natural-dark text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      Blueprint Sim
                    </span>
                  )}
                </div>

                {/* Back Drop Actions */}
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => onSetBackdrop(activeImage.imageUrl)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-sm backdrop-blur-xs ${
                      activeBackdrop === activeImage.imageUrl
                        ? 'bg-[#A9D18E] text-natural-dark'
                        : 'bg-natural-dark/90 hover:bg-black text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{activeBackdrop === activeImage.imageUrl ? 'Active Backdrop' : 'Set as Backdrop'}</span>
                  </button>
                  <a
                    href={activeImage.imageUrl}
                    download={`gabes_render_${activeImage.id}.png`}
                    className="p-1 rounded bg-natural-dark/90 hover:bg-black text-white cursor-pointer shadow-sm backdrop-blur-xs"
                    title="Download rendering"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Prompt Detail */}
              <div className="text-xs bg-natural-aside border border-natural-border-light p-2.5 rounded-lg text-natural-dark">
                <span className="font-bold text-natural-dark block mb-0.5">Active Prompt:</span>
                <span className="text-natural-muted italic">"{activeImage.prompt}"</span>
              </div>

              {/* AI Image Editor Panel */}
              <div className="border border-natural-border rounded-lg p-3 flex flex-col gap-3 bg-natural-bg/30 text-natural-dark">
                <div className="flex items-center gap-1 text-xs font-bold text-natural-dark">
                  <Brush className="w-4 h-4 text-natural-accent" />
                  <span>Apply AI edits to this visual</span>
                </div>
                
                <form onSubmit={handleEditSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Add traditional desert tents... / make it Sahara night"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    disabled={isEditingMode}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-natural-border text-xs bg-white text-natural-dark focus:outline-none focus:ring-2 focus:ring-natural-accent placeholder-natural-placeholder"
                  />
                  <button
                    type="submit"
                    disabled={isEditingMode || editPrompt.trim() === ''}
                    className="bg-natural-dark hover:bg-black disabled:bg-natural-border text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isEditingMode ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3 h-3 text-[#FFC000]" />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                </form>
                <span className="text-[10px] text-natural-muted">
                  Type instruction edits (e.g. "Add a crowd of spectators in benches", "Make it Sahara night sky with starry galaxies") to re-generate modified visuals.
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-natural-border rounded-xl p-10 text-center text-xs text-natural-muted flex flex-col items-center justify-center gap-2 aspect-video">
              <ImageIcon className="w-8 h-8 text-natural-placeholder animate-pulse" />
              <span>No image currently active. Generate a visual or click on any gallery image in the grid below.</span>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Carousel List */}
      <div className="flex flex-col gap-3 border-t border-natural-border-light pt-5">
        <h3 className="font-serif font-bold text-natural-dark text-xs uppercase tracking-wider block">Render Gallery Directory</h3>
        
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setActiveImage(img);
                  window.scrollTo({ top: document.getElementById('ai-generative-section')?.offsetTop, behavior: 'smooth' });
                }}
                className={`relative group overflow-hidden rounded-lg border aspect-video cursor-pointer transition-all ${
                  activeImage?.id === img.id
                    ? 'border-natural-accent ring-2 ring-natural-accent/20 shadow-md scale-102'
                    : 'border-natural-border-light hover:border-natural-muted'
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-1.5 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] text-stone-200 font-mono font-medium truncate max-w-[120px]">
                    {img.prompt}
                  </span>
                  <ZoomIn className="w-3 h-3 text-white shrink-0 mb-0.5" />
                </div>

                {/* Custom watermark badge */}
                {img.isCustom && (
                  <span className="absolute top-1 left-1 bg-natural-accent text-white text-[8px] font-bold px-1 rounded shadow-sm">
                    AI
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-natural-muted italic">No renderings saved. Click generate to start compiling your visual gallery.</p>
        )}
      </div>
    </div>
  );
}
