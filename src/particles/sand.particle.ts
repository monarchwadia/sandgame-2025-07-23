import { getIndex, getBelow, getLeft, getRight } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SAND_COLOR } from '../palette';
import { SKY_IDX } from './sky.particle';
import { WATER_IDX } from './water.particle';
import type { GameState } from '../GameState';
import { getRandom } from '../randomseed';

export const SAND_IDX = 1;

export const sandParticle: ParticleType = {
    name: 'sand',
    // color: [255, 220, 80, 255], // warm yellow RGBA
    color: SAND_COLOR, // warm yellow RGBA as string
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, _gameState: GameState) {
        // Sand falls down if possible, else cascades left/right
        const i = getIndex(x, y, width);
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === SKY_IDX || grid[below] === WATER_IDX) {
                grid[i] = grid[below] === WATER_IDX ? WATER_IDX : SKY_IDX;
                grid[below] = SAND_IDX;
                return;
            }
            const left = getLeft(x, y, width);
            const right = getRight(x, y, width);
            const canLeft = x > 0 && grid[left] === SKY_IDX;
            const canRight = x < width - 1 && grid[right] === SKY_IDX;
            if (canLeft && canRight) {
                if (getRandom() < 0.5) {
                    grid[i] = SKY_IDX;
                    grid[left] = SAND_IDX;
                } else {
                    grid[i] = SKY_IDX;
                    grid[right] = SAND_IDX;
                }
            } else if (canLeft) {
                grid[i] = SKY_IDX;
                grid[left] = SAND_IDX;
            } else if (canRight) {
                grid[i] = SKY_IDX;
                grid[right] = SAND_IDX;
            }
        }
    }
};
