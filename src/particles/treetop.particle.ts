import { getIndex } from '../gridUtils';
import type { ParticleType } from './particles.types';
import { TREETOP_COLOR } from '../palette';

export const TREETOP_IDX = 5;

export const treetopParticle: ParticleType = {
    name: 'treetop',
    color: TREETOP_COLOR, // forest green
    behavior: function(grid, width, height, x, y) {
        // Rule 2: Treetop can only grow if:
        // - Has exactly 1 wood/treetop neighbor (stays connected)
        // - Has ≤ 1 other treetop neighbor (low competition)
        
        const i = getIndex(x, y, width);
        
        // Check all 4 adjacent cells
        const neighbors = [
            { x: x - 1, y: y },     // left
            { x: x + 1, y: y },     // right
            { x: x, y: y - 1 },     // above
            { x: x, y: y + 1 }      // below
        ];
        
        let woodTreetopNeighbors = 0;
        let treetopNeighbors = 0;
        const growthCandidates = [];
        
        for (const neighbor of neighbors) {
            if (neighbor.x >= 0 && neighbor.x < width && neighbor.y >= 0 && neighbor.y < height) {
                const neighborIndex = getIndex(neighbor.x, neighbor.y, width);
                const neighborType = grid[neighborIndex];
                
                if (neighborType === 4 || neighborType === 5) { // wood or treetop
                    woodTreetopNeighbors++;
                    if (neighborType === 5) {
                        treetopNeighbors++;
                    }
                } else if (neighborType === 0) { // sky - potential growth spot
                    growthCandidates.push(neighborIndex);
                }
            }
        }
        
        // Growth conditions (Rule 2):
        // - Must be connected (at least 1 wood/treetop neighbor)
        // - Low competition (≤ 1 treetop neighbor)
        // - Has sky to grow into
        if (woodTreetopNeighbors >= 1 && treetopNeighbors <= 1 && growthCandidates.length > 0) {
            // 10% chance to grow each frame (adjust as needed)
            if (Math.random() < 0.01) {
                const randomSpot = growthCandidates[Math.floor(Math.random() * growthCandidates.length)];
                grid[randomSpot] = 5; // 5 = treetop
            }
        }
    }
};
