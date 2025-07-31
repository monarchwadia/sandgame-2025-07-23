
import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WATER_IDX } from './water.particle';
import { PIPE_COLOR } from '../palette';
import { CONCRETE_IDX } from './concrete.particle';
import { FIRE_IDX } from './fire.particle';

export const PIPE_IDX = 10;

export const pipeParticle: ParticleType = {
    name: 'pipe',
    color: PIPE_COLOR,
    behavior: function(grid, width, height, x, y) {
        // Check if there is concrete or pipe adjacent (8 directions)
        let adjacentCementOrPipe = false;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const ni = getIndex(nx, ny, width);
                    if (grid[ni] === PIPE_IDX || grid[ni] === CONCRETE_IDX) {
                        adjacentCementOrPipe = true;
                        break;
                    }
                }
            }
            if (adjacentCementOrPipe) break;
        }

        // If not adjacent to concrete/pipe, do nothing
        if (!adjacentCementOrPipe) return;

        // Try to dig down first
        const belowY = y + 1;
        if (belowY < height && grid[getIndex(x, belowY, width)] !== PIPE_IDX) {
            grid[getIndex(x, belowY, width)] = PIPE_IDX;
            return;
        }

        // Can't dig down, so grow head upward
        // Find topmost pipe in this column
        let headY = -1;
        for (let ty = 0; ty < height; ty++) {
            if (grid[getIndex(x, ty, width)] === PIPE_IDX) {
                headY = ty;
                break;
            }
        }

        // Grow head upward by one cell
        if (headY > 0) {
            const aboveIdx = getIndex(x, headY - 1, width);
            const aboveParticle = grid[aboveIdx];
            
            if (aboveParticle === SKY_IDX) {
                // Spout water slowly
                if (Math.random() < 0.01) {
                    grid[aboveIdx] = FIRE_IDX; // Spout water
                }
            } else if (aboveParticle !== PIPE_IDX && aboveParticle !== WATER_IDX && aboveParticle !== FIRE_IDX) {
                grid[aboveIdx] = PIPE_IDX; // Break through concrete/other
            }
        }
    }
};
