// src/types.ts
// Shared types for the sandgame project

// Sand game state using 1D typed array
import { GRID_WIDTH, GRID_HEIGHT } from './constants';
import { SKY_IDX } from './particles/sky.particle';

export const grid = new Uint8Array(GRID_WIDTH * GRID_HEIGHT); // 0 = empty, 1 = sand, etc.
grid.fill(SKY_IDX); // Initialize grid to empty

export const gameState = {
  grid,
  timeOfDay: 0, // 0-23 for hours of the day
  timeProgressPct: 0, // 0.0-1.0 progress within current hour for smooth transitions
  width: GRID_WIDTH,
  height: GRID_HEIGHT,
};
export type GameState = typeof gameState;
