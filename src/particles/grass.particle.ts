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
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, gameState: GameState) {
        const i = y * width + x;
        
        // Check if grass is touching water AND has sky above it
        const adjacents = [
            [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
            [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]
        ];
        
        let touchingWater = false;
        for (const [adjx, adjy] of adjacents) {
            if (adjx >= 0 && adjx < width && adjy >= 0 && adjy < height) {
                const adjIndex = adjy * width + adjx;
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
                const above = (y - 1) * width;
                if (grid[above] === SKY_IDX) { // sky above
                    grid[above] = WOOD_IDX;
                    return;
                }
            }
        }
        
        // Grass only falls vertically, no cascading
        if (y < height - 1) {
            const below = (y + 1) * width + x;
            if (grid[below] === SKY_IDX) {
                grid[i] = SKY_IDX;
                grid[below] = GRASS_IDX; // 3 = grass
            }
        }
    }
};
