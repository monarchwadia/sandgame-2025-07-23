export interface ParticleType {
    name: string;
    color: [number, number, number, number];
    behavior?: (grid: Uint8Array, width: number, height: number, x: number, y: number) => void;
}
