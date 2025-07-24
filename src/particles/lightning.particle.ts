import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { LIGHTNING_COLOR } from '../palette';

export const LIGHTNING_IDX = 9;

export const lightningParticle: ParticleType = {
    name: 'lightning',
    color: LIGHTNING_COLOR,
    behavior: function(grid, width, height, x, y, _gameState) {
        // If any of bottom, bottom-left, or bottom-right is non-sky and non-lightning, erase all lightning
        if (y < height - 1) {
            const below = getIndex(x, y + 1, width);
            const belowLeft = x > 0 ? getIndex(x - 1, y + 1, width) : -1;
            const belowRight = x < width - 1 ? getIndex(x + 1, y + 1, width) : -1;
            const cells = [below];
            if (belowLeft !== -1) cells.push(belowLeft);
            if (belowRight !== -1) cells.push(belowRight);
            for (const idx of cells) {
                if (idx >= 0 && grid[idx] !== SKY_IDX && grid[idx] !== LIGHTNING_IDX) {
                    for (let i = 0; i < grid.length; i++) {
                        if (grid[i] === LIGHTNING_IDX) {
                            grid[i] = SKY_IDX;
                        }
                    }
                    return;
                }
            }
        }

        // Only allow the head to spawn: no lightning in bottom, bottomleft, bottomright
        let isHead = true;
        if (y < height - 1) {
            if (grid[getIndex(x, y + 1, width)] === LIGHTNING_IDX) isHead = false;
            if (x > 0 && grid[getIndex(x - 1, y + 1, width)] === LIGHTNING_IDX) isHead = false;
            if (x < width - 1 && grid[getIndex(x + 1, y + 1, width)] === LIGHTNING_IDX) isHead = false;
        } else {
            isHead = false;
        }
        if (!isHead) return;

        // Spawn lightning below (biased towards sides)
        if (y < height - 1) {
            const options = [];
            if (grid[getIndex(x, y + 1, width)] === SKY_IDX) options.push([x, y + 1]);
            if (x > 0 && grid[getIndex(x - 1, y + 1, width)] === SKY_IDX) options.push([x - 1, y + 1]);
            if (x < width - 1 && grid[getIndex(x + 1, y + 1, width)] === SKY_IDX) options.push([x + 1, y + 1]);
            if (options.length > 0) {
                // Pick random with bias towards sides
                const choice = Math.random() < 0.7 && options.length > 1 ? 
                    options[Math.floor(Math.random() * (options.length - 1)) + 1] : 
                    options[0];
                grid[getIndex(choice[0], choice[1], width)] = LIGHTNING_IDX;
            }
        }
    }
};
