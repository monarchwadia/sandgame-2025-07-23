import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { OIL_COLOR } from '../palette';
import type { GameState } from '../GameState';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import { getRandom } from '../randomseed';
import { areParticlesEqual } from '../utils';

export const OIL_IDX = 11;

export const oilParticle: ParticleType = {
    name: 'oil',
    color: OIL_COLOR,
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, _gameState: GameState) {
        const i = getIndex(x, y, width);
        const belowId = (y+1) * width + x;

        if (y < height - 1) {
            // it falls
            if (areParticlesEqual(grid[belowId], SKY_IDX) || areParticlesEqual(grid[belowId], AIRPOLLUTION_IDX)) {
                grid[i] = SKY_IDX;
                grid[belowId] = OIL_IDX;
                return;
            }
        }

        // Spread horizontally like liquid
        if (getRandom() < 0.5) {
            const directions = [
                [x - 1, y], [x + 1, y]
            ];
            for (const [nx, ny] of directions.sort(() => getRandom() - 0.5)) {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const ni = getIndex(nx, ny, width);
                    if (areParticlesEqual(grid[ni], SKY_IDX)) {
                        grid[ni] = OIL_IDX;
                        grid[i] = SKY_IDX;
                        break;
                    }
                }
            }
        }
    }
};
