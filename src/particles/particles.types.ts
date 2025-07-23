export interface ParticleType {
    name: string;
    color: string;
    behavior?: (grid: Uint8Array, width: number, height: number, x: number, y: number) => void;
}
