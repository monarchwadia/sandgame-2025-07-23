
import type { GameState } from './GameState';
import { particlesRegistry } from './particles/particlesRegistry';
import { UiState } from './UIState';
import { tools } from './tools';

let imageData: ImageData;

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
  // Setup mouse listeners for continuous placement
  // Define control areas and game area layout - overlay takes no permanent space
  const gameAreaSize = Math.min(canvas.width, canvas.height);
  
  // Center the game area (now full square since overlay doesn't take permanent space)
  const gameOffsetX = (canvas.width - gameAreaSize) / 2;
  const gameOffsetY = (canvas.height - gameAreaSize) / 2;
  
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

  // Draw toggle button in top-left corner
  const toggleButtonSize = 40;
  const toggleMargin = 16;
  
  // Toggle button background
  ctx.fillStyle = UiState.isOverlayOpen ? 'rgba(60, 60, 60, 0.9)' : 'rgba(40, 40, 40, 0.9)';
  ctx.fillRect(toggleMargin, toggleMargin, toggleButtonSize, toggleButtonSize);
  
  // Toggle button border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(toggleMargin, toggleMargin, toggleButtonSize, toggleButtonSize);
  
  // Toggle button icon (hamburger menu or X)
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  if (UiState.isOverlayOpen) {
    // Draw X
    ctx.beginPath();
    ctx.moveTo(toggleMargin + 12, toggleMargin + 12);
    ctx.lineTo(toggleMargin + 28, toggleMargin + 28);
    ctx.moveTo(toggleMargin + 28, toggleMargin + 12);
    ctx.lineTo(toggleMargin + 12, toggleMargin + 28);
    ctx.stroke();
  } else {
    // Draw hamburger menu
    ctx.beginPath();
    ctx.moveTo(toggleMargin + 10, toggleMargin + 14);
    ctx.lineTo(toggleMargin + 30, toggleMargin + 14);
    ctx.moveTo(toggleMargin + 10, toggleMargin + 20);
    ctx.lineTo(toggleMargin + 30, toggleMargin + 20);
    ctx.moveTo(toggleMargin + 10, toggleMargin + 26);
    ctx.lineTo(toggleMargin + 30, toggleMargin + 26);
    ctx.stroke();
  }

  // Draw overlay panel if open
  if (UiState.isOverlayOpen) {
    // Overlay dimensions and position - more responsive
    const overlayWidth = Math.min(280, canvas.width * 0.85);
    const overlayHeight = Math.min(350, canvas.height * 0.8);
    const overlayX = (canvas.width - overlayWidth) / 2;
    const overlayY = (canvas.height - overlayHeight) / 2;
    
    // Overlay background
    ctx.fillStyle = 'rgba(30, 30, 30, 0.95)';
    ctx.fillRect(overlayX, overlayY, overlayWidth, overlayHeight);
    
    // Overlay border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(overlayX, overlayY, overlayWidth, overlayHeight);
    
    // Title - smaller and more responsive
    const titleFontSize = Math.max(12, Math.min(18, overlayWidth / 18));
    ctx.font = `bold ${titleFontSize}px monospace`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('TOOLS', overlayX + overlayWidth / 2, overlayY + 25);
    
    // Tool buttons - more compact layout
    const buttonMargin = Math.max(12, overlayWidth / 20);
    const buttonStartY = overlayY + 45;
    const buttonHeight = Math.max(25, Math.min(35, overlayHeight / 18));
    const buttonFontSize = Math.max(10, Math.min(14, overlayWidth / 22));
    
    ctx.font = `bold ${buttonFontSize}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      const isSelected = tool.idx === UiState.selectedTool;
      const buttonY = buttonStartY + i * (buttonHeight + 10);
      const buttonX = overlayX + buttonMargin;
      const buttonWidth = overlayWidth - buttonMargin * 2;
      
      // Button background
      ctx.fillStyle = isSelected ? 'rgba(80, 80, 80, 0.8)' : 'rgba(50, 50, 50, 0.6)';
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
      // Button border
      ctx.strokeStyle = isSelected ? tool.color : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
      // Button text
      ctx.fillStyle = tool.color;
      ctx.fillText(tool.name, buttonX + 15, buttonY + buttonHeight / 2);
    }
    
    // Brush size controls in overlay - always show, more compact
    const sizeControlY = buttonStartY + tools.length * (buttonHeight + 8) + 15;
    
    ctx.fillStyle = 'white';
    const sizeFontSize = Math.max(9, Math.min(14, overlayWidth / 25));
    ctx.font = `bold ${sizeFontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('SIZE', overlayX + overlayWidth / 2, sizeControlY);
    
    const sizeButtonY = sizeControlY + 20;
    const sizeButtonSize = Math.max(20, Math.min(30, overlayWidth / 15));
    const sizeControlCenterX = overlayX + overlayWidth / 2;
    const buttonSpacing = Math.max(25, overlayWidth / 10);
    
    // Minus button
    ctx.fillStyle = '#666';
    ctx.fillRect(sizeControlCenterX - buttonSpacing, sizeButtonY, sizeButtonSize, sizeButtonSize);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.strokeRect(sizeControlCenterX - buttonSpacing, sizeButtonY, sizeButtonSize, sizeButtonSize);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('-', sizeControlCenterX - buttonSpacing + sizeButtonSize / 2, sizeButtonY + sizeButtonSize / 2);
    
    // Size display
    ctx.fillStyle = 'white';
    ctx.fillText(UiState.brushSize.toString(), sizeControlCenterX, sizeButtonY + sizeButtonSize / 2);
    
    // Plus button
    ctx.fillStyle = '#666';
    ctx.fillRect(sizeControlCenterX + buttonSpacing - sizeButtonSize, sizeButtonY, sizeButtonSize, sizeButtonSize);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    ctx.strokeRect(sizeControlCenterX + buttonSpacing - sizeButtonSize, sizeButtonY, sizeButtonSize, sizeButtonSize);
    ctx.fillStyle = 'white';
    ctx.fillText('+', sizeControlCenterX + buttonSpacing - sizeButtonSize + sizeButtonSize / 2, sizeButtonY + sizeButtonSize / 2);
  }
}
