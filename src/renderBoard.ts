import type { GameState } from './GameState';
import { particlesRegistry } from './particles/particlesRegistry';
import { UiState } from './UIState';
import { tools } from './tools';
import { areParticlesEqual, getParticleId } from './utils';

// Cached ImageData for the square game area
let imageData: ImageData;

// --- Layout / Style constants ---
const TOGGLE_BTN_SIZE = 40;
const TOGGLE_BTN_MARGIN = 16;
const OVERLAY_MAX_W = 280;
const OVERLAY_MAX_H = 350;
const OVERLAY_W_RATIO = 0.85; // % of canvas width
const OVERLAY_H_RATIO = 0.8;  // % of canvas height

interface OverlayGeometry {
  x: number; y: number; width: number; height: number;
  buttonMargin: number; buttonStartY: number; buttonHeight: number; buttonFontSize: number;
  sizeControlY: number; sizeButtonY: number; sizeButtonSize: number; sizeControlCenterX: number; buttonSpacing: number;
}

// Compute square game area covering largest possible square inside canvas
function computeGameArea(canvas: HTMLCanvasElement) {
  const size = Math.min(canvas.width, canvas.height);
  return {
    size,
    offsetX: (canvas.width - size) / 2,
    offsetY: (canvas.height - size) / 2,
  };
}

function ensureImageData(ctx: CanvasRenderingContext2D, size: number) {
  if (!imageData || imageData.width !== size || imageData.height !== size) {
    imageData = ctx.createImageData(size, size);
  }
  return imageData;
}

function renderParticlesToImage(gameState: GameState, size: number) {
  const { width, height } = gameState;
  const id = imageData; // already ensured
  const data = id.data;
  const cellW = size / width;
  const cellH = size / height;

  // Fill pixels
  for (let gy = 0; gy < height; gy++) {
    for (let gx = 0; gx < width; gx++) {
      const particle = gameState.grid[gy * width + gx];
      const particleId = getParticleId(particle);
      const colorSpec = particlesRegistry[particleId].color;
      const [r, g, b, a] = (typeof colorSpec === 'function' ? colorSpec(gameState) : colorSpec);

      const startX = Math.floor(gx * cellW);
      const startY = Math.floor(gy * cellH);
      const endX = Math.min(size, Math.floor((gx + 1) * cellW));
      const endY = Math.min(size, Math.floor((gy + 1) * cellH));

      for (let py = startY; py < endY; py++) {
        let rowIndex = (py * size + startX) * 4;
        for (let px = startX; px < endX; px++) {
          data[rowIndex] = r;
            data[rowIndex + 1] = g;
            data[rowIndex + 2] = b;
            data[rowIndex + 3] = a;
          rowIndex += 4;
        }
      }
    }
  }
}

function drawToggleButton(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = UiState.isOverlayOpen ? 'rgba(60, 60, 60, 0.9)' : 'rgba(40, 40, 40, 0.9)';
  ctx.fillRect(TOGGLE_BTN_MARGIN, TOGGLE_BTN_MARGIN, TOGGLE_BTN_SIZE, TOGGLE_BTN_SIZE);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(TOGGLE_BTN_MARGIN, TOGGLE_BTN_MARGIN, TOGGLE_BTN_SIZE, TOGGLE_BTN_SIZE);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (UiState.isOverlayOpen) {
    // X
    ctx.moveTo(TOGGLE_BTN_MARGIN + 12, TOGGLE_BTN_MARGIN + 12);
    ctx.lineTo(TOGGLE_BTN_MARGIN + 28, TOGGLE_BTN_MARGIN + 28);
    ctx.moveTo(TOGGLE_BTN_MARGIN + 28, TOGGLE_BTN_MARGIN + 12);
    ctx.lineTo(TOGGLE_BTN_MARGIN + 12, TOGGLE_BTN_MARGIN + 28);
  } else {
    // Hamburger
    ctx.moveTo(TOGGLE_BTN_MARGIN + 10, TOGGLE_BTN_MARGIN + 14);
    ctx.lineTo(TOGGLE_BTN_MARGIN + 30, TOGGLE_BTN_MARGIN + 14);
    ctx.moveTo(TOGGLE_BTN_MARGIN + 10, TOGGLE_BTN_MARGIN + 20);
    ctx.lineTo(TOGGLE_BTN_MARGIN + 30, TOGGLE_BTN_MARGIN + 20);
    ctx.moveTo(TOGGLE_BTN_MARGIN + 10, TOGGLE_BTN_MARGIN + 26);
    ctx.lineTo(TOGGLE_BTN_MARGIN + 30, TOGGLE_BTN_MARGIN + 26);
  }
  ctx.stroke();
}

function computeOverlayGeometry(canvas: HTMLCanvasElement): OverlayGeometry {
  const width = Math.min(OVERLAY_MAX_W, canvas.width * OVERLAY_W_RATIO);
  const height = Math.min(OVERLAY_MAX_H, canvas.height * OVERLAY_H_RATIO);
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  const buttonMargin = Math.max(12, width / 20);
  const buttonStartY = y + 45;
  const buttonHeight = Math.max(25, Math.min(35, height / 18));
  const buttonFontSize = Math.max(10, Math.min(14, width / 22));
  const sizeControlY = buttonStartY + tools.length * (buttonHeight + 8) + 15;
  const sizeButtonY = sizeControlY + 20;
  const sizeButtonSize = Math.max(20, Math.min(30, width / 15));
  const sizeControlCenterX = x + width / 2;
  const buttonSpacing = Math.max(25, width / 10);

  return { x, y, width, height, buttonMargin, buttonStartY, buttonHeight, buttonFontSize, sizeControlY, sizeButtonY, sizeButtonSize, sizeControlCenterX, buttonSpacing };
}

function drawOverlay(ctx: CanvasRenderingContext2D, geom: OverlayGeometry) {
  const { x, y, width, height } = geom;
  // Background & border
  ctx.fillStyle = 'rgba(30, 30, 30, 0.95)';
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Title
  const titleFontSize = Math.max(12, Math.min(18, width / 18));
  ctx.font = `bold ${titleFontSize}px monospace`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('TOOLS', x + width / 2, y + 25);

  drawToolButtons(ctx, geom);
  drawBrushControls(ctx, geom);
}

function drawToolButtons(ctx: CanvasRenderingContext2D, geom: OverlayGeometry) {
  const { x, width, buttonMargin, buttonStartY, buttonHeight, buttonFontSize } = geom;
  ctx.font = `bold ${buttonFontSize}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const buttonX = x + buttonMargin;
  const buttonWidth = width - buttonMargin * 2;

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const isSelected = areParticlesEqual(tool.idx, UiState.selectedTool);
    const buttonY = buttonStartY + i * (buttonHeight + 10);

    // Background
    ctx.fillStyle = isSelected ? 'rgba(80, 80, 80, 0.8)' : 'rgba(50, 50, 50, 0.6)';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Border
    ctx.strokeStyle = isSelected ? tool.color : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = isSelected ? 3 : 1;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Label
    ctx.fillStyle = tool.color;
    ctx.fillText(tool.name, buttonX + 15, buttonY + buttonHeight / 2);
  }
}

function drawBrushControls(ctx: CanvasRenderingContext2D, geom: OverlayGeometry) {
  const { sizeControlY, sizeButtonY, sizeButtonSize, sizeControlCenterX, buttonSpacing } = geom;

  // Caption
  ctx.fillStyle = 'white';
  const sizeFontSize = Math.max(9, Math.min(14, geom.width / 25));
  ctx.font = `bold ${sizeFontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('SIZE', sizeControlCenterX, sizeControlY);

  // Minus button
  ctx.fillStyle = '#666';
  ctx.fillRect(sizeControlCenterX - buttonSpacing, sizeButtonY, sizeButtonSize, sizeButtonSize);
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.strokeRect(sizeControlCenterX - buttonSpacing, sizeButtonY, sizeButtonSize, sizeButtonSize);
  ctx.fillStyle = 'white';
  ctx.fillText('-', sizeControlCenterX - buttonSpacing + sizeButtonSize / 2, sizeButtonY + sizeButtonSize / 2);

  // Current size value
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

export function renderBoard(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gameState: GameState): void {
  // 1. Game area & particle rendering
  const { size: gameAreaSize, offsetX, offsetY } = computeGameArea(canvas);
  ensureImageData(ctx, gameAreaSize);

  // Clear full canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  renderParticlesToImage(gameState, gameAreaSize);
  ctx.putImageData(imageData, offsetX, offsetY);

  // 2. UI: toggle button
  drawToggleButton(ctx);

  // 3. Overlay (if open)
  if (UiState.isOverlayOpen) {
    const geom = computeOverlayGeometry(canvas);
    drawOverlay(ctx, geom);
  }
}
