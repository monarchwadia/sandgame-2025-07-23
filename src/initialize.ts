// src/WebGLCanvas.ts
// Higher-order component for fullscreen WebGL canvas with empty render loop

import { FPS } from './constants';
import type { GameState } from './GameState';
import { SAND_IDX } from './particles/sand.particle';
import { SKY_IDX } from './particles/sky.particle';
import { WATER_IDX } from './particles/water.particle';
import { renderBoard } from './renderBoard';
import { updateGameState } from './updateGameState';
import { maybeSpawnHumans } from './environment/maybeSpawnHumansProcess';

export function initialize(target: HTMLElement, gameState: GameState) {
  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.background = 'black';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  target.appendChild(canvas);

  for (let i = 0; i < gameState.grid.length; i++) {
    // initialize with random sand
    const randomint = Math.random();
    gameState.grid[i] = randomint < 0.2 ? SAND_IDX : SKY_IDX;

    // for top row, add ranodm water
    if (i < gameState.width) {
      gameState.grid[i] = randomint < 0.1 ? WATER_IDX : gameState.grid[i]; // 2 = water
    }
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
    maybeSpawnHumans(gameState);
    setTimeout(updateLoop, 1000 / FPS);
  }
  updateLoop();
}
