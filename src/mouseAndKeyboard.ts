import type { GameState } from "./GameState";
import { tools } from "./tools";
import { UiState } from "./UIState";

// Function to handle tool selection clicks
export function handleToolClick(
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): boolean {
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
  if (
    x >= leftControlX &&
    x <= leftControlX + 20 &&
    y >= leftControlY + 30 &&
    y <= leftControlY + 50
  ) {
    if (UiState.brushSize > 1) UiState.brushSize--;
    return true;
  }

  // Plus button
  if (
    x >= leftControlX + 50 &&
    x <= leftControlX + 70 &&
    y >= leftControlY + 30 &&
    y <= leftControlY + 50
  ) {
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
      x >= textX &&
      x <= textX + textWidth &&
      y >= textY &&
      y <= textY + textHeight
    ) {
      UiState.selectedTool = tools[i].idx;
      return true; // Click handled
    }
  }

  return false; // Click not handled
}

// Function to handle particle placement clicks
export function handleGameClick(
  canvas: HTMLCanvasElement,
  gameState: GameState,
  x: number,
  y: number
): boolean {
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
  if (
    x < gameOffsetX ||
    x > gameOffsetX + gameAreaSize ||
    y < gameOffsetY ||
    y > gameOffsetY + gameAreaSize
  ) {
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
  if (
    gridX >= 0 &&
    gridX < gameState.width &&
    gridY >= 0 &&
    gridY < gameState.height
  ) {
    // Apply brush with radius
    for (let dy = -UiState.brushSize + 1; dy < UiState.brushSize; dy++) {
      for (let dx = -UiState.brushSize + 1; dx < UiState.brushSize; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < UiState.brushSize) {
          const targetX = gridX + dx;
          const targetY = gridY + dy;
          if (
            targetX >= 0 &&
            targetX < gameState.width &&
            targetY >= 0 &&
            targetY < gameState.height
          ) {
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
    if (UiState.lastCanvas && UiState.lastGameState) {
      handleGameClick(
        UiState.lastCanvas,
        UiState.lastGameState,
        UiState.lastMouseX,
        UiState.lastMouseY
      );
    }
  }, 1); // Place particles every 50ms while holding
}

function onMouseUp() {
  UiState.isMouseDown = false;
  if (UiState.holdInterval) {
    clearInterval(UiState.holdInterval);
    UiState.holdInterval = null;
  }
}

function onMouseMove(e: MouseEvent) {
  if (!UiState.lastCanvas || !UiState.lastGameState)
    return;

  if (!UiState.isMouseDown) return; // Only update position if mouse is down

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

// Add click event listener for tool selection and particle placement

function onClick(event: MouseEvent) {
  if (!UiState.lastCanvas || !UiState.lastGameState)
    return;

  const rect = UiState.lastCanvas.getBoundingClientRect();
  const scaleX = UiState.lastCanvas.width / rect.width;
  const scaleY = UiState.lastCanvas.height / rect.height;

  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  // Try tool selection first, then game placement
  if (!handleToolClick(UiState.lastCanvas, x, y)) {
    handleGameClick(UiState.lastCanvas, UiState.lastGameState, x, y);
  }
}

function onTouchStart(event: TouchEvent) {
  if (!UiState.lastCanvas || !UiState.lastGameState)
    return;
  event.preventDefault();
  const rect = UiState.lastCanvas.getBoundingClientRect();
  const touch = event.touches[0];
  const scaleX = UiState.lastCanvas.width / rect.width;
  const scaleY = UiState.lastCanvas.height / rect.height;

  const x = (touch.clientX - rect.left) * scaleX;
  const y = (touch.clientY - rect.top) * scaleY;

  // Try tool selection first, then game placement
  if (!handleToolClick(UiState.lastCanvas, x, y)) {
    handleGameClick(UiState.lastCanvas, UiState.lastGameState, x, y);
  }
}

// Add touch event listener for mobile

export function setupMouseAndKeyboard(
  canvas: HTMLCanvasElement,
  gameState: GameState
) {
  UiState.lastCanvas = canvas;
  UiState.lastGameState = gameState;
  // Only add listeners once
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("touchstart", onTouchStart);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);
}
