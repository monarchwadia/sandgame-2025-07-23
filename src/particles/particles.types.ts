import type { GameState } from "../GameState";

export interface ParticleType {
    name: string;
    color: string | ((gameState: GameState) => string); // RGBA as string or function to get color based on game state
    behavior?: (grid: Uint8Array, width: number, height: number, x: number, y: number, gameState: GameState) => void;
}
