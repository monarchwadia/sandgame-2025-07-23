import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { LIGHTNING_COLOR } from '../palette';
import { WOOD_IDX } from './wood.particle';
import { TREETOP_IDX } from './treetop.particle';
import { GRASS_IDX } from './grass.particle';
import { HUMAN_IDX } from './human.particle';
import { FIRE_IDX } from './fire.particle';
import { AIRPOLLUTION_IDX } from './airpollution.particle';
import { getRandom } from '../randomseed';
import { areParticlesEqual } from '../utils';

export const LIGHTNING_IDX = 9;

function eraseContiguousLightning(grid: Uint32Array, width: number, height: number, x: number, y: number) {
    const stack = [[x, y]];
    while (stack.length > 0) {
        const [cx, cy] = stack.pop()!;
        const ci = getIndex(cx, cy, width);
        if (grid[ci] !== LIGHTNING_IDX) continue;
        grid[ci] = SKY_IDX;
        // Check all 8 neighbors
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = cx + dx;
                const ny = cy + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const ni = getIndex(nx, ny, width);
                    if (areParticlesEqual(grid[ni], LIGHTNING_IDX)) {
                        stack.push([nx, ny]);
                    }
                }
            }
        }
    }
}

export const lightningParticle: ParticleType = {
    name: 'lightning',
    color: LIGHTNING_COLOR,
    behavior: function(grid, width, height, x, y, _gameState) {
        // If any of bottom, bottom-left, or bottom-right is non-sky and non-lightning, erase contiguous lightning
        if (y < height - 1) {
            const below = getIndex(x, y + 1, width);
            const belowLeft = x > 0 ? getIndex(x - 1, y + 1, width) : -1;
            const belowRight = x < width - 1 ? getIndex(x + 1, y + 1, width) : -1;
            const cells = [below];
            if (belowLeft !== -1) cells.push(belowLeft);
            if (belowRight !== -1) cells.push(belowRight);
            for (const idx of cells) {
                if (idx >= 0 && grid[idx] !== SKY_IDX && grid[idx] !== LIGHTNING_IDX && grid[idx] !== AIRPOLLUTION_IDX) {
                    // CURRENT CELL IS THE STRIKE POINT
                    // Ignite a larger fireball area (5x5) around the strike point
                    const fireballRadius = 2; // 2 = 5x5 area
                    for (let dx = -fireballRadius; dx <= fireballRadius; dx++) {
                        for (let dy = -fireballRadius; dy <= fireballRadius; dy++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const ni = getIndex(nx, ny, width);
                                if (
                                    areParticlesEqual(grid[ni], WOOD_IDX) ||
                                    areParticlesEqual(grid[ni], TREETOP_IDX) ||
                                    areParticlesEqual(grid[ni], GRASS_IDX) ||
                                    areParticlesEqual(grid[ni], HUMAN_IDX) ||
                                    areParticlesEqual(grid[ni], SKY_IDX) // Allow lightning to ignite sky
                                ) {
                                    grid[ni] = FIRE_IDX;
                                }
                            }
                        }
                    }
                    eraseContiguousLightning(grid, width, height, x, y);
                    return;
                }
            }
        }

        // Only allow the head to spawn: no lightning in bottom, bottomleft, bottomright
        let isHead = true;
        if (y < height - 1) {
            if (areParticlesEqual(grid[getIndex(x, y + 1, width)], LIGHTNING_IDX)) isHead = false;
            if (x > 0 && areParticlesEqual(grid[getIndex(x - 1, y + 1, width)], LIGHTNING_IDX)) isHead = false;
            if (x < width - 1 && areParticlesEqual(grid[getIndex(x + 1, y + 1, width)], LIGHTNING_IDX)) isHead = false;
        } else {
            isHead = false;
        }
        if (!isHead) return;

        // Spawn lightning below (biased towards sides)
        if (y < height - 1) {
            const options = [];
            if (areParticlesEqual(grid[getIndex(x, y + 1, width)], SKY_IDX)) options.push([x, y + 1]);
            if (x > 0 && areParticlesEqual(grid[getIndex(x - 1, y + 1, width)], SKY_IDX)) options.push([x - 1, y + 1]);
            if (x < width - 1 && areParticlesEqual(grid[getIndex(x + 1, y + 1, width)], SKY_IDX)) options.push([x + 1, y + 1]);
            if (options.length > 0) {
                // Pick random with bias towards sides
                const choice = getRandom() < 0.7 && options.length > 1 ? 
                    options[Math.floor(getRandom() * (options.length - 1)) + 1] : 
                    options[0];
                grid[getIndex(choice[0], choice[1], width)] = LIGHTNING_IDX;
            }
        }
    }
};
