import type { ParticleType } from './particles.types';
import { ACID_COLOR } from '../palette';
import { SKY_IDX } from './sky.particle';
import { CONCRETE_IDX } from './concrete.particle';
import { SAND_IDX } from './sand.particle';
import { GRASS_IDX } from './grass.particle';
import { WOOD_IDX } from './wood.particle';
import { getRandom } from '../randomseed';

export const ACID_IDX = 14;

const corrode = (
    grid: Uint32Array,
    targetIdx: number,
    selfIdx: number
) => {
    if (targetIdx < 0 || targetIdx >= grid.length) return;
    // Acid corrodes concrete, sand, grass, and wood
    if (grid[targetIdx] === CONCRETE_IDX || grid[targetIdx] === SAND_IDX || 
        grid[targetIdx] === GRASS_IDX || grid[targetIdx] === WOOD_IDX) {
            grid[targetIdx] = ACID_IDX;
            grid[selfIdx] = SKY_IDX;
            
            if (getRandom() < 0.70) {
                // small chance of the acid disappearing after corroding
                grid[targetIdx] = SKY_IDX;
            } 
        }
}

export const acidParticle: ParticleType = {
    name: 'acid',
    color: ACID_COLOR,
    behavior: function(grid, width, height, x, y) {
        // corrosion behaviour depends on a random number:
        // 0.00 - 0.01: attempts to corrode up
        // 0.01 - 0.02: attempts to corrode upright
        // 0.02 - 0.03: attempts to corrode right
        // 0.03 - 0.04: attempts to corrode downright
        // 0.04 - 0.05: attempts to corrode down
        // 0.05 - 0.06: attempts to corrode downleft
        // 0.06 - 0.07: attempts to corrode left
        // 0.07 - 0.08: attempts to corrode upleft
        // it always moves like a liquid particle.

        const selfIdx = y * width + x;
        const randomInt = getRandom();

        if (randomInt < 0.001) {
            // corrode up
            corrode(grid, ((y - 1) * width + x), selfIdx);
        } else if (randomInt < 0.01) {
            // corrode upright
            corrode(grid, ((y - 1) * width + (x + 1)), selfIdx);
        } else if (randomInt < 0.02) {
            // corrode right
            corrode(grid, (y * width + (x + 1)), selfIdx);
        } else if (randomInt < 0.03) {
            // corrode downright
            corrode(grid, ((y + 1) * width + (x + 1)), selfIdx);
        } else if (randomInt < 0.04) {
            // corrode down
            corrode(grid, ((y + 1) * width + x), selfIdx);
        } else if (randomInt < 0.05) {
            // corrode downleft
            corrode(grid, ((y + 1) * width + (x - 1)), selfIdx);
        } else if (randomInt < 0.06) {
            // corrode left
            corrode(grid, (y * width + (x - 1)), selfIdx);
        } else if (randomInt < 0.07) {
            // corrode upleft
            corrode(grid, ((y - 1) * width + (x - 1)), selfIdx);
        } else if (randomInt < 0.08) {
            // corrode up
            corrode(grid, ((y - 1) * width + x), selfIdx);
        } else if (randomInt < 0.999) {
            // no-op
        }

        // --- movement ---
        
        // Acid falls down like water
        if (y < height - 1) {
            const below = (y + 1) * width + x;
            if (grid[below] === SKY_IDX) {
                grid[selfIdx] = SKY_IDX;
                grid[below] = ACID_IDX;
                return;
            }
        }
        
        // Try to move left or right if not moving down
        const bottomLeft = ((y + 1) * width + (x - 1));
        const bottomRight = ((y + 1) * width + (x + 1));
        const canLeft = x > 0 && grid[bottomLeft] === SKY_IDX;
        const canRight = x < width - 1 && grid[bottomRight] === SKY_IDX;
        
        if (canLeft && canRight) {
            if (getRandom() < 0.5) {
                grid[selfIdx] = grid[bottomLeft];
                grid[bottomLeft] = ACID_IDX;
            } else {
                grid[selfIdx] = grid[bottomRight];
                grid[bottomRight] = ACID_IDX;
            }
        } else if (canLeft) {
            grid[selfIdx] = grid[bottomLeft] ;
            grid[bottomLeft] = ACID_IDX;
        } else if (canRight) {
            grid[selfIdx] = grid[bottomRight];
            grid[bottomRight] = ACID_IDX;
        }
    }
};
