import type { ParticleType } from "./particles.types";
import { SKY_COLORS } from "../palette";

export const SKY_IDX = 0;

export const skyParticle: ParticleType = {
    name: 'sky',
    color: (gameState) => {
        return SKY_COLORS[gameState.timeOfDay];
    }
}