// src/renderBoard.ts
// No-op render function for sand game board

import type { GameState } from './GameState';
import { CELL_WIDTH } from './constants';
import { particlesRegistry } from './particles/particlesRegistry';
import { SAND_IDX } from './particles/sand.particle';
import { FIRE_IDX } from './particles/fire.particle';
import { LIGHTNING_IDX } from './particles/lightning.particle';
import { WATER_IDX } from './particles/water.particle';
import { HUMAN_IDX } from './particles/human.particle';

// create offscreen canvas for rendering
let imageData: ImageData;

// Tool selection state
let selectedTool = SAND_IDX;
const tools = [SAND_IDX, FIRE_IDX, LIGHTNING_IDX, WATER_IDX, HUMAN_IDX];
const toolNames = ['SAND', 'FIRE', 'BOLT', 'WATER', 'HUMAN'];

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
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
  
  // Draw control buttons in the panel
  const buttonSize = 100;
  const buttonSpacing = 120;
  const startX = (canvas.width - (buttonSpacing * 4)) / 2; // Center 5 buttons
  const buttonY = panelY + (ctrlPanelHeight - buttonSize) / 2;
  
  // Draw 5 control buttons
  for (let i = 0; i < 5; i++) {
    const buttonX = startX + i * buttonSpacing;
    const isSelected = tools[i] === selectedTool;
    
    // Button background - highlight if selected
    ctx.fillStyle = isSelected ? 'rgba(100, 200, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = isSelected ? 'rgba(0, 100, 200, 0.8)' : 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = isSelected ? 3 : 2;
    
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonSize, buttonSize, 8);
    ctx.fill();
    ctx.stroke();
    
    // Button label
    ctx.fillStyle = isSelected ? 'white' : 'black';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(toolNames[i], buttonX + buttonSize / 2, buttonY + buttonSize / 2 + 5);
  }
}

// Function to handle tool selection clicks
export function handleToolClick(canvas: HTMLCanvasElement, x: number, y: number): boolean {
  const ctrlPanelHeight = 200;
  const panelY = canvas.height - ctrlPanelHeight;
  
  // Check if click is in control panel
  if (y < panelY) return false;
  
  const buttonSize = 100;
  const buttonSpacing = 120;
  const startX = (canvas.width - (buttonSpacing * 4)) / 2;
  const buttonY = panelY + (ctrlPanelHeight - buttonSize) / 2;
  
  // Check each button
  for (let i = 0; i < 5; i++) {
    const buttonX = startX + i * buttonSpacing;
    
    if (x >= buttonX && x <= buttonX + buttonSize && 
        y >= buttonY && y <= buttonY + buttonSize) {
      selectedTool = tools[i];
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
    const index = gridY * gameState.width + gridX;
    gameState.grid[index] = selectedTool;
    return true; // Click handled
  }
  
  return false; // Click not handled
}

// Function to get current selected tool
export function getSelectedTool(): number {
  return selectedTool;
}