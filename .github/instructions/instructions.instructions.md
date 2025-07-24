---
applyTo: '**'
---
- Particle indices should be defined in their respective particle files, for example `src/particles/concrete.particle.ts` exports `CONCRETE_IDX`.
- Colors should go in `src/palette.ts` and imported into particle files as needed. This lets us easily change colors in a single place.
- when creating a new particle type, here is the procedure to follow: (1) define the particle as a no-op in `src/particles/*.particle.ts` with a unique index, (2) add the particle to the `particlesRegistry` in `src/particles/particlesRegistry.ts`, (3) ensure it has a color defined in `src/palette.ts`.
- never use magic numbers for particle indices or colors, always use the constants defined in `src/particles/*.particle.ts`
- never use rgba strings for colors except inside `src/palette.ts`. When working with colors, always use the constants defined in `src/palette.ts`.