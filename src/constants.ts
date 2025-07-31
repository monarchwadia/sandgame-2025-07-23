// src/constants.ts
// Shared constants for the sandgame project

export const GRID_WIDTH = 150;
export const GRID_HEIGHT = 150;
export const FPS = 60; // Frames per second for the game loop
export const CELL_WIDTH = window.innerWidth / GRID_WIDTH;
export const CELL_HEIGHT = window.innerHeight / GRID_HEIGHT;
export const HOUR_INDEXES = {
    photosynthesis: [8, 18], // hours when sunlight is present, inclusive
    highHeat: [12, 15], // hours when heat is high, inclusive
    lowHeat: [0, 6], // hours when heat is low, inclusive
}
