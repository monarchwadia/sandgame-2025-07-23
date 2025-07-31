
import type { ParticleType } from "./particles.types";
import { SKY_COLORS } from "../palette";

// Pre-parse SKY_COLORS to RGBA arrays for fast interpolation
function parseRGBA(color: string): [number, number, number, number] {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (!match) return [0,0,0,1];
    const arr = match[1].split(',').map(s => parseFloat(s.trim()));
    if (arr.length === 3) arr.push(1); // rgb() fallback
    return [arr[0], arr[1], arr[2], arr[3]];
}

const SKY_COLORS_RGBA: [number, number, number, number][] = SKY_COLORS.map(parseRGBA);

export const SKY_IDX = 0;

export const skyParticle: ParticleType = {
    name: 'sky',
    color: (gameState) => {
        const {timeOfDay, timeProgressPct} = gameState;
        const currRGBA = SKY_COLORS_RGBA[timeOfDay % SKY_COLORS_RGBA.length];
        const nextRGBA = SKY_COLORS_RGBA[(timeOfDay + 1) % SKY_COLORS_RGBA.length];
        // Interpolate between colors
        const r = currRGBA[0] + (nextRGBA[0] - currRGBA[0]) * timeProgressPct;
        const g = currRGBA[1] + (nextRGBA[1] - currRGBA[1]) * timeProgressPct;
        const b = currRGBA[2] + (nextRGBA[2] - currRGBA[2]) * timeProgressPct;
        const a = currRGBA[3] + (nextRGBA[3] - currRGBA[3]) * timeProgressPct;
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    }
}