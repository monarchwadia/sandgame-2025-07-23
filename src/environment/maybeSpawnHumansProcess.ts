import { HUMAN_IDX } from '../particles/human.particle';
import { WOOD_IDX } from '../particles/wood.particle';
import { SKY_IDX } from '../particles/sky.particle';
import type { GameState } from '../GameState';

let firstHumanSpawned = false;

export function maybeSpawnHumans(gameState: GameState) {
  let woodCount = 0;
  for (let i = 0; i < gameState.grid.length; i++) {
    if (gameState.grid[i] === WOOD_IDX) woodCount++;
  }
  if (woodCount >= 20) {
    // Tiny chance to spawn a human, unless its the first time, in which case spawn 3 at random points at the top of the sky
    if (!firstHumanSpawned) {
      let spawned = 0;
      while (spawned < 3) {
        const idx = Math.floor(Math.random() * gameState.width);
        if (gameState.grid[idx] === SKY_IDX) {
          gameState.grid[idx] = HUMAN_IDX;
          spawned++;
        }
      }
      firstHumanSpawned = true;
    } else {
      // 0.5% chance to spawn a human at a random top sky cell
      if (Math.random() < 0.000005) {
        const idx = Math.floor(Math.random() * gameState.width);
        if (gameState.grid[idx] === SKY_IDX) {
          gameState.grid[idx] = HUMAN_IDX;
        }
      }
    }
  }
}
