import { getIndex, getBelow } from '../gridUtils';
import { GRASS_IDX } from './grass.particle';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { TREETOP_IDX } from './treetop.particle';
import { WOOD_IDX } from './wood.particle';
import { WATER_IDX } from './water.particle';
import { CONCRETE_IDX } from './concrete.particle';
import type { GameState } from '../GameState';
import { HUMAN_COLOR } from '../palette';
import { getRandom } from '../randomseed';

export const HUMAN_IDX = 6;

export const humanParticle: ParticleType = {
    name: 'human',
    color: HUMAN_COLOR, // simple gray for now
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, _gameState: GameState) {
        const i = getIndex(x, y, width);
        // Always try to fall down if possible
        if (y < height - 1) {
            const below = getBelow(x, y, width);
            if (grid[below] === 0) {
                grid[i] = 0;
                grid[below] = HUMAN_IDX;
                return;
            }
        }
        // Random movement: swim or move left/right
        if (getRandom() < 0.5) {
            // All possible directions (including diagonals)
            const moveDirs = [
                [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
                [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]
            ];
            // Shuffle directions for randomness
            for (const [nx, ny] of moveDirs.sort(() => getRandom() - 0.5)) {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const ni = getIndex(nx, ny, width);

                    // Move if the space is empty or water
                    if (grid[ni] === 0 || grid[ni] === WATER_IDX) {
                        grid[i] = grid[ni] === WATER_IDX ? WATER_IDX : 0;
                        grid[ni] = HUMAN_IDX;
                        break;
                    }

                    // else, if there is a sky which has concrete anywhere in its neighorhood,
                    // then human can move to that sky
                    if (grid[ni] === SKY_IDX) {
                        let canMove = false;
                        for (let dx = -1; dx <= 1; dx++) {
                            for (let dy = -1; dy <= 1; dy++) {
                                if (dx === 0 && dy === 0) continue;
                                const nx2 = nx + dx;
                                const ny2 = ny + dy;
                                if (nx2 >= 0 && nx2 < width && ny2 >= 0 && ny2 < height) {
                                    if (grid[getIndex(nx2, ny2, width)] === CONCRETE_IDX) {
                                        canMove = true;
                                        break;
                                    }
                                }
                            }
                            if (canMove) break;
                        }
                        if (canMove) {
                            grid[i] = 0;
                            grid[ni] = HUMAN_IDX;
                            break;
                        }
                    }
                }
            }
            let chopped = false;
            // Chop down adjacent wood/treetop/grass in 8 directions
            const adjacents = [
                [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
                [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]
            ];
            for (const [ax, ay] of adjacents) {
                if (ax >= 0 && ax < width && ay >= 0 && ay < height) {
                    const idx = getIndex(ax, ay, width);
                    const targetSpace = grid[idx];
                    // Debug: log what we're checking
                    if (targetSpace === WOOD_IDX || targetSpace === TREETOP_IDX || targetSpace === GRASS_IDX) {
                        grid[idx] = SKY_IDX; // Remove wood, turn to sky
                        chopped = true;
                    }
                }
            }
            // If chopped, replace below with concrete (but not if human is there)
            if (chopped && y < height - 1) {
                const below = getBelow(x, y, width);
                if (grid[below] !== HUMAN_IDX) {
                    grid[below] = CONCRETE_IDX;
                }
            }

            // If the element above is concrete, destroy it
            if (y > 0) {
                const above = getIndex(x, y - 1, width);
                if (grid[above] === CONCRETE_IDX) {
                    // but only if the human is trapped (no sky or water anywhere next to it)
                    let trapped = true;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < width && ny >= 0 && ny <   height) {
                                const neighborIdx = getIndex(nx, ny, width);
                                if (grid[neighborIdx] === SKY_IDX || grid[neighborIdx] === WATER_IDX) {
                                    trapped = false;
                                    break;
                                }
                            }
                        }
                        if (!trapped) break;
                    }
                    if (trapped) {
                        // Destroy concrete above   
                        grid[above] = SKY_IDX; // Turn concrete above into sky
                    }
                
                }
            }
        }
    }
};
