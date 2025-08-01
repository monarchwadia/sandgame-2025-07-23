import { forEachNeighbourInAdjacentCells, getAdjacentCells, getIndex, getRandomNeighbourCell, getRandomNeighbourFromAdjacentCells } from '../gridUtils';
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

        const adjacents = getAdjacentCells(x, y, width, height);

        // Fire moves around randomly
        const neighbour = getRandomNeighbourFromAdjacentCells(adjacents);
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
        if (adjacents.up && grid[adjacents.up.index] === SKY_IDX && getRandom() < 0.04) {
            grid[adjacents.up.index] = AIRPOLLUTION_IDX;
        }

        // Fire moves upwards with a small chance
        if (adjacents.up && grid[adjacents.up.index] === SKY_IDX && getRandom() < 0.1) {
            grid[adjacents.up.index] = FIRE_IDX;
            grid[i] = SKY_IDX;
            return;
        }

        // Fire burns out wood, treetops, and grass
        for (const adj of Object.values(adjacents)) {
            if (adj) {
                const particle = grid[adj.index];
                if (particle === WOOD_IDX || particle === TREETOP_IDX || particle === GRASS_IDX) {
                    if (getRandom() < 0.3) {
                        grid[adj.index] = FIRE_IDX;
                    }
                }
            }
        }
    }
};
