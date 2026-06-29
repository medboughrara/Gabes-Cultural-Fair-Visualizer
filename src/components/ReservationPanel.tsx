/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bench, ZoneType } from '../types';
import { UserCheck, CheckCircle2, AlertCircle, X, Trash2, CalendarCheck, MapPin } from 'lucide-react';

interface ReservationPanelProps {
  selectedBench: Bench | null;
  onReserve: (benchId: string, guestName: string, notes: string) => void;
  onRelease: (benchId: string) => void;
  onClose: () => void;
  allBenches: Bench[];
  onLocateBench: (bench: Bench) => void;
}

export default function ReservationPanel({
  selectedBench,
  onReserve,
  onRelease,
  onClose,
  allBenches,
  onLocateBench,
}: ReservationPanelProps) {
  const [guestName, setGuestName] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync inputs with selected bench
  useEffect(() => {
    if (selectedBench) {
      setGuestName(selectedBench.reservedBy || '');
      setNotes(selectedBench.notes || '');
      setErrorMessage('');
    }
  }, [selectedBench]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBench) return;
    
    if (guestName.trim() === '') {
      setErrorMessage('Please enter a valid guest name.');
      return;
    }

    onReserve(selectedBench.id, guestName, notes);
    setErrorMessage('');
  };

  // Get list of currently reserved benches
  const reservedBenches = allBenches.filter((b) => b.reserved);

  return (
    <div className="bg-white border border-natural-border-light rounded-xl p-5 shadow-sm flex flex-col gap-6" id="reservation-panel">
      {/* Active Selection Details */}
      <div>
        <div className="flex items-center justify-between border-b border-natural-border-light pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-natural-accent" />
            <h2 className="font-serif font-bold text-natural-dark text-base">Bench Reservation Desk</h2>
          </div>
          {selectedBench && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-natural-aside cursor-pointer text-natural-muted hover:text-natural-dark">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {selectedBench ? (
          <div className="bg-natural-aside/50 border border-natural-border/60 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono font-bold text-base text-natural-accent">{selectedBench.id}</span>
                <div className="flex items-center gap-1 text-[10px] text-natural-muted font-medium uppercase mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{selectedBench.columnBlock} COLUMN • Row {selectedBench.row}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                selectedBench.zone === 'front' ? 'bg-[#A9D18E]/20 text-[#558139] border border-[#A9D18E]' :
                selectedBench.zone === 'middle' ? 'bg-[#FFC000]/15 text-[#B38600] border border-[#FFC000]' :
                'bg-[#C55A11]/15 text-natural-accent border border-[#C55A11]'
              }`}>
                {selectedBench.zone} Zone
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-natural-border/40 pt-3 text-xs">
              <div className="bg-white/80 p-2 rounded border border-natural-border-light text-center">
                <span className="text-[10px] text-natural-muted block mb-0.5">Capacity</span>
                <span className="font-bold text-natural-dark">{selectedBench.seatCount} Guests</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-natural-border-light text-center">
                <span className="text-[10px] text-natural-muted block mb-0.5">Elevation</span>
                <span className="font-mono font-bold text-[#558139]">+{selectedBench.height.toFixed(2)}m</span>
              </div>
              <div className="bg-white/80 p-2 rounded border border-natural-border-light text-center">
                <span className="text-[10px] text-natural-muted block mb-0.5">Sightline</span>
                <span className="font-mono font-bold text-[#B38600]">{selectedBench.sightline}%</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
              <div>
                <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Spectator / Guest Name</label>
                <input
                  type="text"
                  placeholder="Enter full name..."
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-natural-border text-xs focus:outline-none focus:ring-2 focus:ring-natural-accent bg-white text-natural-dark placeholder-natural-placeholder"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-natural-muted uppercase block mb-1">Reservation Notes</label>
                <textarea
                  placeholder="e.g. VIP delegation, delegation notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-natural-border text-xs focus:outline-none focus:ring-2 focus:ring-natural-accent bg-white text-natural-dark placeholder-natural-placeholder resize-none"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="submit"
                  className="flex-1 bg-natural-accent hover:bg-natural-dark text-white font-sans font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{selectedBench.reserved ? 'Update Seat' : 'Reserve Bench'}</span>
                </button>
                
                {selectedBench.reserved && (
                  <button
                    type="button"
                    onClick={() => onRelease(selectedBench.id)}
                    className="bg-natural-border hover:bg-red-100 text-natural-muted hover:text-red-700 font-medium text-xs p-2 rounded-lg transition-colors cursor-pointer"
                    title="Release Seat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="border border-dashed border-natural-border rounded-lg p-6 text-center text-xs text-natural-muted bg-natural-bg/10">
            Click on any wood bench in the floorplan layout map above to inspect elevation metrics, test sightline vectors, and reserve seats!
          </div>
        )}
      </div>

      {/* Reserved Directory */}
      <div className="flex flex-col gap-3 border-t border-natural-border-light pt-5">
        <h3 className="font-serif font-bold text-natural-dark text-xs uppercase tracking-wider flex items-center justify-between">
          <span>Reserved Guest List</span>
          <span className="font-mono text-[10px] bg-natural-aside px-2 py-0.5 rounded text-natural-muted border border-natural-border-light">
            {reservedBenches.length} Registered
          </span>
        </h3>

        {reservedBenches.length > 0 ? (
          <div className="max-h-[180px] overflow-y-auto border border-natural-border rounded-lg divide-y divide-natural-border-light text-xs bg-natural-aside/40">
            {reservedBenches.map((bench) => (
              <div
                key={bench.id}
                onClick={() => onLocateBench(bench)}
                className="p-2.5 flex items-center justify-between hover:bg-natural-aside/60 cursor-pointer transition-colors"
                title="Click to zoom/center on layout"
              >
                <div>
                  <div className="font-bold text-natural-dark flex items-center gap-1.5">
                    <span className="font-mono text-natural-accent font-semibold">{bench.id}</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{bench.reservedBy}</span>
                  </div>
                  {bench.notes && (
                    <div className="text-[10px] text-natural-muted truncate max-w-[180px] mt-0.5">{bench.notes}</div>
                  )}
                </div>
                
                <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] uppercase ${
                  bench.zone === 'front' ? 'bg-[#A9D18E]/25 text-[#558139] border border-[#A9D18E]/50' :
                  bench.zone === 'middle' ? 'bg-[#FFC000]/15 text-[#B38600] border border-[#FFC000]/50' :
                  'bg-[#C55A11]/15 text-natural-accent border border-[#C55A11]/50'
                }`}>
                  {bench.zone}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-natural-muted italic text-center py-2">
            No benches currently booked. Registered guests will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
