// src/updateGameState.ts
// No-op update function for sand game state

import { rainProcessor } from './environment/rain';
import { timeOfDayProcessor } from './environment/timeOfDay';
import type { GameState } from './GameState';
import { particlesRegistry } from './particles/particlesRegistry';



export function updateGameState(gameState: GameState): void {
  const { grid, width, height } = gameState;
  // Copy grid to avoid moving sand multiple times per frame
  const newGrid = new Uint8Array(grid);
  // Iterate from bottom up so sand falls correctly
  for (let y = height - 2; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      particlesRegistry[newGrid[y * width + x]]?.behavior?.(newGrid, width, height, x, y);
    }
  }
  // Copy newGrid back to grid
  grid.set(newGrid);

  // Update time of day
  timeOfDayProcessor(gameState);
  // rain
  rainProcessor(gameState);
}
