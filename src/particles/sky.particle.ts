
import type { ParticleType } from "./particles.types";


// Singleton array of day/night cycle colors (night, dawn, morning, noon, evening, dusk)
const DAY_NIGHT_COLORS: [number, number, number][] = [
  [44, 20, 60],    // night (midnight)
  [120, 80, 120],  // dawn
  [200, 180, 120], // morning
  [120, 180, 255], // noon
  [255, 180, 120], // evening
  [80, 40, 120],   // dusk
  [44, 20, 60],    // night (wrap to midnight)
];

const scale = [0, 4, 7, 12, 17, 20, 24]; // hours for each color

function lerpColorString(c1: [number, number, number], c2: [number, number, number], t: number, alpha: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  const color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  return color;
}

// Precompute 24 colors for each hour
const PRECOMPUTED_SKY_COLORS: string[] = (() => {
  const arr: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    let idx = 0;
    for (let i = 0; i < scale.length - 1; i++) {
      if (hour >= scale[i] && hour < scale[i + 1]) {
        idx = i;
        break;
      }
    }
    const t = (hour - scale[idx]) / (scale[idx + 1] - scale[idx]);
    const c1 = DAY_NIGHT_COLORS[idx];
    const c2 = DAY_NIGHT_COLORS[idx + 1];
    let alpha = 1;
    if (hour < 5 || hour > 19) alpha = 0.7;
    arr[hour] = lerpColorString(c1, c2, t, alpha);
  }
  return arr;
})();

export const skyParticle: ParticleType = {
    name: 'sky',
    color: (gameState) => {
        return PRECOMPUTED_SKY_COLORS[gameState.timeOfDay];
    }
}