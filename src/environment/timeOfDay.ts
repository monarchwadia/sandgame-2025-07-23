// src/environment/timeOfDay.ts
// Handles time of day progression for the sand game

import { DAYNIGHT_SPEED_HPS, FPS } from '../constants';
import type { GameState } from '../GameState';

let fps = FPS;
let daynightSpeedHps = DAYNIGHT_SPEED_HPS;
let secondsPerHour = 1 / daynightSpeedHps / 2;
let framesToNextHour = Math.floor(fps * secondsPerHour);
let countdown = framesToNextHour;

export function timeOfDayProcessor(gameState: GameState) {
  countdown--;
  if (countdown <= 0) {
    gameState.timeOfDay = (gameState.timeOfDay + 1) % 24;
    countdown = framesToNextHour;
  }
}
