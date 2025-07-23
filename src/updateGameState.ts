// src/updateGameState.ts
// No-op update function for sand game state

import { DAYNIGHT_SPEED_HPS, FPS } from './constants';
import type { GameState } from './GameState';
import { particlesRegistry } from './particles/particlesRegistry';

let fps = FPS;
let daynightSpeedHps = DAYNIGHT_SPEED_HPS;
let secondsPerHour = 1 / daynightSpeedHps / 2;
let framesToNextHour = Math.floor(fps * secondsPerHour);
let countdown = framesToNextHour;

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

  // Countdown for timeOfDay increment
  countdown--;
  if (countdown <= 0) {
    gameState.timeOfDay = (gameState.timeOfDay + 1) % 24;
    countdown = framesToNextHour;
  }
}
