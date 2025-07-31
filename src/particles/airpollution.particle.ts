import type { ParticleType } from './particles.types';
import { AIRPOLLUTION_COLOR, SKY_COLORS } from '../palette';
import { SKY_IDX } from './sky.particle';

export const AIRPOLLUTION_IDX = 13;

export const airpollutionParticle: ParticleType = {
    name: 'airpollution',
    color: AIRPOLLUTION_COLOR,
    behavior: function(grid, width, height, x, y) {
        // occasionally dissipate
        if (Math.random() < 0.0003) {
            grid[x + y * width] = SKY_IDX; // Remove air pollution particle
            return;
        }

        const topThreshold = Math.floor(height * 0.15);
        if (y < topThreshold) {
            // Float horizontally like clouds
            const dir = Math.random() < 0.5 ? -1 : 1;
            const nx = x + dir;
            if (nx >= 0 && nx < width) {
                const nIdx = nx + y * width;
                if (grid[nIdx] === 0) {
                    grid[nIdx] = AIRPOLLUTION_IDX;
                    grid[x + y * width] = 0;
                }
            }
            // Occasionally float up if not at the very top
            if (y > 0 && Math.random() < 0.001) {
                const upIdx = x + (y - 1) * width;
                if (grid[upIdx] === 0) {
                    grid[upIdx] = AIRPOLLUTION_IDX;
                    grid[x + y * width] = 0;
                }
            }
        } else {
            // If not near top, move upwards in a stochastic motion
            if (y > 0 && Math.random() < 0.07) {
                // Try to move up, or diagonally up-left/up-right
                const dirs = [0, -1, 1];
                const dir = dirs[Math.floor(Math.random() * dirs.length)];
                const nx = x + dir;
                const ny = y - 1;
                if (nx >= 0 && nx < width && ny >= 0) {
                    const nIdx = nx + ny * width;
                    if (grid[nIdx] === 0) {
                        grid[nIdx] = AIRPOLLUTION_IDX;
                        grid[x + y * width] = 0;
                    }
                }
            }
        }
    }
};
