import type { GameState } from '../GameState';
import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { CONCRETE_COLOR } from '../palette';
import { HUMAN_IDX } from './human.particle';
import { PIPE_IDX } from './pipe.particle';
import { getRandom } from '../randomseed';
import { areParticlesEqual } from '../utils';

const GROWTH_FACTOR = 0.1;

export const CONCRETE_IDX = 7;

export const concreteParticle: ParticleType = {
    name: 'concrete',
    color: CONCRETE_COLOR, // gray concrete
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, _gameState: GameState) {
// Check if surrounded by concrete and no pipe within 3 cells
        let surrounded = true;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || nx >= width || ny < 0 || ny >= height || grid[getIndex(nx, ny, width)] !== CONCRETE_IDX) {
                    surrounded = false;
                    break;
                }
            }
            if (!surrounded) break;
        }
        // Check for pipe within 3 cells
        let pipeNearby = false;
        for (let dx = -3; dx <= 3; dx++) {
            for (let dy = -3; dy <= 3; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    if (areParticlesEqual(grid[getIndex(nx, ny, width)], PIPE_IDX)) {
                        pipeNearby = true;
                        break;
                    }
                }
            }
            if (pipeNearby) break;
        }
        // If surrounded and no pipe nearby, convert to pipe
        if (surrounded && !pipeNearby) {
            grid[getIndex(x, y, width)] = PIPE_IDX;
            return;
        }
        
        // Only grow if a human is within 1 space (in any direction)
        let humanNearby = false;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    if (areParticlesEqual(grid[getIndex(nx, ny, width)], HUMAN_IDX)) {
                        humanNearby = true;
                        break;
                    }
                }
            }
            if (humanNearby) break;
        }
        if (!humanNearby) return;

        

        // Helper function to check if there's concrete support within a given distance below
        const hasSupport = (checkX: number, checkY: number, supportDistance: number): boolean => {
            for (let dy = 1; dy <= supportDistance; dy++) {
                const supportY = checkY + dy;
                if (supportY >= height) return true; // Ground level counts as support
                if (areParticlesEqual(grid[getIndex(checkX, supportY, width)], CONCRETE_IDX)) {
                    return true;
                }
            }
            return false;
        };

        // Pyramid slope control: require support within 1 block below for horizontal growth
        const slopeDistance = 1;
        
        // Grow left or right if possible (slowly) and there's adequate support
        if (getRandom() < GROWTH_FACTOR) {
            // Try to grow left
            if (x > 0 && areParticlesEqual(grid[getIndex(x - 1, y, width)], SKY_IDX)) {
                if (hasSupport(x - 1, y, slopeDistance)) {
                    grid[getIndex(x - 1, y, width)] = CONCRETE_IDX;
                    return;
                }
            }
            // Try to grow right
            if (x < width - 1 && areParticlesEqual(grid[getIndex(x + 1, y, width)], SKY_IDX)) {
                if (hasSupport(x + 1, y, slopeDistance)) {
                    grid[getIndex(x + 1, y, width)] = CONCRETE_IDX;
                    return;
                }
            }
        }

        // Grow upward only when there's a solid base (maintains pyramid structure)
        if (y > 0 && areParticlesEqual(grid[getIndex(x, y - 1, width)], SKY_IDX)) {
            // Check for solid foundation below (at least 3 concrete blocks in a row)
            const hasFoundation = y < height - 1 && 
                (x === 0 || areParticlesEqual(grid[getIndex(x - 1, y + 1, width)], CONCRETE_IDX)) &&
                areParticlesEqual(grid[getIndex(x, y + 1, width)], CONCRETE_IDX) &&
                (x === width - 1 || areParticlesEqual(grid[getIndex(x + 1, y + 1, width)] , CONCRETE_IDX));
            
            if (hasFoundation && getRandom() < GROWTH_FACTOR) {
                grid[getIndex(x, y - 1, width)] = CONCRETE_IDX;
            }
        }
    }
};
