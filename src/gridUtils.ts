// src/gridUtils.ts
// Utility functions for grid position calculations

import { memoizeByParams } from "./cacheUtils";
import { getRandom } from "./randomseed";

export function getIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

export function getBelow(x: number, y: number, width: number): number {
  return getIndex(x, y + 1, width);
}

export function getLeft(x: number, y: number, width: number): number {
  return getIndex(x - 1, y + 1, width);
}

export function getRight(x: number, y: number, width: number): number {
  return getIndex(x + 1, y + 1, width);
}

export function getXY(index: number, width: number): { x: number, y: number } {
  return {
    x: index % width,
    y: Math.floor(index / width)
  };
}


// ============================== Adjacents ==============================

type XYIndexes = {
  x: number;
  y: number;
  index: number;
}

type AdjacentCells = {
  left: XYIndexes | null;
  right: XYIndexes | null;
  up: XYIndexes | null;
  down: XYIndexes | null;
  upLeft: XYIndexes | null;
  upRight: XYIndexes | null;
  downLeft: XYIndexes | null;
  downRight: XYIndexes | null;
}

const getcachedXYIndexes = memoizeByParams(function _getcachedXYIndexes(x: number, y: number, width: number, height: number): XYIndexes | null {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return null;
  }

  return { x, y, index: getIndex(x, y, width) };
})



export const getAdjacentCells = memoizeByParams(function _getAdjacentCells(x: number, y: number, width: number, height: number): AdjacentCells {
  return {
    left: getcachedXYIndexes(x - 1, y, width, height),
    right: getcachedXYIndexes(x + 1, y, width, height),
    up: getcachedXYIndexes(x, y - 1, width, height),
    down: getcachedXYIndexes(x, y + 1, width, height),
    upLeft: getcachedXYIndexes(x - 1, y - 1, width, height),
    upRight: getcachedXYIndexes(x + 1, y - 1, width, height),
    downLeft: getcachedXYIndexes(x - 1, y + 1, width, height),
    downRight: getcachedXYIndexes(x + 1, y + 1, width, height)
  };
});

// ============================================================

const _directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [1, -1], [-1, 1], [1, 1]
];
export const getRandomNeighbourCell = (x: number, y: number, width: number, height: number): XYIndexes => {
  let candidate: XYIndexes | null = null;
  let whileSafety = 1000;
  while (!candidate) {
    whileSafety--;
    if (whileSafety <= 0) {
      throw new Error("Infinite loop in getRandomNeighbourCell");
    }
    const dir = _directions[Math.floor(getRandom() * _directions.length)];
    candidate = getcachedXYIndexes(x + dir[0], y + dir[1], width, height);
  }
  return candidate;
}

export const getRandomNeighbourFromAdjacentCells = (adjacents: AdjacentCells): XYIndexes => {
  let candidate: XYIndexes | null = null;
  const vals = Object.values(adjacents);
  let whileSafety = 1000;
  while (!candidate) {
    whileSafety--;
    if (whileSafety <= 0) {
      throw new Error("Infinite loop in getRandomNeighbourFromAdjacentCells");
    }
    candidate = vals[Math.floor(getRandom() * vals.length)];
  }
  return candidate;
}

export const forEachNeighbourInAdjacentCells = (
  adjacents: AdjacentCells,
  callback: (cell: XYIndexes) => void
): void => {
  for (const cell of Object.values(adjacents)) {
    if (cell) {
      callback(cell);
    }
  }
}