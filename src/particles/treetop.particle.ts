import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { TREETOP_COLOR } from '../palette';
import { WOOD_IDX } from './wood.particle';
import { SKY_IDX } from './sky.particle';
import { HOUR_INDEXES } from '../constants';
import type { GameState } from '../GameState';
import { getRandom } from '../randomseed';

export const TREETOP_IDX = 5;

export const treetopParticle: ParticleType = {
    name: 'treetop',
    color: TREETOP_COLOR, // forest green
    behavior: function(grid: Uint32Array, width: number, height: number, x: number, y: number, gameState: GameState) {
        const currentHour = gameState.timeOfDay;
        const [startHour, endHour] = HOUR_INDEXES.photosynthesis;
        // Check all 4 adjacent cells
        const neighbors = [
            { x: x - 1, y: y },     // left
            { x: x + 1, y: y },     // right
            { x: x, y: y - 1 },     // above
            { x: x, y: y + 1 }      // below
        ];
        let woodNeighbours = 0;
        let treetopNeighbours = 0;
        let treetopNeighbors = 0;
        const growthCandidates = [];
        for (const neighbor of neighbors) {
            if (neighbor.x >= 0 && neighbor.x < width && neighbor.y >= 0 && neighbor.y < height) {
                const neighborIndex = getIndex(neighbor.x, neighbor.y, width);
                const neighborType = grid[neighborIndex];
                if (neighborType === WOOD_IDX) { // wood
                    woodNeighbours++;
                } else if (neighborType === TREETOP_IDX) { // treetop
                    treetopNeighbours++;
                    treetopNeighbors++;
                } else if (neighborType === SKY_IDX) { // sky - potential growth spot
                    growthCandidates.push(neighborIndex);
                }
            }
        }

        const totalWoodAndTreetopNeighbors = woodNeighbours + treetopNeighbours;
        // If not in photosynthesis hours, and not touching wood or treetop, chance to disappear
        if (currentHour < startHour || currentHour > endHour) {
            if (woodNeighbours === 0) {
                if (getRandom() < 0.0001) {
                    grid[getIndex(x, y, width)] = SKY_IDX;
                }
            }
            return;
        }
        // Growth conditions (Rule 2):
        // - Must be connected (at least 1 wood/treetop neighbor)
        // - Low competition (≤ 1 treetop neighbor)
        // - Has sky to grow into
        if (totalWoodAndTreetopNeighbors >= 1 && treetopNeighbors <= 1 && growthCandidates.length > 0) {
            // chance to grow each frame (adjust as needed)
            if (getRandom() < 0.01) {
                const randomSpot = growthCandidates[Math.floor(getRandom() * growthCandidates.length)];
                grid[randomSpot] = TREETOP_IDX; // 5 = treetop
            }
        }
    }
};
