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

export const HUMAN_IDX = 6;

export const humanParticle: ParticleType = {
    name: 'human',
    color: HUMAN_COLOR, // simple gray for now
    behavior: function(grid: Uint8Array, width: number, height: number, x: number, y: number, _gameState: GameState) {
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
        if (Math.random() < 0.5) {
            // All possible directions (including diagonals)
            const moveDirs = [
                [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
                [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]
            ];
            // Shuffle directions for randomness
            for (const [nx, ny] of moveDirs.sort(() => Math.random() - 0.5)) {
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const ni = getIndex(nx, ny, width);
                    if (grid[ni] === 0 || grid[ni] === WATER_IDX) {
                        grid[i] = grid[ni] === WATER_IDX ? WATER_IDX : 0;
                        grid[ni] = HUMAN_IDX;
                        break;
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
                    console.log(`Human at (${x},${y}) checking (${ax},${ay}): found ${targetSpace}, looking for wood=${WOOD_IDX}, treetop=${TREETOP_IDX}, grass=${GRASS_IDX}`);
                    if (targetSpace === WOOD_IDX || targetSpace === TREETOP_IDX || targetSpace === GRASS_IDX) {
                        console.log(`Chopping! Converting ${targetSpace} to ${SKY_IDX}`);
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
        }
    }
};
