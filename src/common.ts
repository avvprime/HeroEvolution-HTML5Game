
export const Dir = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3
} as const

export const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < window.innerHeight;

export const HeroColor: Record<number, string> = {
    1: "#0xff0000",
    2: "#0xfff000",
    3: "#0x00ff00",
    4: "#0x0000ff",
}
