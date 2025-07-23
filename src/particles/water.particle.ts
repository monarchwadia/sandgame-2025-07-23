import { getIndex, getBelow, getLeft, getRight } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { WATER_COLOR } from '../palette';

export const waterParticle: ParticleType = {
    name: 'water',
    color: WATER_COLOR, // blue, semi-transparent
    behavior: function(grid, width, height, x, y) {
        // Water falls down if possible, else flows left/right
        const i = getIndex(x, y, width);
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === 0) {
                grid[i] = 0;
                grid[below] = 2; // 2 = water
                return;
            }
        }
        // Try to move left or right if not moving down
        const left = getIndex(x - 1, y, width);
        const right = getIndex(x + 1, y, width);
        const canLeft = x > 0 && grid[left] === 0;
        const canRight = x < width - 1 && grid[right] === 0;
        if (canLeft && canRight) {
            if (Math.random() < 0.5) {
                grid[i] = 0;
                grid[left] = 2;
            } else {
                grid[i] = 0;
                grid[right] = 2;
            }
        } else if (canLeft) {
            grid[i] = 0;
            grid[left] = 2;
        } else if (canRight) {
            grid[i] = 0;
            grid[right] = 2;
        }
    }
};
