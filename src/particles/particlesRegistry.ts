import { GRASS_IDX, grassParticle } from './grass.particle';
import type { ParticleType } from './particles.types';
import { SAND_IDX, sandParticle } from './sand.particle';
import { SKY_IDX, skyParticle } from './sky.particle';
import { WATER_IDX, waterParticle } from './water.particle';
import { WOOD_IDX, woodParticle } from './wood.particle';
import { TREETOP_IDX, treetopParticle } from './treetop.particle';
import { HUMAN_IDX, humanParticle } from './human.particle';
import { CONCRETE_IDX, concreteParticle } from './concrete.particle';
import { FIRE_IDX, fireParticle } from './fire.particle';
import { LIGHTNING_IDX, lightningParticle } from './lightning.particle';
import { PIPE_IDX, pipeParticle } from './pipe.particle';
import { OIL_IDX, oilParticle } from './oil.particle';
import { AIRPOLLUTION_IDX, airpollutionParticle } from './airpollution.particle';
import { ACID_IDX, acidParticle } from './acid.particle';

export const particlesRegistry: { [key: number]: ParticleType } = {
    [SKY_IDX]: skyParticle,
    [SAND_IDX]: sandParticle,
    [WATER_IDX]: waterParticle,
    [GRASS_IDX]: grassParticle,
    [WOOD_IDX]: woodParticle,
    [TREETOP_IDX]: treetopParticle,
    [HUMAN_IDX]: humanParticle,
    [CONCRETE_IDX]: concreteParticle,
    [FIRE_IDX]: fireParticle,
    [LIGHTNING_IDX]: lightningParticle,
    [PIPE_IDX]: pipeParticle,
    [OIL_IDX]: oilParticle,
    [AIRPOLLUTION_IDX]: airpollutionParticle,
    [ACID_IDX]: acidParticle
};