import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { ACID_COLOR } from '../palette';
import { SKY_IDX } from './sky.particle';
import { CONCRETE_IDX } from './concrete.particle';
import { SAND_IDX } from './sand.particle';
import { GRASS_IDX } from './grass.particle';
import { WOOD_IDX } from './wood.particle';
import { AIRPOLLUTION_IDX } from './airpollution.particle';

export const ACID_IDX = 14;

export const acidParticle: ParticleType = {
    name: 'acid',
    color: ACID_COLOR,
    behavior: function(grid, width, height, x, y) {
        const i = getIndex(x, y, width);

        // chance to disappear
        if (Math.random() < 0.001) { // 0.1%
            grid[i] = SKY_IDX; // Remove acid particle
            return;
        }
        
        // Acid corrodes adjacent particles
        const adjacents = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 }
        ];
        
        for (const adj of adjacents) {
            if (adj.x >= 0 && adj.x < width && adj.y >= 0 && adj.y < height) {
                const idx = getIndex(adj.x, adj.y, width);
                const particle = grid[idx];
                
                // Acid corrodes concrete, sand, grass, and wood
                if (particle === CONCRETE_IDX || particle === SAND_IDX || 
                    particle === GRASS_IDX || particle === WOOD_IDX) {
                    if (Math.random() < 0.00001) { // 5% chance to corrode
                        grid[idx] = SKY_IDX;
                    }
                }
            }
        }
        
        // Acid falls down like water but corrodes what it touches
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === SKY_IDX) {
                grid[i] = SKY_IDX;
                grid[below] = ACID_IDX;
                return;
            }
        }
        
        // Try to move left or right if not moving down
        const left = getIndex(x - 1, y, width);
        const right = getIndex(x + 1, y, width);
        const canLeft = x > 0 && grid[left] === SKY_IDX;
        const canRight = x < width - 1 && grid[right] === SKY_IDX;
        
        if (canLeft && canRight) {
            if (Math.random() < 0.5) {
                grid[i] = SKY_IDX;
                grid[left] = ACID_IDX;
            } else {
                grid[i] = SKY_IDX;
                grid[right] = ACID_IDX;
            }
        } else if (canLeft) {
            grid[i] = SKY_IDX;
            grid[left] = ACID_IDX;
        } else if (canRight) {
            grid[i] = SKY_IDX;
            grid[right] = ACID_IDX;
        }
    }
};
