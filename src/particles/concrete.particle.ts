import type { GameState } from '../GameState';
import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WATER_IDX } from './water.particle';

export const CONCRETE_IDX = 7;

export const concreteParticle: ParticleType = {
    name: 'concrete',
    color: 'rgba(128, 128, 128, 1)', // gray concrete
    behavior: function(grid: Uint8Array, width: number, height: number, x: number, y: number, _gameState: GameState) {
        // Concrete falls down if there's water or sky below, but doesn't cascade
        const i = getIndex(x, y, width);
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === SKY_IDX || grid[below] === WATER_IDX) {
                grid[i] = grid[below] === WATER_IDX ? WATER_IDX : SKY_IDX;
                grid[below] = CONCRETE_IDX;
                return;
            }
        }
    }
};
