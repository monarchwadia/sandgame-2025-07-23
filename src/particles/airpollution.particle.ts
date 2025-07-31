import type { ParticleType } from "./particles.types";
import { AIRPOLLUTION_COLOR } from "../palette";
import { SKY_IDX } from "./sky.particle";
import { getRandom } from "../randomseed";

export const AIRPOLLUTION_IDX = 13;

export const airpollutionParticle: ParticleType = {
  name: "airpollution",
  color: AIRPOLLUTION_COLOR,
  behavior: function (grid, width, height, x, y) {
    const idx = x + y * width;

    // Dissipate (0.03% chance)
    if (getRandom() < 0.0003) {
      grid[idx] = SKY_IDX;
      return;
    }

    // Oscillate between top of screen and 15% height
    const topThreshold = Math.floor(height * 0.15);

    // In top 15% - Brownian motion (random walk in all directions)
    if (getRandom() < 0.3) {
      const directions = [
        [0, -1], // up
        [0, 1], // down
        [-1, 0], // left
        [1, 0], // right
        [-1, -1], // up-left
        [1, -1], // up-right
        [-1, 1], // down-left
        [1, 1], // down-right
      ];

      const [dx, dy] =
        directions[Math.floor(getRandom() * 8 * directions.length) % directions.length];
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const newIdx = nx + ny * width;
        if (grid[newIdx] === SKY_IDX) {
          grid[newIdx] = AIRPOLLUTION_IDX;
          grid[idx] = SKY_IDX;
        }
      }
    } else {
        // brownian motion upwards
        const movementThreshold = getRandom();
        // 75% chance of up
        // 25% chance of down movement
        // 50-50 chance of left/right movement
        let yMovement = movementThreshold < 0.75 ? -1 : 1;
        let xMovement = movementThreshold < 0.5 ? -1 : 1;

        const newY = Math.max(0, y + yMovement);
        const newIdx = x + newY * width;
        if (grid[newIdx] === SKY_IDX) {
          grid[newIdx] = AIRPOLLUTION_IDX;
          grid[idx] = SKY_IDX;
        }
    }
  },
};
