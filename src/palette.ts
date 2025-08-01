// Realistic and saturated color palette for the sandgame project
// All colors are defined as RGBA strings with natural but vibrant aesthetics

import type { RGBA } from "./particles/particles.types";

// Particle colors - realistic but saturated desert theme
export const SAND_COLOR: RGBA = [255, 200, 120, 255]; // warm golden sand
export const WATER_COLOR: RGBA = [30, 144, 255, 200]; // deep blue water, semi-transparent
export const GRASS_COLOR: RGBA = [60, 180, 75, 255]; // vibrant grass green
export const WOOD_COLOR: RGBA = [139, 69, 19, 255]; // rich brown wood
export const TREETOP_COLOR: RGBA = [34, 139, 34, 255]; // forest green
export const CONCRETE_COLOR: RGBA = [128, 128, 128, 255]; // gray concrete
export const HUMAN_COLOR: RGBA = [180, 60, 220, 255]; // vibrant purple for human
export const FIRE_COLOR: RGBA = [255, 52, 21, 255]; // bright orange-red for fire
export const LIGHTNING_COLOR: RGBA = [255, 255, 120, 255]; // bright yellow for lightning
export const PIPE_COLOR: RGBA = [68, 67, 67, 255]; // neutral gray for pipe
export const OIL_COLOR: RGBA = [20, 20, 20, 255]; // dark black oil
export const AIRPOLLUTION_COLOR: RGBA = [120, 200, 80, 200]; // sickly green
export const ACID_COLOR: RGBA = [200, 255, 50, 200]; // bright yellow-green acid

// Sky colors for each hour (0-23) - realistic day/night cycle with rich saturation
export const SKY_COLORS: RGBA[] = [
  [8, 15, 40, 100],     // 0: midnight - deep night blue
  [12, 20, 45, 100],    // 1: late night
  [16, 25, 50, 100],    // 2: very early morning
  [25, 35, 65, 100],    // 3: pre-dawn
  [45, 55, 85, 100],    // 4: dawn begins - deep blue
  [80, 100, 140, 100],  // 5: dawn - rich blue
  [255, 140, 180, 100], // 6: sunrise - less saturated pink
  [255, 120, 180, 100], // 7: early morning - rosy pink
  [180, 170, 220, 100], // 8: morning - between pink and blue
  [200, 230, 255, 100], // 9: late morning - pale blue
  [135, 206, 250, 100], // 10: mid-morning - sky blue
  [100, 180, 255, 100], // 11: late morning - bright blue
  [70, 160, 255, 100],  // 12: noon - deep blue sky
  [80, 170, 255, 100],  // 13: early afternoon
  [90, 180, 250, 100],  // 14: afternoon
  [120, 190, 240, 100], // 15: mid-afternoon - cool blue
  [160, 210, 250, 100], // 16: late afternoon - pale blue
  [180, 210, 230, 100], // 17: early evening - soft blue
  [140, 180, 220, 100], // 18: sunset begins - cool blue
  [120, 140, 200, 100], // 19: sunset - muted blue
  [100, 120, 180, 100], // 20: dusk - cool blue/purple
  [100, 50, 120, 100],  // 21: twilight - deep purple
  [50, 30, 80, 100],    // 22: late twilight - dark purple
  [20, 20, 60, 100],    // 23: night - deep blue
];
