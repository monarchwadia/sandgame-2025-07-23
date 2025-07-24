import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { WOOD_IDX } from './wood.particle';
import { TREETOP_IDX } from './treetop.particle';
import { GRASS_IDX } from './grass.particle';
import { FIRE_COLOR } from '../palette';

export const FIRE_IDX = 8;

export const fireParticle: ParticleType = {
    name: 'fire',
    color: FIRE_COLOR,
    behavior: function(grid, width, _height, x, y) {
        const i = getIndex(x, y, width);
        // Fire burns out with a small chance
        if (Math.random() < 0.05) {
            grid[i] = SKY_IDX;
            return;
        }
        // Fire spreads to adjacent flammable particles
        const adjacents = [
            getIndex(x - 1, y, width),
            getIndex(x + 1, y, width),
            getIndex(x, y - 1, width),
            getIndex(x, y + 1, width)
        ];
        for (const idx of adjacents) {
            if (idx >= 0 && idx < grid.length) {
                if (
                    grid[idx] === WOOD_IDX ||
                    grid[idx] === TREETOP_IDX ||
                    grid[idx] === GRASS_IDX
                ) {
                    if (Math.random() < 0.3) {
                        grid[idx] = FIRE_IDX;
                    }
                }
            }
        }
    }
};
