import { HUMAN_IDX } from '../particles/human.particle';
import { SKY_IDX } from '../particles/sky.particle';
import type { GameState } from '../GameState';
import { getRandom } from '../randomseed';

export function maybeSpawnHumans(gameState: GameState) {
  // Count humans
  let humanCount = 0;
  for (let i = 0; i < gameState.grid.length; i++) {
    if (gameState.grid[i] === HUMAN_IDX) humanCount++;
  }
  // Always ensure at least 3 humans
  while (humanCount < 3) {
    // Try to spawn at a random top sky cell
    const idx = Math.floor(getRandom() * gameState.width);
    if (gameState.grid[idx] === SKY_IDX) {
      gameState.grid[idx] = HUMAN_IDX;
      humanCount++;
    }
  }
}
