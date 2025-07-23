// src/WebGLCanvas.ts
// Higher-order component for fullscreen WebGL canvas with empty render loop

import type { GameState } from './GameState';
import { renderBoard } from './renderBoard';

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

  const gl: WebGLRenderingContext  = canvas.getContext('webgl')!;
  // Check if WebGL is supported
  if (!gl) {
    alert('WebGL not supported');
    return;
  }
  
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  function renderLoop() {
    // Use renderBoard for rendering
    renderBoard(canvas, gl, gameState);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}
