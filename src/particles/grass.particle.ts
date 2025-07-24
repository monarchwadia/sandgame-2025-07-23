import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { GRASS_COLOR } from '../palette';
import { WATER_IDX } from './water.particle';
import { WOOD_IDX } from './wood.particle';
import { SKY_IDX } from './sky.particle';
import { HOUR_INDEXES } from '../constants';
import type { GameState } from '../GameState';

export const GRASS_IDX = 3;

export const grassParticle: ParticleType = {
    name: 'grass',
    color: GRASS_COLOR, // vibrant green grass
    behavior: function(grid: Uint8Array, width: number, height: number, x: number, y: number, gameState: GameState) {
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
                if (grid[adjIndex] === WATER_IDX) { // 2 = water
                    touchingWater = true;
                    break;
                }
            }
        }
        
        if (touchingWater && y > 0) {
            // Only sprout wood during photosynthesis hours
            const currentHour = gameState.timeOfDay;
            const [startHour, endHour] = HOUR_INDEXES.photosynthesis;
            if (currentHour >= startHour && currentHour <= endHour) {
                const above = getIndex(x, y - 1, width);
                if (grid[above] === SKY_IDX) { // sky above
                    grid[above] = WOOD_IDX;
                    return;
                }
            }
        }
        
        // Grass only falls vertically, no cascading
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === SKY_IDX) {
                grid[i] = SKY_IDX;
                grid[below] = GRASS_IDX; // 3 = grass
            }
        }
    }
};
