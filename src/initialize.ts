// src/WebGLCanvas.ts
// Higher-order component for fullscreen WebGL canvas with empty render loop

import type { GameState } from './GameState';
import { renderBoard } from './renderBoard';
import { updateGameState } from './updateGameState';

export function initialize(target: HTMLElement, gameState: GameState) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '999';
  canvas.style.display = 'block';
  canvas.style.background = 'black';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  target.appendChild(canvas);

  // initialize with random sand
  for (let i = 0; i < gameState.grid.length; i++) {
    gameState.grid[i] = Math.random() < 0.2 ? 1 : 0;
  }

  const ctx = canvas.getContext('2d')!;
  // check
  if (!ctx) {
    alert('Canvas 2D context not supported');
    return;
  }

  function renderLoop() {
    renderBoard(canvas, ctx, gameState);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  function updateLoop() {
    updateGameState(gameState);
    setTimeout(updateLoop, 1000 / 60);
  }
  updateLoop();
}
