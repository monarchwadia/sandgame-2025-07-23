import type { GameState } from "./GameState";
import { SPEED_LEVELS } from "./simSpeed";
import { tools } from "./tools";
import { UiState } from "./UIState";

// Function to handle tool selection clicks
export function handleToolClick(
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): boolean {
  // Check toggle button (top-left)
  const toggleButtonSize = 40;
  const toggleMargin = 16;
  
  if (
    x >= toggleMargin &&
    x <= toggleMargin + toggleButtonSize &&
    y >= toggleMargin &&
    y <= toggleMargin + toggleButtonSize
  ) {
    UiState.isOverlayOpen = !UiState.isOverlayOpen;
    return true;
  }

  // If overlay is not open, no other controls to handle
  if (!UiState.isOverlayOpen) return false;

  // Check overlay controls
  const overlayWidth = Math.min(280, canvas.width * 0.85);
  const overlayHeight = Math.min(350, canvas.height * 0.8);
  const overlayX = (canvas.width - overlayWidth) / 2;
  const overlayY = (canvas.height - overlayHeight) / 2;
  
  // Check if click is outside overlay - close it
  if (x < overlayX || x > overlayX + overlayWidth || 
      y < overlayY || y > overlayY + overlayHeight) {
    UiState.isOverlayOpen = false;
    return true;
  }

  // Tool buttons
  const buttonMargin = Math.max(12, overlayWidth / 20);
  const buttonStartY = overlayY + 45;
  const buttonHeight = Math.max(25, Math.min(35, overlayHeight / 18));
  const buttonX = overlayX + buttonMargin;
  const buttonWidth = overlayWidth - buttonMargin * 2;

  for (let i = 0; i < tools.length; i++) {
    const buttonY = buttonStartY + i * (buttonHeight + 8);
    
    if (
      x >= buttonX &&
      x <= buttonX + buttonWidth &&
      y >= buttonY &&
      y <= buttonY + buttonHeight
    ) {
      UiState.selectedTool = tools[i].idx;
      return true;
    }
  }

  // Brush size controls - always handle them
  const sizeControlY = buttonStartY + tools.length * (buttonHeight + 8) + 15;
  const sizeButtonY = sizeControlY + 20;
  const sizeButtonSize = Math.max(20, Math.min(30, overlayWidth / 15));
  const sizeControlCenterX = overlayX + overlayWidth / 2;
  const buttonSpacing = Math.max(25, overlayWidth / 10);
  // Speed controls geometry
  const speedControlY = sizeButtonY + sizeButtonSize + 35;
  const speedButtonY = speedControlY + 20;
  const speedButtonSize = sizeButtonSize;
  const speedControlCenterX = sizeControlCenterX;

  // Minus button
  if (
    x >= sizeControlCenterX - buttonSpacing &&
    x <= sizeControlCenterX - buttonSpacing + sizeButtonSize &&
    y >= sizeButtonY &&
    y <= sizeButtonY + sizeButtonSize
  ) {
    if (UiState.brushSize > 1) UiState.brushSize--;
    return true;
  }

  // Plus button
  if (
    x >= sizeControlCenterX + buttonSpacing - sizeButtonSize &&
    x <= sizeControlCenterX + buttonSpacing - sizeButtonSize + sizeButtonSize &&
    y >= sizeButtonY &&
    y <= sizeButtonY + sizeButtonSize
  ) {
    if (UiState.brushSize < 10) UiState.brushSize++;
    return true;
  }

  // Speed controls (reuse +/- layout below)
  if (
    x >= speedControlCenterX - buttonSpacing &&
    x <= speedControlCenterX - buttonSpacing + speedButtonSize &&
    y >= speedButtonY &&
    y <= speedButtonY + speedButtonSize
  ) {
    if (UiState.simSpeedIndex > 0) UiState.simSpeedIndex--;
    return true;
  }
  if (
    x >= speedControlCenterX + buttonSpacing - speedButtonSize &&
    x <= speedControlCenterX + buttonSpacing &&
    y >= speedButtonY &&
    y <= speedButtonY + speedButtonSize
  ) {
    if (UiState.simSpeedIndex < SPEED_LEVELS.length - 1) UiState.simSpeedIndex++;
    return true;
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
  // If overlay is open and click is in overlay area, don't place particles
  if (UiState.isOverlayOpen) {
    const overlayWidth = Math.min(280, canvas.width * 0.85);
    const overlayHeight = Math.min(350, canvas.height * 0.8);
    const overlayX = (canvas.width - overlayWidth) / 2;
    const overlayY = (canvas.height - overlayHeight) / 2;
    
    if (x >= overlayX && x <= overlayX + overlayWidth && 
        y >= overlayY && y <= overlayY + overlayHeight) {
      return false; // Don't place particles in overlay area
    }
  }

  // Calculate game area bounds (now full square since no bottom panel)
  const gameAreaSize = Math.min(canvas.width, canvas.height);
  const gameOffsetX = (canvas.width - gameAreaSize) / 2;
  const gameOffsetY = (canvas.height - gameAreaSize) / 2;

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

function preventContextMenu(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  return false;
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
  event.preventDefault();
  event.stopPropagation();
  if (!UiState.lastCanvas || !UiState.lastGameState)
    return;
  UiState.isMouseDown = true; // Treat touch start as mouse down
  const rect = UiState.lastCanvas.getBoundingClientRect();
  const touch = event.touches[0];
  const scaleX = UiState.lastCanvas.width / rect.width;
  const scaleY = UiState.lastCanvas.height / rect.height;

  const x = (touch.clientX - rect.left) * scaleX;
  const y = (touch.clientY - rect.top) * scaleY;
  
  // Update last position for the interval to use
  UiState.lastMouseX = x;
  UiState.lastMouseY = y;

  // Try tool selection first, then game placement
  if (!handleToolClick(UiState.lastCanvas, x, y)) {
    handleGameClick(UiState.lastCanvas, UiState.lastGameState, x, y);
  }

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
  }, 1); // Place particles every 1ms while holding
}

function onTouchMove(event: TouchEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (!UiState.lastCanvas || !UiState.lastGameState) return;

  if (!UiState.isMouseDown) return; // Only update position if touch is active

  const rect = UiState.lastCanvas.getBoundingClientRect();
  const touch = event.touches[0];
  const scaleX = UiState.lastCanvas.width / rect.width;
  const scaleY = UiState.lastCanvas.height / rect.height;
  const x = (touch.clientX - rect.left) * scaleX;
  const y = (touch.clientY - rect.top) * scaleY;
  
  // Update last position for the interval to use
  UiState.lastMouseX = x;
  UiState.lastMouseY = y;
  
  handleGameClick(UiState.lastCanvas, UiState.lastGameState, x, y);
}

function onTouchEnd(event: TouchEvent) {
  // No-op for now, but could be used to clean up state if needed
  event.preventDefault();
  event.stopPropagation();
  UiState.isMouseDown = false;
  if (UiState.holdInterval) {
    clearInterval(UiState.holdInterval);
    UiState.holdInterval = null;
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
  canvas.addEventListener("touchmove", onTouchMove);
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("contextmenu", preventContextMenu);
}
