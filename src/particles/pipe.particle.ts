
import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WATER_IDX } from './water.particle';
import { PIPE_COLOR } from '../palette';

export const PIPE_IDX = 10;

export const pipeParticle: ParticleType = {
    name: 'pipe',
    color: PIPE_COLOR,
    behavior: function(grid, width, height, x, y) {
        // If not at bottom, dig downwards
        if (y < height - 1) {
            const below = getIndex(x, y + 1, width);
            if (grid[below] === SKY_IDX) {
                grid[below] = PIPE_IDX;
                grid[getIndex(x, y, width)] = SKY_IDX;
                return;
            }
        } else {
            // At bottom, mark this column for spouting
            grid[getIndex(x, y, width)] = PIPE_IDX;
            // Find the top of the pipe column
            let topY = 0;
            for (let ty = 0; ty < height; ty++) {
                if (grid[getIndex(x, ty, width)] === PIPE_IDX) {
                    topY = ty;
                    break;
                }
            }
            // Spout water at the top
            if (grid[getIndex(x, topY, width)] === PIPE_IDX) {
                grid[getIndex(x, topY, width)] = WATER_IDX;
            }
        }
    }
};
