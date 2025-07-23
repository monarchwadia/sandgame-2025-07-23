// src/constants.ts
// Shared constants for the sandgame project

export const GRID_WIDTH = 60;
export const GRID_HEIGHT = 60;

export const COLORS: { [key: number]: [number, number, number, number] } = {
  0: [44, 20, 60, 255],    // night purple RGBA
  1: [255, 220, 80, 255],  // warm yellow RGBA
};

export const CELL_WIDTH = window.innerWidth / GRID_WIDTH;
export const CELL_HEIGHT = window.innerHeight / GRID_HEIGHT;
