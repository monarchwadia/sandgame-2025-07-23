import type { GameState } from "./GameState";
import { SAND_IDX } from "./particles/sand.particle";

export const UiState = {
    isMouseDown: false,
    holdInterval: null as  number | null,
    lastMouseX: 0,
    lastMouseY: 0,
    lastCanvas: null as HTMLCanvasElement | null,
    lastGameState: null as GameState | null,
    selectedTool: SAND_IDX as number,
    brushSize: 1, // Default brush size
}