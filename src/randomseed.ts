const SEED_ARRAY_LENGTH = 100000;

let seedIndex = 0;
const seedArray: number[] = new Array(SEED_ARRAY_LENGTH).fill(0).map(() => Math.random());

export function getRandom(): number {
    if (seedIndex >= SEED_ARRAY_LENGTH) {
        seedIndex = 0; // Reset index to loop through the seed array
    }
    const value = seedArray[seedIndex];
    seedIndex++;
    return value;
}