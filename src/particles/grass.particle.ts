import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { GRASS_COLOR } from '../palette';

export const grassParticle: ParticleType = {
    name: 'grass',
    color: GRASS_COLOR, // vibrant green grass
    behavior: function(grid, width, height, x, y) {
        const i = getIndex(x, y, width);
        
        // Check if grass is touching water AND has sky above it
        const adjacents = [
            { x: x - 1, y: y },     // left
            { x: x + 1, y: y },     // right
            { x: x, y: y + 1 }      // below
        ];
        
        let touchingWater = false;
        for (const adj of adjacents) {
            if (adj.x >= 0 && adj.x < width && adj.y >= 0 && adj.y < height) {
                const adjIndex = getIndex(adj.x, adj.y, width);
                if (grid[adjIndex] === 2) { // 2 = water
                    touchingWater = true;
                    break;
                }
            }
        }
        
        if (touchingWater && y > 0) {
            const above = getIndex(x, y - 1, width);
            if (grid[above] === 0) { // sky above
                grid[above] = 4; // 4 = wood
                return;
            }
        }
        
        // Grass only falls vertically, no cascading
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === 0) {
                grid[i] = 0;
                grid[below] = 3; // 3 = grass
            }
        }
    }
};
