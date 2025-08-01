// src/renderBoard.ts
// No-op render function for sand game board

import type { GameState } from './GameState';
import { CELL_WIDTH, CELL_HEIGHT } from './constants';
import { particlesRegistry } from './particles/particlesRegistry';

// create offscreen canvas for rendering
let imageData: ImageData;

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
  if (!imageData || imageData.width !== canvas.width || imageData.height !== canvas.height) {
    imageData = ctx.createImageData(canvas.width, canvas.height);
  }

  const { width, height } = gameState;
  const data = imageData.data;
  
  // Clear the image data
  // data.fill(0);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const particleType = gameState.grid[y * width + x];
      const color = particlesRegistry[particleType].color;
      const resolvedColor = typeof color === 'function' ? color(gameState) : color;
      const [r, g, b, a] = resolvedColor;
      
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