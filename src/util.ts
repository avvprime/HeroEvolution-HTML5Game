export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const transBack = (t: number, overshoot: number = 1.70158) => {return t * t * ((overshoot + 1) * t - overshoot)}
export const easeOutBack = (t: number, overshoot: number = 1.70158) => 1 - transBack(1 - t, overshoot);

export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export function easeOutSine(t: number): number {
    return Math.sin((t * Math.PI) / 2);
}