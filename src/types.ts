/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ZoneType = 'front' | 'middle' | 'back';

export interface Bench {
  id: string; // Unique seat ID, e.g. "R1-C1-B2"
  row: number; // Row index (1 to TotalRows)
  columnBlock: 'left' | 'center' | 'right';
  benchIndex: number; // Index of the bench within its column block
  seatCount: number; // Capacity of this single bench (typically 2-4 seats)
  zone: ZoneType;
  height: number; // Height elevation of the bench in meters (gently rising toward rear)
  sightline: number; // Sightline percentage to the center-front of the stage
  x: number; // Simulated SVG layout x coordinate
  y: number; // Simulated SVG layout y coordinate
  width: number; // Width of the bench element
  heightPx: number; // Height depth of the bench element
  reserved: boolean;
  reservedBy?: string;
  notes?: string;
}

export interface LayoutParams {
  totalRows: number;
  benchesPerColumn: {
    left: number;
    center: number;
    right: number;
  };
  stageWidth: number; // meters
  stageHeight: number; // meters
  venueWidth: number; // meters
  venueDepth: number; // meters
  rowSpacing: number; // spacing between rows
  aisleWidth: number; // horizontal spacing between columns
  canopyStyle: 'solid' | 'striped' | 'wave';
  ambientSky: 'golden' | 'dusk' | 'night';
  lightsEnabled: boolean;
  foliageDensity: 'sparse' | 'medium' | 'dense';
  bannerPattern: 'triangle' | 'rhombus' | 'star';
  patternColor: string;
}

export interface SeatingStats {
  totalBenches: number;
  totalSeats: number;
  reservedSeats: number;
  reservedBenches: number;
  capacityByZone: {
    front: number;
    middle: number;
    back: number;
  };
  avgSightline: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: string;
  style: string;
  isCustom: boolean;
}

export interface AISession {
  status: 'idle' | 'generating' | 'error' | 'success';
  message: string;
}
