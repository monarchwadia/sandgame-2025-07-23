import type { ParticleType } from "./particles.types";
import { SAND_COLOR } from "../palette";
import { SKY_IDX } from "./sky.particle";
import { WATER_IDX } from "./water.particle";
import { getRandom } from "../randomseed";

export const SAND_IDX = 1;

export const sandParticle: ParticleType = {
  name: "sand",
  // color: [255, 220, 80, 255], // warm yellow RGBA
  color: SAND_COLOR, // warm yellow RGBA as string
  behavior: function (
    grid: Uint32Array,
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    // Behaviour:
    // Sand will fall vertically through sky or water.
    // If the cell below is occupied by sand, it will cascade left or right, depending on which space is free.
    // If both left and right are free, it will randomly choose one.
    // If neither left nor right is free, it will stay in place.

    const selfIdx = y * width + x;

    if (y >= height - 1) {
      // Can't fall down, we're at the bottom
      return; 
    }

    const belowIdx = (y + 1) * width + x;

    // Sand falls through sky
    if (grid[belowIdx] === SKY_IDX) {
        grid[selfIdx] = SKY_IDX; // Clear current cell
        grid[belowIdx] = SAND_IDX; // Set below cell to sand
        return;
    }

    // Sand also falls through water
    if (grid[belowIdx] === WATER_IDX) {
        grid[selfIdx] = WATER_IDX; // Clear current cell
        grid[belowIdx] = SAND_IDX; // Set below cell to sand
        return;
    }

    // cascade left or right if not moving down
    // It can cascade through either sky or water
    const downLeft = (y + 1) * width + (x - 1);
    const downRight = (y + 1) * width + (x + 1);
    const canCascadeLeft = x > 0 && (grid[downLeft] === SKY_IDX || grid[downLeft] === WATER_IDX);
    const canCascadeRight = x > 0 && (grid[downRight] === SKY_IDX || grid[downRight] === WATER_IDX);
    if (canCascadeLeft && canCascadeRight) {
      // Randomly choose to cascade left or right
      if (getRandom() < 0.5) {
        grid[selfIdx] = grid[downLeft];
        grid[downLeft] = SAND_IDX;
      } else {
        grid[selfIdx] = grid[downRight];
        grid[downRight] = SAND_IDX;
      }
    } else if (canCascadeLeft) {
      // If the only direction to cascade is left, take it
      grid[selfIdx] = grid[downLeft];
      grid[downLeft] = SAND_IDX;
    } else if (canCascadeRight) {
      // If the only direction to cascade is right, take it
      grid[selfIdx] = grid[downRight];
      grid[downRight] = SAND_IDX;
    }
  },
};
