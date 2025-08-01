import { getAdjacentCells, getIndex, getRandomNeighbourCell } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WOOD_IDX } from './wood.particle';
import { TREETOP_IDX } from './treetop.particle';
import { GRASS_IDX } from './grass.particle';
import { FIRE_COLOR } from '../palette';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import { getRandom } from '../randomseed';

export const FIRE_IDX = 8;

export const fireParticle: ParticleType = {
    name: 'fire',
    color: FIRE_COLOR,
    behavior: function(grid, width, height, x, y) {
        const i = getIndex(x, y, width);

        const neighbour = getRandomNeighbourCell(x, y, width, height);
        if (grid[neighbour.index] === SKY_IDX && getRandom() < 0.02) {
            grid[neighbour.index] = FIRE_IDX;
            grid[i] = SKY_IDX;
            return;
        }

        // Fire burns out with a small chance
        if (getRandom() < 0.05) {
            grid[i] = SKY_IDX;
            return;
        }

        // Fire occasionally spawns air pollution above it
        if (y > 0 && getRandom() < 0.04) {
            const aboveIdx = getIndex(x, y - 1, width);
            if (grid[aboveIdx] === SKY_IDX) {
                grid[aboveIdx] = AIRPOLLUTION_IDX;
            }
        }

        // Fire spreads to adjacent flammable particles
        const adjacents = Object.entries(getAdjacentCells(x, y, width, height));
        for (const [_, adj] of adjacents) {
            if (!adj) continue; // Skip if out of bounds

            const particle = grid[adj.index];
            if (
                particle === WOOD_IDX ||
                particle === TREETOP_IDX ||
                particle === GRASS_IDX
            ) {
                if (getRandom() < 0.3) {
                    grid[adj.index] = FIRE_IDX;
                }
            }
        }
    }
};
