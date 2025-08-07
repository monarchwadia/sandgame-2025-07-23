import { SAND_COLOR, FIRE_COLOR, LIGHTNING_COLOR, WATER_COLOR, HUMAN_COLOR } from "./palette";
import { FIRE_IDX } from "./particles/fire.particle";
import { HUMAN_IDX } from "./particles/human.particle";
import { LIGHTNING_IDX } from "./particles/lightning.particle";
import { SAND_IDX } from "./particles/sand.particle";
import { WATER_IDX } from "./particles/water.particle";
import type { ToolDef } from "./tools.types";

function rgbaToCss([r, g, b]: [number, number, number, number]): string {
  return `rgb(${r},${g},${b})`;
}

export const tools: ToolDef[] = [
  { idx: SAND_IDX, name: 'SAND', color: rgbaToCss(SAND_COLOR) },
  { idx: FIRE_IDX, name: 'FIRE', color: rgbaToCss(FIRE_COLOR) },
  { idx: LIGHTNING_IDX, name: 'BOLT', color: rgbaToCss(LIGHTNING_COLOR) },
  { idx: WATER_IDX, name: 'WATER', color: rgbaToCss(WATER_COLOR) },
  { idx: HUMAN_IDX, name: 'HUMAN', color: rgbaToCss(HUMAN_COLOR) },
];