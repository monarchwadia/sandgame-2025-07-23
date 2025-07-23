import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { WOOD_COLOR } from '../palette';

export const WOOD_IDX = 4;

export const woodParticle: ParticleType = {
    name: 'wood',
    color: WOOD_COLOR, // rich brown wood
    behavior: function(grid, width, height, x, y) {
        // Wood behaves exactly like grass - only falls vertically, no cascading
        const i = getIndex(x, y, width);
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === 0) {
                grid[i] = 0;
                grid[below] = 4; // 4 = wood
            }
        }

        
        // Limit wood growth to max height of 7
        if (y > 0) {
            let woodsBelow = 0;
            for (let checkY = y + 1; checkY < height; checkY++) {
                const checkIndex = getIndex(x, checkY, width);
                if (grid[checkIndex] === 4) { // 4 = wood
                    woodsBelow++;
                } else {
                    break; // Stop counting if we hit non-wood
                }
            }
            // Only allow growth if woodsBelow < 15
            if (woodsBelow < 15) {
                if (woodsBelow >= 5) {
                    // mature. chance of growing treetop above
                    const above = getIndex(x, y - 1, width);
                    if (grid[above] === 0) {
                        // 50% chance to grow treetop, 25% chance to grow wood
                        const randomInt = Math.random();
                        if (randomInt < 0.3) {
                            grid[above] = 4; // 4 = wood
                        } else if (randomInt < 0.5) {
                            grid[above] = 5; // 5 = treetop
                        }
                    }
                } else {
                    // random chance that the tree grows a wood
                    const above = getIndex(x, y - 1, width);
                    if (grid[above] === 0 && Math.random() < 0.1) { // 10% chance
                        grid[above] = 4; // 4 = wood
                    }
                }
            }
        }
    }
};
