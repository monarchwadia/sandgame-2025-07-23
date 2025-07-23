// src/renderBoard.ts
// No-op render function for sand game board

import type { GameState } from './GameState';

export function renderBoard(target: HTMLCanvasElement, gl: WebGLRenderingContext, gameState: GameState): void {
  // Render grid to canvas with desert night colors
  const canvas = target.querySelector('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { grid, width, height } = gameState;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Colors
  const nightPurple = [44, 20, 60]; // cool night purple (RGB)
  const warmYellow = [255, 220, 80]; // warm desert yellow (RGB)

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const isSand = grid[i] === 1;
    const color = isSand ? warmYellow : nightPurple;
    data[idx] = color[0];     // R
    data[idx + 1] = color[1]; // G
    data[idx + 2] = color[2]; // B
    data[idx + 3] = 255;      // A
  }

  ctx.putImageData(imageData, 0, 0);
}
