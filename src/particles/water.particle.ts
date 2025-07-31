import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { WATER_COLOR } from '../palette';
import { SAND_IDX } from './sand.particle';
import { GRASS_IDX } from './grass.particle';
import { SKY_IDX } from './sky.particle';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import { OIL_IDX } from './oil.particle';
import type { GameState } from '../GameState';
import { HOUR_INDEXES } from '../constants';

export const WATER_IDX = 2;

export const waterParticle: ParticleType = {
    name: 'water',
    color: WATER_COLOR, // blue, semi-transparent
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, gameState: GameState) {
        // Water evaporates during highHeat hours
        const currentHour = gameState.timeOfDay;
        const [startHeat, endHeat] = HOUR_INDEXES.highHeat;
        if (currentHour >= startHeat && currentHour <= endHeat) {
            if (Math.random() < 0.001) { // 1% chance per frame
                grid[getIndex(x, y, width)] = SKY_IDX;
                return;
            }
        }
        // Water falls down if possible, else flows left/right
        const i = getIndex(x, y, width);
        // Check adjacent sand and possibly turn it into grass
        const adjacents = [
            getIndex(x - 1, y, width),
            getIndex(x + 1, y, width),
            getIndex(x, y - 1, width),
            getIndex(x, y + 1, width)
        ];
        for (const idx of adjacents) {
            if (idx >= 0 && idx < grid.length && grid[idx] === SAND_IDX) {
                if (Math.random() < 0.01) {
                    grid[idx] = GRASS_IDX;
                }
            }
        }
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === SKY_IDX) {
                grid[i] = SKY_IDX;
                grid[below] = WATER_IDX;
                return;
            } else if (grid[below] === AIRPOLLUTION_IDX) {
                // Water turns into oil when it touches air pollution
                grid[i] = SKY_IDX;
                grid[below] = OIL_IDX;
                return;
            }
        }
        // Try to move left or right if not moving down
        const left = getIndex(x - 1, y, width);
        const right = getIndex(x + 1, y, width);
        const canLeft = x > 0 && grid[left] === SKY_IDX;
        const canRight = x < width - 1 && grid[right] === SKY_IDX;
        
        // Check if water would contact air pollution when moving left/right
        if (x > 0 && grid[left] === AIRPOLLUTION_IDX) {
            grid[i] = SKY_IDX;
            grid[left] = OIL_IDX;
            return;
        }
        if (x < width - 1 && grid[right] === AIRPOLLUTION_IDX) {
            grid[i] = SKY_IDX;
            grid[right] = OIL_IDX;
            return;
        }
        
        if (canLeft && canRight) {
            if (Math.random() < 0.5) {
                grid[i] = SKY_IDX;
                grid[left] = WATER_IDX;
            } else {
                grid[i] = SKY_IDX;
                grid[right] = WATER_IDX;
            }
        } else if (canLeft) {
            grid[i] = SKY_IDX;
            grid[left] = WATER_IDX;
        } else if (canRight) {
            grid[i] = SKY_IDX;
            grid[right] = WATER_IDX;
        }
    }
};
