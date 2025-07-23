// src/updateGrid.ts
// No-op update function for sand game grid

import type { GameState } from './GameState';

export function updateGrid(state: GameState): void {
  // Randomly fill the grid with sand (1's)
  const { grid, width, height } = state;
  for (let i = 0; i < width * height; i++) {
    grid[i] = Math.random() < 0.2 ? 1 : 0; // 20% chance for sand
  }
}
