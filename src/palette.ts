// Color palette for the sandgame project
// All colors are defined as RGBA strings

// Particle colors
export const SAND_COLOR = 'rgba(255, 220, 80, 1)'; // warm yellow
export const WATER_COLOR = 'rgba(80, 180, 255, 0.8)'; // blue, semi-transparent

// Sky colors for each hour (0-23) with smooth day/night transitions
export const SKY_COLORS = [
  'rgba(20, 15, 45, 0.9)',   // 0: midnight - deep night
  'rgba(25, 18, 50, 0.9)',   // 1: late night
  'rgba(30, 20, 55, 0.8)',   // 2: very early morning
  'rgba(35, 25, 60, 0.8)',   // 3: pre-dawn
  'rgba(60, 40, 80, 0.8)',   // 4: dawn begins
  'rgba(120, 80, 140, 1)',   // 5: dawn - purple
  'rgba(180, 120, 200, 1)',  // 6: sunrise - pink/purple
  'rgba(220, 160, 240, 1)',  // 7: early morning - light purple
  'rgba(200, 220, 240, 1)',  // 8: morning - light blue
  'rgba(160, 200, 220, 1)',  // 9: late morning
  'rgba(140, 180, 240, 1)',  // 10: mid-morning
  'rgba(120, 170, 255, 1)',  // 11: late morning
  'rgba(100, 160, 255, 1)',  // 12: noon - bright blue
  'rgba(110, 170, 255, 1)',  // 13: early afternoon
  'rgba(120, 180, 250, 1)',  // 14: afternoon
  'rgba(140, 190, 240, 1)',  // 15: mid-afternoon
  'rgba(160, 180, 220, 1)',  // 16: late afternoon - soft blue
  'rgba(240, 160, 200, 1)',  // 17: early evening - pink
  'rgba(255, 140, 180, 1)',  // 18: sunset begins - pink/red
  'rgba(255, 120, 160, 1)',  // 19: sunset - vibrant pink
  'rgba(200, 100, 160, 0.9)', // 20: dusk - purple/pink
  'rgba(120, 60, 120, 0.9)',  // 21: twilight - purple
  'rgba(60, 30, 80, 0.9)',    // 22: late twilight - deep purple
  'rgba(35, 20, 60, 0.9)',    // 23: night - purple
];
