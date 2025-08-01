import { getAdjacentCells, getIndex, type XYIndexes } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WOOD_IDX } from './wood.particle';
import { TREETOP_IDX } from './treetop.particle';
import { GRASS_IDX } from './grass.particle';
import { FIRE_COLOR } from '../palette';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import { getRandom } from '../randomseed';

export const FIRE_IDX = 8;

const adjacentIsSky = (grid: Uint32Array, adjacent: XYIndexes | null): adjacent is XYIndexes => {
    return adjacent !== null && grid[adjacent.index] === SKY_IDX;
}

export const fireParticle: ParticleType = {
    name: 'fire',
    color: FIRE_COLOR,
    behavior: function(grid, width, height, x, y) {
        const i = getIndex(x, y, width);

        const adjacents = getAdjacentCells(x, y, width, height);

        const randomInt = getRandom();

        // behaviour is based on a random number:
        // 0.00 - 0.05: burns out
        // 0.05 - 0.10: stays, spawns air pollution above
        // 0.10 - 0.20: if possible, moves up
        // 0.20 - 0.25: if possible, moves upright
        // 0.25 - 0.30: if possible, move right
        // 0.30 - 0.35: if possible, move rightdown
        // 0.35 - 0.40: if possible, move down
        // 0.40 - 0.45: if possible, move leftdown
        // 0.45 - 0.50: if possible, move left
        // 0.50 - 0.55: if possible, move upleft
        // 0.55 - 1.00: stays
        // Always burns adjacent wood, treetop, or grass

        // Fire moves around randomly
        if (randomInt < 0.05) {
            // Burn out
            grid[i] = SKY_IDX;
            return;
        } else if (randomInt < 0.10) {
            // Spawn air pollution above
            if (adjacents.up && grid[adjacents.up.index] === SKY_IDX) {
                grid[adjacents.up.index] = AIRPOLLUTION_IDX;
            }
        } else if (randomInt < 0.20) {
            // Move up if possible
            if (adjacentIsSky(grid, adjacents.up)) {
                grid[adjacents.up.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.25) {
            // Move up-right if possible
            if (adjacentIsSky(grid, adjacents.upRight)) {
                grid[adjacents.upRight.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }  
        } else if (randomInt < 0.30) {
            // Move right if possible
            if (adjacentIsSky(grid, adjacents.right)) {
                grid[adjacents.right.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.35) {
            // Move right-down if possible
            if (adjacentIsSky(grid, adjacents.downRight)) {
                grid[adjacents.downRight.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.40) {
            // Move down if possible
            if (adjacentIsSky(grid, adjacents.down)) {
                grid[adjacents.down.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.45) {
            // Move left-down if possible
            if (adjacentIsSky(grid, adjacents.downLeft)) {
                grid[adjacents.downLeft.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.50) {
            // Move left if possible
            if (adjacentIsSky(grid, adjacents.left)) {
                grid[adjacents.left.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }
        } else if (randomInt < 0.55) {
            // Move up-left if possible
            if (adjacentIsSky(grid, adjacents.upLeft)) {
                grid[adjacents.upLeft.index] = FIRE_IDX;
                grid[i] = SKY_IDX;
                return;
            }
        } else if (randomInt < 1) {
            // Stays
        }

        // Always spreads if possible
        for (const adj of Object.values(adjacents)) {
            if (adj) {
                const particle = grid[adj.index];
                if (particle === WOOD_IDX || particle === TREETOP_IDX || particle === GRASS_IDX) {
                    grid[adj.index] = FIRE_IDX;
                }
            }
        }
    }
};
