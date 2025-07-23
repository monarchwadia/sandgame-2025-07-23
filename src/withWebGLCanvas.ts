// src/WebGLCanvas.ts
// Higher-order component for fullscreen WebGL canvas with empty render loop

import type { GameState } from './types';

export function withWebGLCanvas(target: HTMLElement, gameState: GameState) {
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

  const gl = canvas.getContext('webgl');
  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  });

  function renderLoop() {
    // Empty render loop
    // gameState can be used here
    if (gl) {
      // Future rendering code goes here
    }
    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  return { canvas, gl };
}
