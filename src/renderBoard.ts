
import type { GameState } from './GameState';
import { particlesRegistry } from './particles/particlesRegistry';
import { UiState } from './UIState';
import { tools } from './tools';

// --- Mouse hold support for continuous placement ---


// Function to handle tool selection clicks
export function handleToolClick(canvas: HTMLCanvasElement, x: number, y: number): boolean {
  const ctrlPanelHeight = 200;
  const panelY = canvas.height - ctrlPanelHeight;
  
  // Check size controls in left black space (these are NOT in the control panel)
  const availableHeight = canvas.height - ctrlPanelHeight;
  const gameAreaSize = Math.min(canvas.width, availableHeight);
  const gameOffsetX = (canvas.width - gameAreaSize) / 2;
  const gameOffsetY = (availableHeight - gameAreaSize) / 2;
  const leftControlX = Math.max(16, gameOffsetX - 120);
  const leftControlY = gameOffsetY + 50;
  
  // Minus button
  if (x >= leftControlX && x <= leftControlX + 20 && 
      y >= leftControlY + 30 && y <= leftControlY + 50) {
    if (UiState.brushSize > 1) UiState.brushSize--;
    return true;
  }
  
  // Plus button  
  if (x >= leftControlX + 50 && x <= leftControlX + 70 && 
      y >= leftControlY + 30 && y <= leftControlY + 50) {
    if (UiState.brushSize < 10) UiState.brushSize++;
    return true;
  }
  
  // Check if click is in control panel
  if (y < panelY) return false;
  
  const fontSize = 18;
  const buttonSpacing = 24;
  const numButtons = tools.length;
  const startX = 16;
  const buttonY = panelY + 24;

  // Check each button (text row)
  for (let i = 0; i < numButtons; i++) {
    const textX = startX;
    const textY = buttonY + i * buttonSpacing;
    const textWidth = 80; // generous hitbox width
    const textHeight = fontSize + 6;
    if (
      x >= textX && x <= textX + textWidth &&
      y >= textY && y <= textY + textHeight
    ) {
      UiState.selectedTool = tools[i].idx;
      return true; // Click handled
    }
  }
  
  return false; // Click not handled
}

// Function to handle particle placement clicks
export function handleGameClick(canvas: HTMLCanvasElement, gameState: GameState, x: number, y: number): boolean {
  const ctrlPanelHeight = 200;
  const panelY = canvas.height - ctrlPanelHeight;
  
  // Check if click is in game area
  if (y >= panelY) return false;
  
  // Calculate game area bounds (same as in renderBoard)
  const availableWidth = canvas.width;
  const availableHeight = canvas.height - ctrlPanelHeight;
  const gameAreaSize = Math.min(availableWidth, availableHeight);
  const gameOffsetX = (canvas.width - gameAreaSize) / 2;
  const gameOffsetY = (availableHeight - gameAreaSize) / 2;
  
  // Check if click is within game area
  if (x < gameOffsetX || x > gameOffsetX + gameAreaSize ||
      y < gameOffsetY || y > gameOffsetY + gameAreaSize) {
    return false;
  }
  
  // Convert canvas coordinates to grid coordinates
  const relativeX = x - gameOffsetX;
  const relativeY = y - gameOffsetY;
  
  // Calculate actual cell size based on game area, not constants
  const actualCellWidth = gameAreaSize / gameState.width;
  const actualCellHeight = gameAreaSize / gameState.height;
  
  const gridX = Math.floor(relativeX / actualCellWidth);
  const gridY = Math.floor(relativeY / actualCellHeight);
  
  // Ensure coordinates are within bounds
  if (gridX >= 0 && gridX < gameState.width && gridY >= 0 && gridY < gameState.height) {
    // Apply brush with radius
    for (let dy = -UiState.brushSize + 1; dy < UiState.brushSize; dy++) {
      for (let dx = -UiState.brushSize + 1; dx < UiState.brushSize; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < UiState.brushSize) {
          const targetX = gridX + dx;
          const targetY = gridY + dy;
          if (targetX >= 0 && targetX < gameState.width && 
              targetY >= 0 && targetY < gameState.height) {
            const index = targetY * gameState.width + targetX;
            gameState.grid[index] = UiState.selectedTool;
          }
        }
      }
    }
    return true; // Click handled
  }
  
  return false; // Click not handled
}

function onMouseDown(e: MouseEvent) {
  if (!UiState.lastCanvas || !UiState.lastGameState) return;
  const rect = UiState.lastCanvas.getBoundingClientRect();
  // Account for canvas scaling by converting from display coordinates to canvas coordinates
  const scaleX = UiState.lastCanvas.width / rect.width;
  const scaleY = UiState.lastCanvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  UiState.lastMouseX = x;
  UiState.lastMouseY = y;
  UiState.isMouseDown = true;
  handleGameClick(UiState.lastCanvas, UiState.lastGameState, x, y);
  
  // Start continuous placement interval for click and hold
  if (UiState.holdInterval) clearInterval(UiState.holdInterval);
  UiState.holdInterval = setInterval(() => {
    if (UiState.isMouseDown && UiState.lastCanvas && UiState.lastGameState) {
      handleGameClick(UiState.lastCanvas, UiState.lastGameState, UiState.lastMouseX, UiState.lastMouseY);
    }
  }, 50); // Place particles every 50ms while holding
}

function onMouseUp() {
  UiState.isMouseDown = false;
  if (UiState.holdInterval) {
    clearInterval(UiState.holdInterval);
    UiState.holdInterval = null;
  }
}

function onMouseMove(e: MouseEvent) {
  if (!UiState.isMouseDown || !UiState.lastCanvas || !UiState.lastGameState) return;
  const rect = UiState.lastCanvas.getBoundingClientRect();
  // Account for canvas scaling by converting from display coordinates to canvas coordinates
  const scaleX = UiState.lastCanvas.width / rect.width;
  const scaleY = UiState.lastCanvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  UiState.lastMouseX = x;
  UiState.lastMouseY = y;
  handleGameClick(UiState.lastCanvas, UiState.lastGameState, x, y);
}

function setupContinuousPlacement(canvas: HTMLCanvasElement, gameState: GameState) {
  UiState.lastCanvas = canvas;
  UiState.lastGameState = gameState;
  // Only add listeners once
  if (!(canvas as any)._continuousPlacementSetup) {
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    (canvas as any)._continuousPlacementSetup = true;
  }
}
// src/renderBoard.ts
// No-op render function for sand game board


// create offscreen canvas for rendering
let imageData: ImageData;

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
  // Setup mouse listeners for continuous placement
  setupContinuousPlacement(canvas, gameState);
  // Define control areas and game area layout
  const ctrlPanelHeight = 200; // Height of bottom control panel
  
  // Calculate square game area in top portion, leaving space for control panel
  const availableWidth = canvas.width;
  const availableHeight = canvas.height - ctrlPanelHeight;
  const gameAreaSize = Math.min(availableWidth, availableHeight);
  
  // Center the game area in the top portion
  const gameOffsetX = (canvas.width - gameAreaSize) / 2;
  const gameOffsetY = (availableHeight - gameAreaSize) / 2;
  
  // Create image data for the game area only
  if (!imageData || imageData.width !== gameAreaSize || imageData.height !== gameAreaSize) {
    imageData = ctx.createImageData(gameAreaSize, gameAreaSize);
  }

  const { width, height } = gameState;
  const data = imageData.data;
  
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Render game particles to image data
  const cellWidth = gameAreaSize / width;
  const cellHeight = gameAreaSize / height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const particleType = gameState.grid[y * width + x];
      const color = particlesRegistry[particleType].color;
      const resolvedColor = typeof color === 'function' ? color(gameState) : color;
      const [r, g, b, a] = resolvedColor;
      
      // Fill the cell area with the particle color
      for (let dy = 0; dy < cellHeight; dy++) {
        for (let dx = 0; dx < cellWidth; dx++) {
          const pixelX = Math.floor(x * cellWidth + dx);
          const pixelY = Math.floor(y * cellHeight + dy);
          
          if (pixelX < gameAreaSize && pixelY < gameAreaSize) {
            const pixelIndex = (pixelY * gameAreaSize + pixelX) * 4;
            data[pixelIndex] = r;     // Red
            data[pixelIndex + 1] = g; // Green
            data[pixelIndex + 2] = b; // Blue
            data[pixelIndex + 3] = a; // Alpha
          }
        }
      }
    }
  }

  // Put the game image data to the centered position
  ctx.putImageData(imageData, gameOffsetX, gameOffsetY);

  // Draw control panel at bottom
  const panelY = canvas.height - ctrlPanelHeight;
  
  // Panel background
  ctx.fillStyle = 'rgba(40, 40, 40, 0.9)';
  ctx.fillRect(0, panelY, canvas.width, ctrlPanelHeight);
  
  // Panel border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, panelY, canvas.width, ctrlPanelHeight);
  
  // Text-only control buttons
  const fontSize = 18;
  const buttonSpacing = 24;
  const numButtons = tools.length;
  const startX = 16; // left margin from panel
  const buttonY = panelY + 24; // top margin from panel

  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Left side controls in black space - Size control
  const leftControlX = Math.max(16, gameOffsetX - 120); // Position in left black space
  const leftControlY = gameOffsetY + 50; // Vertical position in game area
  
  ctx.fillStyle = 'white';
  ctx.fillText('SIZE', leftControlX, leftControlY);
  
  // Minus button
  ctx.fillStyle = '#aaa';
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 2;
  ctx.strokeRect(leftControlX, leftControlY + 30, 20, 20);
  ctx.fillText('-', leftControlX + 6, leftControlY + 34);
  
  // Size display
  ctx.fillStyle = 'white';
  ctx.fillText(UiState.brushSize.toString(), leftControlX + 30, leftControlY + 34);
  
  // Plus button
  ctx.fillStyle = '#aaa';
  ctx.strokeStyle = '#aaa';
  ctx.strokeRect(leftControlX + 50, leftControlY + 30, 20, 20);
  ctx.fillText('+', leftControlX + 56, leftControlY + 34);

  for (let i = 0; i < numButtons; i++) {
    const tool = tools[i];
    const isSelected = tool.idx === UiState.selectedTool;
    const textX = startX;
    const textY = buttonY + i * buttonSpacing;

    // Draw text label in palette color
    ctx.fillStyle = tool.color;
    ctx.fillText(tool.name, textX, textY);

    // Draw underline or box if selected
    if (isSelected) {
      const textWidth = ctx.measureText(tool.name).width;
      ctx.strokeStyle = tool.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(textX, textY + fontSize + 2);
      ctx.lineTo(textX + textWidth, textY + fontSize + 2);
      ctx.stroke();
    }
  }
}
