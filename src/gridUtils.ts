export function getIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

export function getBelow(x: number, y: number, width: number): number {
  return getIndex(x, y + 1, width);
}

