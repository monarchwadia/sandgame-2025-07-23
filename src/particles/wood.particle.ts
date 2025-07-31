import { getIndex, getBelow } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { WOOD_COLOR } from '../palette';
import { TREETOP_IDX } from './treetop.particle';
import { SKY_IDX } from './sky.particle';
import { HOUR_INDEXES } from '../constants';
import type { GameState } from '../GameState';
import { getRandom } from '../randomseed';

export const WOOD_IDX = 4;

export const woodParticle: ParticleType = {
    name: 'wood',
    color: WOOD_COLOR, // rich brown wood
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, gameState: GameState) {
        // Wood behaves exactly like grass - only falls vertically, no cascading
        const i = getIndex(x, y, width);
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === SKY_IDX) {
                grid[i] = SKY_IDX;
                grid[below] = WOOD_IDX;
            }
        }

        // Only grow during photosynthesis hours
        const currentHour = gameState.timeOfDay;
        const [startHour, endHour] = HOUR_INDEXES.photosynthesis;
        if (currentHour < startHour || currentHour > endHour) {
            return; // No growth outside photosynthesis hours
        }
        
        // Limit wood growth to max height of 7
        if (y > 0) {
            let woodsBelow = 0;
            for (let checkY = y + 1; checkY < height; checkY++) {
                const checkIndex = getIndex(x, checkY, width);
                if (grid[checkIndex] === WOOD_IDX) {
                    woodsBelow++;
                } else {
                    break; // Stop counting if we hit non-wood
                }
            }
            // Only allow growth if woodsBelow < 15
            if (woodsBelow < 7) {
                if (woodsBelow >= 5) {
                    // mature. chance of growing treetop above
                    const above = getIndex(x, y - 1, width);
                    if (grid[above] === SKY_IDX) {
                        // 50% chance to grow treetop, 25% chance to grow wood
                        const randomInt = getRandom();
                        if (randomInt < 0.3) {
                            grid[above] = WOOD_IDX;
                        } else if (randomInt < 0.9) {
                            grid[above] = TREETOP_IDX;
                        }
                    }
                } else {
                    // random chance that the tree grows a wood
                    const above = getIndex(x, y - 1, width);
                    if (grid[above] === SKY_IDX && getRandom() < 0.03) { // 10% chance
                        grid[above] = WOOD_IDX;
                    }
                }
            }
        }
    }
};
