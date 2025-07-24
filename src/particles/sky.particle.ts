import type { ParticleType } from "./particles.types";
import { SKY_COLORS } from "../palette";

export const SKY_IDX = 0;

export const skyParticle: ParticleType = {
    name: 'sky',
    color: (gameState) => {
        const {timeOfDay, timeProgressPct} = gameState;
        const currColor = SKY_COLORS[timeOfDay % SKY_COLORS.length];
        const nextColor = SKY_COLORS[(timeOfDay + 1) % SKY_COLORS.length];
        
        // Parse RGBA values from current and next colors
        const currRGBA = currColor.match(/rgba?\(([^)]+)\)/)?.[1].split(',').map(s => parseFloat(s.trim())) || [0,0,0,1];
        const nextRGBA = nextColor.match(/rgba?\(([^)]+)\)/)?.[1].split(',').map(s => parseFloat(s.trim())) || [0,0,0,1];
        
        // Interpolate between colors
        const r = currRGBA[0] + (nextRGBA[0] - currRGBA[0]) * timeProgressPct;
        const g = currRGBA[1] + (nextRGBA[1] - currRGBA[1]) * timeProgressPct;
        const b = currRGBA[2] + (nextRGBA[2] - currRGBA[2]) * timeProgressPct;
        const a = currRGBA[3] + (nextRGBA[3] - currRGBA[3]) * timeProgressPct;
        
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    }
}