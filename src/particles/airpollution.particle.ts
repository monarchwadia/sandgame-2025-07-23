import type { ParticleType } from './particles.types';
import { AIRPOLLUTION_COLOR } from '../palette';
import { SKY_IDX } from './sky.particle';
import { getRandom } from '../randomseed';

export const AIRPOLLUTION_IDX = 13;

export const airpollutionParticle: ParticleType = {
    name: 'airpollution',
    color: AIRPOLLUTION_COLOR,
    behavior: function(grid, width, height, x, y) {
        const r = getRandom();
        const idx = x + y * width;
        
        // Dissipate (0.03% chance)
        if (r < 0.0003) {
            grid[idx] = SKY_IDX;
            return;
        }

        // Rise if below 15% height, drift if at top
        if (y >= Math.floor(height * 0.15)) {
            // Rise up (3% chance)
            if (r < 0.03 && y > 0 && grid[idx - width] === SKY_IDX) {
                grid[idx - width] = AIRPOLLUTION_IDX;
                grid[idx] = SKY_IDX;
            }
        } else if (r < 0.02) {
            // Drift horizontally (2% chance)
            const nx = x + (r < 0.01 ? -1 : 1);
            if (nx >= 0 && nx < width && grid[nx + y * width] === SKY_IDX) {
                grid[nx + y * width] = AIRPOLLUTION_IDX;
                grid[idx] = SKY_IDX;
            }
        }
    }
};
