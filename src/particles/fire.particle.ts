import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WOOD_IDX } from './wood.particle';
import { TREETOP_IDX } from './treetop.particle';
import { GRASS_IDX } from './grass.particle';
import { FIRE_COLOR } from '../palette';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import { getRandom } from '../randomseed';
import { OIL_IDX } from './oil.particle';

export const FIRE_IDX = 8;

// Reusable movement helper (no external condition arg)
function attemptFireMove(
  grid: Uint32Array,
  selfIdx: number,
  targetIdx: number
): boolean {
  if (targetIdx < 0 || targetIdx >= grid.length) return false;
  if (grid[targetIdx] !== SKY_IDX) return false;
  grid[targetIdx] = FIRE_IDX;
  grid[selfIdx] = SKY_IDX;
  return true;
}

export const fireParticle: ParticleType = {
    name: 'fire',
    color: FIRE_COLOR,
    behavior: function(grid, width, _height, x, y) {
        // Movement probability distribution (total movement chance = 0.45):
        // Up 0.10 (double weight) then each 45-degree step clockwise 0.05 until 0.45
        // >=0.45 stays (movement not performed)
        const selfIdx = y * width + x;
        const upIdx = (y-1) * width + x;
        const upRightIdx = (y-1) * width + (x+1);
        const rightIdx = y * width + (x+1);
        const downRightIdx = (y+1) * width + (x+1);
        const downIdx = (y+1) * width + x;
        const downLeftIdx = (y+1) * width + (x-1);
        const leftIdx = y * width + (x-1);
        const upLeftIdx = (y-1) * width + (x-1);

        const r = getRandom();

        if (r < 0.10) { // Up
            if (attemptFireMove(grid, selfIdx, upIdx)) return;        
        } else if (r < 0.15) { // Up-Right
            if (attemptFireMove(grid, selfIdx, upRightIdx)) return;
        } else if (r < 0.20) { // Right
            if (attemptFireMove(grid, selfIdx, rightIdx)) return;
        } else if (r < 0.25) { // Right-Down
            if (attemptFireMove(grid, selfIdx, downRightIdx)) return;
        } else if (r < 0.30) { // Down
            if (attemptFireMove(grid, selfIdx, downIdx)) return;
        } else if (r < 0.35) { // Left-Down
            if (attemptFireMove(grid, selfIdx, downLeftIdx)) return;
        } else if (r < 0.40) { // Left
            if (attemptFireMove(grid, selfIdx, leftIdx)) return;
        } else if (r < 0.45) { // Up-Left
            if (attemptFireMove(grid, selfIdx, upLeftIdx)) return;
        }

        // Pollution spawn
        if (getRandom() < 0.002) {
            if (y > 0 && upIdx >= 0 && grid[upIdx] === SKY_IDX) {
                grid[upIdx] = AIRPOLLUTION_IDX;
            }
        }

        // Burn out chance
        if (getRandom() < 0.05) {
            grid[selfIdx] = SKY_IDX;
            return;
        }
        
        // Spread ignition
        for (const idx of [
            upIdx, upRightIdx, rightIdx, downRightIdx, downIdx, downLeftIdx, leftIdx, upLeftIdx
        ]) {
            if (idx < 0 || idx >= grid.length) continue;
            const pt = grid[idx];
            if (pt === WOOD_IDX || pt === TREETOP_IDX || pt === GRASS_IDX || pt === OIL_IDX) {
                grid[idx] = FIRE_IDX;
            }
        }
    }
};
