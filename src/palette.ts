// Realistic and saturated color palette for the sandgame project
// All colors are defined as RGBA strings with natural but vibrant aesthetics

// Particle colors - realistic but saturated desert theme
export const SAND_COLOR = 'rgba(255, 200, 120, 1)'; // warm golden sand
export const WATER_COLOR = 'rgba(30, 144, 255, 0.8)'; // deep blue water, semi-transparent
export const GRASS_COLOR = 'rgba(60, 180, 75, 1)'; // vibrant grass green
export const WOOD_COLOR = 'rgba(139, 69, 19, 1)'; // rich brown wood
export const TREETOP_COLOR = 'rgba(34, 139, 34, 1)'; // forest green
export const CONCRETE_COLOR = 'rgba(128, 128, 128, 1)'; // gray concrete
export const HUMAN_COLOR = 'rgba(180, 60, 220, 1)'; // vibrant purple for human
export const FIRE_COLOR = 'rgba(255, 52, 21, 1)'; // bright orange-red for fire
export const LIGHTNING_COLOR = 'rgba(255, 255, 120, 1)'; // bright yellow for lightning
export const PIPE_COLOR = 'rgba(68, 67, 67, 1)'; // neutral gray for pipe

// Sky colors for each hour (0-23) - realistic day/night cycle with rich saturation
export const SKY_COLORS = [
  'rgba(8, 15, 40, 0.9)',      // 0: midnight - deep night blue
  'rgba(12, 20, 45, 0.9)',     // 1: late night
  'rgba(16, 25, 50, 0.8)',     // 2: very early morning
  'rgba(25, 35, 65, 0.8)',     // 3: pre-dawn
  'rgba(45, 55, 85, 0.8)',     // 4: dawn begins - deep blue
  'rgba(80, 100, 140, 1)',     // 5: dawn - rich blue
  'rgba(255, 140, 180, 1)',    // 6: sunrise - less saturated pink
  'rgba(255, 120, 180, 1)',    // 7: early morning - rosy pink
  'rgba(180, 170, 220, 1)',    // 8: morning - between pink and blue
  'rgba(200, 230, 255, 1)',    // 9: late morning - pale blue
  'rgba(135, 206, 250, 1)',    // 10: mid-morning - sky blue
  'rgba(100, 180, 255, 1)',    // 11: late morning - bright blue
  'rgba(70, 160, 255, 1)',     // 12: noon - deep blue sky
  'rgba(80, 170, 255, 1)',     // 13: early afternoon
  'rgba(90, 180, 250, 1)',     // 14: afternoon
  'rgba(120, 190, 240, 1)',    // 15: mid-afternoon - cool blue
  'rgba(160, 210, 250, 1)',    // 16: late afternoon - pale blue
  'rgba(180, 210, 230, 1)',    // 17: early evening - soft blue
  'rgba(140, 180, 220, 1)',    // 18: sunset begins - cool blue
  'rgba(120, 140, 200, 1)',    // 19: sunset - muted blue
  'rgba(100, 120, 180, 0.9)',  // 20: dusk - cool blue/purple
  'rgba(100, 50, 120, 0.9)',   // 21: twilight - deep purple
  'rgba(50, 30, 80, 0.9)',     // 22: late twilight - dark purple
  'rgba(20, 20, 60, 0.9)',     // 23: night - deep blue
];
