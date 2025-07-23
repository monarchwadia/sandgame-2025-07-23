// src/updateGameState.ts
// No-op update function for sand game state

import type { GameState } from './GameState';

export function updateGameState(gameState: GameState): void {
  const { grid, width, height } = gameState;
  // Copy grid to avoid moving sand multiple times per frame
  const newGrid = new Uint8Array(grid);
  // Iterate from bottom up so sand falls correctly
  for (let y = height - 2; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (grid[i] === 1) {
        const below = (y + 1) * width + x;
        // Try to fall straight down
        if (grid[below] === 0) {
          newGrid[i] = 0;
          newGrid[below] = 1;
        } else {
          // Try to cascade left or right
          const left = (y + 1) * width + (x - 1);
          const right = (y + 1) * width + (x + 1);
          const canLeft = x > 0 && grid[left] === 0;
          const canRight = x < width - 1 && grid[right] === 0;
          if (canLeft && canRight) {
            // Randomly choose left or right
            if (Math.random() < 0.5) {
              newGrid[i] = 0;
              newGrid[left] = 1;
            } else {
              newGrid[i] = 0;
              newGrid[right] = 1;
            }
          } else if (canLeft) {
            newGrid[i] = 0;
            newGrid[left] = 1;
          } else if (canRight) {
            newGrid[i] = 0;
            newGrid[right] = 1;
          }
        }
      }
    }
  }
  // Copy newGrid back to grid
  grid.set(newGrid);
}
