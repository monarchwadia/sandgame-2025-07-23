import { getIndex, getBelow, getLeft, getRight } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { GRASS_COLOR } from '../palette';

export const grassParticle: ParticleType = {
    name: 'grass',
    color: GRASS_COLOR, // vibrant green grass
    behavior: function(grid, width, height, x, y) {
        // Grass only falls vertically, no cascading
        const i = getIndex(x, y, width);
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === 0) {
                grid[i] = 0;
                grid[below] = 3; // 3 = grass
            }
        }
    }
};
