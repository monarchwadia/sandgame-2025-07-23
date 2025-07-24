import type { GameState } from '../GameState';
import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WATER_IDX } from './water.particle';
import { CONCRETE_COLOR } from '../palette';
import { HUMAN_IDX } from './human.particle';

export const CONCRETE_IDX = 7;

export const concreteParticle: ParticleType = {
    name: 'concrete',
    color: CONCRETE_COLOR, // gray concrete
    behavior: function(grid: Uint8Array, width: number, height: number, x: number, y: number, _gameState: GameState) {
        // Only grow if a human is within 3 spaces (in any direction)
        let humanNearby = false;
        for (let dx = -3; dx <= 3; dx++) {
            for (let dy = -3; dy <= 3; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    if (grid[getIndex(nx, ny, width)] === HUMAN_IDX) {
                        humanNearby = true;
                        break;
                    }
                }
            }
            if (humanNearby) break;
        }
        if (!humanNearby) return;
        // Grow left or right if possible (slowly)
        if (Math.random() < 0.01) {
            if (x > 0 && grid[getIndex(x - 1, y, width)] === SKY_IDX) {
                grid[getIndex(x - 1, y, width)] = CONCRETE_IDX;
                return;
            }
            if (x < width - 1 && grid[getIndex(x + 1, y, width)] === SKY_IDX) {
                grid[getIndex(x + 1, y, width)] = CONCRETE_IDX;
                return;
            }
        }
        // If both left and right are blocked, and sw/s/se are concrete, grow above
        const leftBlocked = x === 0 || grid[getIndex(x - 1, y, width)] !== SKY_IDX;
        const rightBlocked = x === width - 1 || grid[getIndex(x + 1, y, width)] !== SKY_IDX;
        if (leftBlocked && rightBlocked && y > 0) {
            const sw = x > 0 && y < height - 1 ? grid[getIndex(x - 1, y + 1, width)] : -1;
            const s = y < height - 1 ? grid[getIndex(x, y + 1, width)] : -1;
            const se = x < width - 1 && y < height - 1 ? grid[getIndex(x + 1, y + 1, width)] : -1;
            const baseOk = [sw, s, se].every(idx => idx === CONCRETE_IDX);
            if (baseOk && grid[getIndex(x, y - 1, width)] === SKY_IDX) {
                if (Math.random() < 0.01) {
                    grid[getIndex(x, y - 1, width)] = CONCRETE_IDX;
                }
            }
        }
    }
};
