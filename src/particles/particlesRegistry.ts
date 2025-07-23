
import { grassParticle } from './grass.particle';
import type { ParticleType } from './particles.types';
import { sandParticle } from './sand.particle';
import { skyParticle } from './sky.particle';
import { waterParticle } from './water.particle';
import { woodParticle } from './wood.particle';
import { treetopParticle } from './treetop.particle';

export const particlesRegistry: { [key: number]: ParticleType } = {
    [0]: skyParticle,
    [1]: sandParticle,
    [2]: waterParticle,
    [3]: grassParticle,
    [4]: woodParticle,
    [5]: treetopParticle
};