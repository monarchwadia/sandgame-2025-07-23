// src/updateGameState.ts
// No-op update function for sand game state

import { rainProcessor } from './environment/rain';
import { timeOfDayProcessor } from './environment/timeOfDay';
import type { GameState } from './GameState';
import { particlesRegistry } from './particles/particlesRegistry';

// This determines the horizontal scan direction for particle processing. This is important
// because without it, particles get biased in which direction they want to fall. 
// For example, imagine a row of water particles. If we always process left-to-right,
// then the leftmost particle will want to move left. Then, the next particle will also want to move left.
// And so, the entire row will eventually move left, creating a bias.
// To avoid this, we toggle the scan direction each frame.
let scanLeftToRight = true; 

export function updateGameState(gameState: GameState): void {
  const { grid, width, height } = gameState;
  scanLeftToRight = !scanLeftToRight; // Toggle horizontal scan direction each frame

  // Copy grid to avoid moving sand multiple times per frame
  const newGrid = new Uint32Array(grid);
  
  if (scanLeftToRight) {
      for (let y = height - 2; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
          particlesRegistry[newGrid[y * width + x]]?.behavior?.(newGrid, width, height, x, y, gameState);
        }
      }
  } else {
      for (let y = height - 2; y >= 0; y--) {
        for (let x = width - 1; x >= 0; x--) {
          particlesRegistry[newGrid[y * width + x]]?.behavior?.(newGrid, width, height, x, y, gameState);
        }
    }
  }

  // Copy newGrid back to grid
  grid.set(newGrid);

  // Update time & environment
  timeOfDayProcessor(gameState);
  rainProcessor(gameState);
}
