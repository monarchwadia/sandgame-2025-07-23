import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WOOD_IDX } from './wood.particle';
import { TREETOP_IDX } from './treetop.particle';
import { GRASS_IDX } from './grass.particle';
import { FIRE_COLOR } from '../palette';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import { getRandom } from '../randomseed';

export const FIRE_IDX = 8;

export const fireParticle: ParticleType = {
    name: 'fire',
    color: FIRE_COLOR,
    behavior: function(grid, width, height, x, y) {
        // behaviour is based on a random number:
        // 0.00 - 0.05: burns out
        // 0.05 - 0.10: stays, spawns air pollution above
        // 0.10 - 0.20: if possible, moves up
        // 0.20 - 0.25: if possible, moves upright
        // 0.25 - 0.30: if possible, move right
        // 0.30 - 0.35: if possible, move rightdown
        // 0.35 - 0.40: if possible, move down
        // 0.40 - 0.45: if possible, move leftdown
        // 0.45 - 0.50: if possible, move left
        // 0.50 - 0.55: if possible, move upleft
        // 0.55 - 1.00: stays
        // Always burns adjacent wood, treetop, or grass

        const selfIdx = y * width + x;
        const upIdx = (y-1) * width + x;
        const upRightIdx = (y-1) * width + (x+1);
        const rightIdx = y * width + (x+1);
        const downRightIdx = (y+1) * width + (x+1);
        const downIdx = (y+1) * width + x;
        const downLeftIdx = (y+1) * width + (x-1);
        const leftIdx = y * width + (x-1);
        const upLeftIdx = (y-1) * width + (x-1);

        const randomInt = getRandom();

        if (randomInt < 0.05) {
            // Burn out
            grid[selfIdx] = SKY_IDX;
            return;
        } else if (randomInt < 0.10) {
            if (upIdx > 0 && grid[upIdx] === SKY_IDX) {
                // Spawn air pollution above
                grid[upIdx] = AIRPOLLUTION_IDX;
            }
        } else if (randomInt < 0.20) {
            // Move up if possible
            if (upIdx> 0 && grid[upIdx] === SKY_IDX) {
                grid[upIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.25) {
            if (upRightIdx > 0 && grid[upRightIdx] === SKY_IDX) {
                // Move up-right if possible
                grid[upRightIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
            
        } else if (randomInt < 0.30) {
            // Move right if possible
            if (rightIdx > 0 && grid[rightIdx] === SKY_IDX) {
                grid[rightIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.35) {
            // Move right-down if possible
            if (downRightIdx > 0 && grid[downRightIdx] === SKY_IDX) {
                grid[downRightIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.40) {
            // Move down if possible
            if (downIdx > 0 && grid[downIdx] === SKY_IDX) {
                grid[downIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.45) {
            // Move left-down if possible
            if (downLeftIdx > 0 && grid[downLeftIdx] === SKY_IDX) {
                grid[downLeftIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.50) {
            // Move left if possible
            if (leftIdx > 0 && grid[leftIdx] === SKY_IDX) {
                grid[leftIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.55) {
            // Move up-left if possible
            if (upLeftIdx > 0 && grid[upLeftIdx] === SKY_IDX) {
                grid[upLeftIdx] = FIRE_IDX;
                grid[selfIdx] = SKY_IDX;
                return;
            }
        } else if (randomInt < 1) {
            // Stays
        }

        // Always spreads if possible
        for (const idx of [
            upIdx, upRightIdx, rightIdx, downRightIdx, downIdx, downLeftIdx, leftIdx, upLeftIdx
        ]) {
            if (idx < 0 || idx >= grid.length) continue;
            const particleType = grid[idx];
            if (particleType === WOOD_IDX ||
                particleType === TREETOP_IDX ||
                particleType === GRASS_IDX) {
                grid[idx] = FIRE_IDX; // Ignite adjacent wood, treetop, or grass
            }
        }
    }
};
