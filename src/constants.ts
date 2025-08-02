// src/constants.ts
// Shared constants for the sandgame project

export const GRID_WIDTH = 400;
export const GRID_HEIGHT = 400;
export const FPS = 60; // Frames per second for the game loop
export const TICKS_TO_RENDER_RATIO = 2; // How many simulation ticks per render frame. This is an optimization to reduce rendering load.
export const CELL_WIDTH = window.innerWidth / GRID_WIDTH;
export const CELL_HEIGHT = window.innerHeight / GRID_HEIGHT;
export const HOUR_INDEXES = {
    photosynthesis: [8, 18], // hours when sunlight is present, inclusive
    highHeat: [12, 15], // hours when heat is high, inclusive
    lowHeat: [0, 6], // hours when heat is low, inclusive
}
