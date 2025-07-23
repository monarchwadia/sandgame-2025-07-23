// src/updateGameState.ts
// No-op update function for sand game state

import type { GameState } from './GameState';

export function updateGameState(gameState: GameState): void {
  const { grid } = gameState;
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < 0.2 ? 1 : 0;
  }
}
