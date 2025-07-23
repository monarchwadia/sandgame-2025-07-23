
import type { ParticleType } from './particles.types';
import { sandParticle } from './sand.particle';
import { skyParticle } from './sky.particle';

export const particlesRegistry: { [key: number]: ParticleType } = {
    [0]: skyParticle,
    [1]: sandParticle
};