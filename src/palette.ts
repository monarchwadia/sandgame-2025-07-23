import type { RGBA } from "./particles/particles.types";

export const SAND_COLOR: RGBA =  [240, 200, 120, 255]; // warm golden, less saturated
export const WATER_COLOR: RGBA = [186, 225, 255, 255]; // pastel blue
export const GRASS_COLOR: RGBA = [44, 176, 55, 255]; // LotR deep green
export const WOOD_COLOR: RGBA = [255, 140, 60, 255]; // glowing brown
export const TREETOP_COLOR: RGBA = [44, 176, 55, 255]; // LotR vibrant green
export const CONCRETE_COLOR: RGBA = [255, 255, 255, 255]; // white
export const HUMAN_COLOR: RGBA = [0, 174, 255, 255]; // industrial bright blue
export const FIRE_COLOR: RGBA = [255, 0, 0, 255]; // neon red, non-pastel
export const LIGHTNING_COLOR: RGBA = [255, 255, 0, 255]; // neon yellow
export const PIPE_COLOR: RGBA = [0, 174, 255, 255]; // industrial bright blue
export const OIL_COLOR: RGBA = [0, 0, 0, 255]; // black
export const AIRPOLLUTION_COLOR: RGBA = [120, 255, 0, 255]; // lime green, semi-transparent
export const ACID_COLOR: RGBA = [220, 255, 60, 200]; // lime yellow, semi-transparent
export const BOUNCY_COLOR: RGBA = [255, 0, 200, 255]; // bright pink
export const SKY_NIGHT_COLOR: RGBA = [186, 186, 255, 80]; // lavender
export const SKY_DAY_COLOR: RGBA   = [186, 225, 255, 90]; // pastel blue

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const SKY_COLORS: RGBA[] = Array.from({ length: 24 }, (_, h) => {
  let t: number;
  let from: RGBA;
  let to: RGBA;
  if (h <= 12) {
    t = h / 12;
    from = SKY_NIGHT_COLOR;
    to = SKY_DAY_COLOR;
  } else {
    t = (h - 12) / 12;
    from = SKY_DAY_COLOR;
    to = SKY_NIGHT_COLOR;
  }
  return [
    Math.round(lerp(from[0], to[0], t)),
    Math.round(lerp(from[1], to[1], t)),
    Math.round(lerp(from[2], to[2], t)),
    Math.round(lerp(from[3], to[3], t)),
  ];
});