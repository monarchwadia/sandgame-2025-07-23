
import type { ParticleType } from "./particles.types";
import { SKY_COLORS } from "../palette";



const SKY_COLORS_RGBA: [number, number, number, number][] = SKY_COLORS;

export const SKY_IDX = 0;

export const skyParticle: ParticleType = {
    name: 'sky',
    color: (gameState) => {
        return SKY_COLORS_RGBA[gameState.timeOfDay % SKY_COLORS_RGBA.length];
    }
}