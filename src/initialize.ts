// src/WebGLCanvas.ts
// Higher-order component for fullscreen WebGL canvas with empty render loop

import { FPS, TICKS_TO_RENDER_RATIO } from './constants';
import type { GameState } from './GameState';
import { SAND_IDX } from './particles/sand.particle';
import { SKY_IDX } from './particles/sky.particle';
import { WATER_IDX } from './particles/water.particle';
import { renderBoard } from './renderBoard';
import { updateGameState } from './updateGameState';
import { maybeSpawnHumans } from './environment/maybeSpawnHumansProcess';
import { getRandom } from './randomseed';
import { handleToolClick, handleGameClick } from './renderBoard';

let renderCounter = 0;

export function initialize(target: HTMLElement, gameState: GameState) {
  // Canvas setup - make it square using the smaller screen dimension
  const canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.background = 'black';
  canvas.style.margin = '0 auto'; // Center horizontally
  
  // Make canvas square using smaller dimension
  const size = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
  
  target.appendChild(canvas);

  for (let i = 0; i < gameState.grid.length; i++) {
    // initialize with random sand
    const randomint = getRandom();
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

  // Add click event listener for tool selection and particle placement
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    // Try tool selection first, then game placement
    if (!handleToolClick(canvas, x, y)) {
      handleGameClick(canvas, gameState, x, y);
    }
  });

  // Add touch event listener for mobile
  canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    
    // Try tool selection first, then game placement
    if (!handleToolClick(canvas, x, y)) {
      handleGameClick(canvas, gameState, x, y);
    }
  });

  let lastUpdate = performance.now();
  let accumulator = 0;
  const targetDelta = 1000 / FPS;

  function mainLoop() {
    const now = performance.now();
    accumulator += now - lastUpdate;
    lastUpdate = now;

    // Run fixed-timestep simulation steps to catch up
    let maxSteps = 10;
    while (accumulator >= targetDelta) {
      maxSteps--;
      if (maxSteps < 0) {
        // Prevent infinite loop
        break;
      }
      updateGameState(gameState);
      maybeSpawnHumans(gameState);
      accumulator -= targetDelta;
    }

    renderCounter++;
    if (renderCounter >= TICKS_TO_RENDER_RATIO) {
      renderCounter = 0;
      // Slow down the simulation every few ticks
      renderBoard(canvas, ctx, gameState);
    }
    requestAnimationFrame(mainLoop);
  }
  requestAnimationFrame(mainLoop);
}
