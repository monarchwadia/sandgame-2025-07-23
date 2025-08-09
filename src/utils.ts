export const areParticlesEqual = (a: number, b: number): boolean => {
    // check only the 7 least significant bits
    // return a === b; 
    return (a & 0x7F) === (b & 0x7F);
}