// src/renderBoard.ts
// No-op render function for sand game board

import type { GameState } from './GameState';
import { CELL_WIDTH, CELL_HEIGHT } from './constants';
import { particlesRegistry } from './particles/particlesRegistry';

// create offscreen canvas for rendering
let imageData: ImageData;

// Helper function to convert hex/rgba color to RGBA values
function parseColor(color: string): [number, number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b, 255];
  } else if (color.startsWith('rgba')) {
    const values = color.match(/[\d.]+/g);
    if (values && values.length >= 4) {
      return [
        parseInt(values[0]),
        parseInt(values[1]),
        parseInt(values[2]),
        Math.floor(parseFloat(values[3]) * 255)
      ];
    }
  } else if (color.startsWith('rgb')) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      return [parseInt(values[0]), parseInt(values[1]), parseInt(values[2]), 255];
    }
  }
  // Default to white if parsing fails
  return [255, 255, 255, 255];
}

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
  if (!imageData || imageData.width !== canvas.width || imageData.height !== canvas.height) {
    imageData = ctx.createImageData(canvas.width, canvas.height);
  }

  const { grid, width, height } = gameState;
  const data = imageData.data;
  
  // Clear the image data
  data.fill(0);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const particleType = grid[y * width + x];
      const color = particlesRegistry[particleType].color;
      const resolvedColor = typeof color === 'function' ? color(gameState) : color;
      const [r, g, b, a] = parseColor(resolvedColor);
      
      // Fill the cell area with the particle color
      for (let dy = 0; dy < CELL_HEIGHT; dy++) {
        for (let dx = 0; dx < CELL_WIDTH; dx++) {
          const pixelX = Math.floor(x * CELL_WIDTH + dx);
          const pixelY = Math.floor(y * CELL_HEIGHT + dy);
          
          if (pixelX < canvas.width && pixelY < canvas.height) {
            const pixelIndex = (pixelY * canvas.width + pixelX) * 4;
            data[pixelIndex] = r;     // Red
            data[pixelIndex + 1] = g; // Green
            data[pixelIndex + 2] = b; // Blue
            data[pixelIndex + 3] = a; // Alpha
          }
        }
      }
    }
  }

  // Put the image data directly to the main canvas
  ctx.putImageData(imageData, 0, 0);
}