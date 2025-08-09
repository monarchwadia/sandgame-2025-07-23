export const areParticlesEqual = (a: number, b: number): boolean => {
    // check only the 7 least significant bits
    // return a === b; 
    return getParticleId(a) === getParticleId(b);
}

export const getParticleId = (particle: number): number => {
    // return the 7 least significant bits as the particle ID
    return particle & 0x7F;
}