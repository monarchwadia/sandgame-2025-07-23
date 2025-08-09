export const SPEED_LEVELS = [1,2,3,4,5,6] as const;
export type SpeedLevel = typeof SPEED_LEVELS[number];

export const getSimSpeed = (idx: number) => {
    if (idx < 0) idx = 0;
    if (idx >= SPEED_LEVELS.length) idx = SPEED_LEVELS.length - 1;
    return SPEED_LEVELS[idx];
}