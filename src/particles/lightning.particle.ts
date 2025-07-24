import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { SKY_IDX } from './sky.particle';
import { LIGHTNING_COLOR } from '../palette';

export const LIGHTNING_IDX = 9;

// Each lightning segment stores a unique trailId in a parallel array (not in grid)
// We'll use a static map to track trail segments for each trailId
const trailMap: Record<number, number[]> = {};
let nextTrailId = 1;

export const lightningParticle: ParticleType = {
    name: 'lightning',
    color: LIGHTNING_COLOR,
    behavior: function(grid, width, height, x, y, _gameState) {
        const i = getIndex(x, y, width);
        // If this is the top segment, assign a new trailId
        if (!('lightningTrailId' in window)) {
            (window as any).lightningTrailId = new Uint32Array(grid.length);
        }
        const trailArr = (window as any).lightningTrailId as Uint32Array;
        let trailId = trailArr[i];
        if (!trailId) {
            trailId = nextTrailId++;
            trailArr[i] = trailId;
            trailMap[trailId] = [i];
        }
        // If not at bottom, move down in a random left/center/right pattern
        if (y < height - 1) {
            const options = [x];
            if (x > 0) options.push(x - 1);
            if (x < width - 1) options.push(x + 1);
            const nx = options[Math.floor(Math.random() * options.length)];
            const ni = getIndex(nx, y + 1, width);
            if (grid[ni] === SKY_IDX) {
                grid[ni] = LIGHTNING_IDX;
                trailArr[ni] = trailId;
                trailMap[trailId].push(ni);
            } else {
                // Hit ground: erase the whole trail
                for (const idx of trailMap[trailId]) {
                    grid[idx] = SKY_IDX;
                    trailArr[idx] = 0;
                }
                delete trailMap[trailId];
            }
        }
    }
};
