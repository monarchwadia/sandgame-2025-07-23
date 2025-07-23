import { GRASS_IDX, grassParticle } from './grass.particle';
import type { ParticleType } from './particles.types';
import { SAND_IDX, sandParticle } from './sand.particle';
import { SKY_IDX, skyParticle } from './sky.particle';
import { WATER_IDX, waterParticle } from './water.particle';
import { WOOD_IDX, woodParticle } from './wood.particle';
import { TREETOP_IDX, treetopParticle } from './treetop.particle';

export const particlesRegistry: { [key: number]: ParticleType } = {
    [SKY_IDX]: skyParticle,
    [SAND_IDX]: sandParticle,
    [WATER_IDX]: waterParticle,
    [GRASS_IDX]: grassParticle,
    [WOOD_IDX]: woodParticle,
    [TREETOP_IDX]: treetopParticle
};