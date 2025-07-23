
import { getIndex, getBelow, getLeft, getRight } from './gridUtils';

export interface ParticleType {
    name: string;
    color: [number, number, number, number];
    behavior: (grid: Uint8Array, width: number, height: number, x: number, y: number) => void;
}

export const particles: { [key: number]: ParticleType } = {
    [0]: {
        name: 'sand',
        color: [255, 220, 80, 255], // warm yellow RGBA
        behavior: function(grid, width, height, x, y) {
            // Sand falls down if possible, else cascades left/right
            const i = getIndex(x, y, width);
            if (y < height - 1) {
                const below = getBelow(x, y, width);
                if (grid[below] === 0) {
                    grid[i] = 0;
                    grid[below] = 1;
                    return;
                }
                const left = getLeft(x, y, width);
                const right = getRight(x, y, width);
                const canLeft = x > 0 && grid[left] === 0;
                const canRight = x < width - 1 && grid[right] === 0;
                if (canLeft && canRight) {
                    if (Math.random() < 0.5) {
                        grid[i] = 0;
                        grid[left] = 1;
                    } else {
                        grid[i] = 0;
                        grid[right] = 1;
                    }
                } else if (canLeft) {
                    grid[i] = 0;
                    grid[left] = 1;
                } else if (canRight) {
                    grid[i] = 0;
                    grid[right] = 1;
                }
            }
        }
    }
}