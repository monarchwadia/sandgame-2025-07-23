import type { GameState } from "../GameState";

export type RGBA = [number, number, number, number]; // RGBA color format

export interface ParticleType {
    name: string;
    color: RGBA | ((gameState: GameState) => RGBA); // RGBA as string or function to get color based on game state
    behavior?: (grid: Uint32Array, width: number, height: number, x: number, y: number, gameState: GameState) => void;
}
