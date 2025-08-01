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
