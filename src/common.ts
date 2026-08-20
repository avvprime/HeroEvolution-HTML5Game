
export const Dir = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3
} as const

export const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0);