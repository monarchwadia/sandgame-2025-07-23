import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { WATER_COLOR } from '../palette';
import { SAND_IDX } from './sand.particle';
import { GRASS_IDX } from './grass.particle';
import { SKY_IDX } from './sky.particle';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import type { GameState } from '../GameState';
import { HOUR_INDEXES } from '../constants';
import { ACID_IDX } from './acid.particle';
import { getRandom } from '../randomseed';
import { OIL_IDX } from './oil.particle';

export const WATER_IDX = 2;

export const waterParticle: ParticleType = {
    name: 'water',
    color: WATER_COLOR, // blue, semi-transparent
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, gameState: GameState) {
        // Water evaporates during highHeat hours
        const currentHour = gameState.timeOfDay;
        const [startHeat, endHeat] = HOUR_INDEXES.highHeat;
        if (currentHour >= startHeat && currentHour <= endHeat) {
            if (getRandom() < 0.001) { // 1% chance per frame
                grid[getIndex(x, y, width)] = SKY_IDX;
                return;
            }
        }
        // Water falls down if possible, else flows left/right
        const i = y * width + x;
        const adjacents = [
            (y - 1) * width + (x - 1),
            (y - 1) * width + x,
            (y - 1) * width + (x + 1),
            y * width + (x - 1),
            y * width + (x + 1),
            (y + 1) * width + (x - 1),
            (y + 1) * width + x,
            (y + 1) * width + (x + 1),
        ];
        
        // Check adjacent sand and possibly turn it into grass
        for (const idx of adjacents) {
            if (idx >= 0 && idx < grid.length && grid[idx] === SAND_IDX) {
                if (getRandom() < 0.01) {
                    grid[idx] = GRASS_IDX;
                }
            }
        }
        if (y < height - 1) {
            const below = (y + 1) * width + x;
            if (grid[below] === SKY_IDX) {
                // Water falls down into empty space
                grid[i] = SKY_IDX;
                grid[below] = WATER_IDX;
                return;
            } else if (grid[below] === AIRPOLLUTION_IDX) {
                // Water turns into oil when it touches air pollution
                grid[i] = SKY_IDX;
                grid[below] = ACID_IDX;
                return;
            } else if (grid[below] === OIL_IDX) {
                // Water displaces oil
                grid[i] = OIL_IDX;
                grid[below] = WATER_IDX;
                return;
            }
        }
        // Try to move left or right if not moving down
        const left = y * width + (x - 1);
        const right = y * width + (x + 1);
        const canLeft = x > 0 && grid[left] === SKY_IDX || grid[left] === OIL_IDX;
        const canRight = x < width - 1 && grid[right] === SKY_IDX || grid[right] === OIL_IDX;
        
        // Check if water would contact air pollution when moving left/right
        if (x > 0 && grid[left] === AIRPOLLUTION_IDX) {
            grid[i] = SKY_IDX;
            grid[left] = ACID_IDX;
            return;
        }
        if (x < width - 1 && grid[right] === AIRPOLLUTION_IDX) {
            grid[i] = SKY_IDX;
            grid[right] = ACID_IDX;
            return;
        }
        
        if (canLeft && canRight) {
            if (getRandom() < 0.5) {
                grid[i] = grid[left];
                grid[left] = WATER_IDX;
            } else {
                grid[i] = grid[right];
                grid[right] = WATER_IDX;
            }
        } else if (canLeft) {
            grid[i] = grid[left];
            grid[left] = WATER_IDX;
        } else if (canRight) {
            grid[i] = grid[right];
            grid[right] = WATER_IDX;
        }
    }
};
