import type { ParticleType } from './particles.types';
import type { GameState } from '../GameState';
import { SKY_IDX } from './sky.particle';
import { areParticlesEqual } from '../utils';
import { BOUNCY_COLOR } from '../palette';

export const BOUNCY_IDX = 12;

// Rock-like particle: simply falls straight down through sky.
export const bouncyParticle: ParticleType = {
  name: 'bouncy',
  color: BOUNCY_COLOR,
  behavior(grid: Uint32Array, width: number, height: number, x: number, y: number, _state: GameState) {
    if (y >= height - 1) return; // bottom
    const idx = y * width + x;
    if (!areParticlesEqual(grid[idx], BOUNCY_IDX)) return; // changed earlier
    const belowIdx = (y + 1) * width + x;
    if (areParticlesEqual(grid[belowIdx], SKY_IDX)) {
      grid[belowIdx] = BOUNCY_IDX;
      grid[idx] = SKY_IDX;
    }
  }
};