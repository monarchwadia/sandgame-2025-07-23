// src/renderBoard.ts
// No-op render function for sand game board

import type { GameState } from './GameState';
import { COLORS, CELL_WIDTH, CELL_HEIGHT } from './constants';

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
  const { grid, width, height } = gameState;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const cellType = grid[i];
      const color = COLORS[cellType] || COLORS[0];
      ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]/255})`;
      ctx.fillRect(x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    }
  }
}
