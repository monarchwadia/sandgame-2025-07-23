// src/types.ts
// Shared types for the sandgame project

// Sand game state using 1D typed array
import { GRID_WIDTH, GRID_HEIGHT } from './constants';

export const grid = new Uint8Array(GRID_WIDTH * GRID_HEIGHT); // 0 = empty, 1 = sand, etc.
grid.fill(0); // Initialize grid to empty

export const gameState = {
  grid,
  width: GRID_WIDTH,
  height: GRID_HEIGHT,
};
export type GameState = typeof gameState;
