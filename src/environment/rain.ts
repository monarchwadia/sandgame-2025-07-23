// src/environment/rain.ts
// Handles rain effect for the sand game

import type { GameState } from '../GameState';
import { getRandom } from '../randomseed';


const RAIN_FRAMES_INTERVAL = 10; // how often to rain (frames)
let rainCountdown = RAIN_FRAMES_INTERVAL;

// Rain event state
let rainActive = true;
let rainStartHour = 0;
let rainDurationHours = 4;
let nextRainHour = Math.floor(getRandom() * (240 - 24 + 1)) + 24; // 24-240 hours

export function rainProcessor(gameState: GameState) {
  // Start rain event if it's time and not already raining
  if (!rainActive && gameState.timeOfDay === nextRainHour % 24) {
    rainActive = true;
    rainStartHour = gameState.timeOfDay;
    rainDurationHours = Math.floor(getRandom() * 2) + 3; // 3-4 hours
  }

  // If raining, spawn water particles
  if (rainActive) {
    rainCountdown--;
    if (rainCountdown <= 0) {
      rainCountdown = RAIN_FRAMES_INTERVAL;
      const { grid, width } = gameState;
      const x = Math.floor(getRandom() * width);
      const y = 0;
      const i = y * width + x;
      grid[i] = 2;
      // Occasionally spawn lightning during rain
      if (getRandom() < 0.05) { // 5% chance per rain drop
        grid[i] = 9; // LIGHTNING_IDX
      }
    }
    // End rain event after duration
    if ((gameState.timeOfDay + 24 - rainStartHour) % 24 >= rainDurationHours) {
      rainActive = false;
      nextRainHour = gameState.timeOfDay + Math.floor(getRandom() * (240 - 24 + 1)) + 24;
    }
  }
}
