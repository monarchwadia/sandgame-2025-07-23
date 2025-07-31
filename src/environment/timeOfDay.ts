// src/environment/timeOfDay.ts
// Handles time of day progression for the sand game
import type { GameState } from '../GameState';

let ticksToNextHour = 100;
let countdown = ticksToNextHour;

export function timeOfDayProcessor(gameState: GameState) {
  countdown--;
  if (countdown <= 0) {
    gameState.timeOfDay = (gameState.timeOfDay + 1) % 24;
    countdown = ticksToNextHour;
  }
  
  // Add smooth time progress (0.0 to 1.0 within the current hour)
  gameState.timeProgressPct = 1 - (countdown / ticksToNextHour);
}
