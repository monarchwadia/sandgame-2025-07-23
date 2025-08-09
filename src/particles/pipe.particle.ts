import type { ParticleType } from "./particles.types";
import { SKY_IDX } from "./sky.particle";
import { PIPE_COLOR } from "../palette";
import { CONCRETE_IDX } from "./concrete.particle";
import { OIL_IDX } from "./oil.particle";
import { getRandom } from "../randomseed";
import { areParticlesEqual } from "../utils";

export const PIPE_IDX = 10;

export const pipeParticle: ParticleType = {
  name: "pipe",
  color: PIPE_COLOR,
  behavior: function (grid, width, height, x, y) {
    // behaviour:
    // always digs deeper if possible
    // if space above is concrete, it breaks through
    // if space above is not pipe, it checks if it is sitting on column of pipes that touches the bottom. if yes, it is a head pipe.
    // if it is a head pipe, the behaviour is as follows:
    // - if above is concrete, it replaces it with pipe
    // - if above is sky, 0.001 chance of spouting oil
    // - 0.001 chance of placing concrete around the head CONTAINER_RADIUS cells away in a diamond shape

    const belowIdx = (y + 1) * width + x;
    const aboveIdx = (y - 1) * width + x;

    // always digs deeper if possible
    if (y < height - 1 && grid[belowIdx] !== PIPE_IDX) {
      grid[belowIdx] = PIPE_IDX;
    }

    if (grid[aboveIdx] !== PIPE_IDX) {
      // this is potentially a head pipe
      let isHeadPipe = true;
      for (let checkY = y + 1; checkY < height; checkY++) {
        const checkIdx = checkY * width + x;
        if (grid[checkIdx] !== PIPE_IDX) {
          isHeadPipe = false;
          break;
        }
      }

      if (isHeadPipe) {
        const randomInt = getRandom();

        // if above is concrete, it breaks through
        if (areParticlesEqual(grid[aboveIdx], CONCRETE_IDX)) {
          grid[aboveIdx] = PIPE_IDX;
        }

        // if above is sky, it spouts oil slowly
        if (areParticlesEqual(grid[aboveIdx], SKY_IDX)) {
          if (randomInt < 0.01) {
            // 0.01% chance per frame
            grid[aboveIdx] = OIL_IDX; // Spout oil
          }
        }
      }
    }
  },
};
