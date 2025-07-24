// src/renderBoard.ts
// No-op render function for sand game board

import type { GameState } from './GameState';
import { CELL_WIDTH, CELL_HEIGHT } from './constants';
import { particlesRegistry } from './particles/particlesRegistry';

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
  const { grid, width, height } = gameState;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = particlesRegistry[grid[y * width + x]].color;
      ctx.fillStyle = typeof color === 'function' ? color(gameState) : color;
      ctx.strokeStyle = ctx.fillStyle; // Use fill color for stroke
      ctx.fillRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
      ctx.strokeRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT); // Draw stroke around each cell
    }
  }
}
