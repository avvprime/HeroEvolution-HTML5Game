import { Dir } from "./common";
import Input from "./managers/InputManager";


export default class SwipeHandler {

    private _isMobile: boolean = false;
    private _dragStart: { x: number, y: number } = { x: 0, y: 0 }
    private _dragDist: number = 0;
    private _dragDir: { x: number, y: number } = { x: 0, y: 0 };
    private _dragCardinalDir: number = 0;
    private _pointerDown: boolean = false;

    public triggerSwipeWithDist: boolean = true;

    constructor() {
        this._isMobile = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0
        );
    }

    public get dir(): { x: number, y: number } { return this._dragDir }

    public get cardinalDir(): number { return this._dragCardinalDir }

    public get dist(): number { return this._dragDist }

    public update(): void {
        if (this._isMobile) {
            if (Input.Touch.down) {
                const pos = Input.Touch.position;
                if (this._pointerDown) {
                    this.calcDrag(pos.x, pos.y);
                }
                else {
                    this._pointerDown = true;
                    this._dragStart.x = pos.x;
                    this._dragStart.y = pos.y;
                }
            }
            else {
                if (this._pointerDown) {
                    this._pointerDown = false;
                    this._dragDist = 0;
                    this._dragDir.x = 0;
                    this._dragDir.y = 0;
                }
            }
        }
        else {
            if (Input.Mouse.lmb.down) {
                const pos = Input.Mouse.position;
                if (this._pointerDown) {
                    this.calcDrag(pos.x, pos.y);
                }
                else {
                    this._pointerDown = true;
                    this._dragStart.x = pos.x;
                    this._dragStart.y = pos.y;
                }
            }
            else {
                if (this._pointerDown) {
                    this._pointerDown = false;
                    this._dragDist = 0;
                    this._dragDir.x = 0;
                    this._dragDir.y = 0;
                }
            }
        }
    }


    private calcDrag(x: number, y: number): void {
        const dx = x - this._dragStart.x;
        const dy = y - this._dragStart.y;
        const length = Math.hypot(dx, dy);
        this._dragDist = length;
        this._dragDir.x = dx / length;
        this._dragDir.y = dy / length;
        const hDir = dx < 0 ? Dir.Left : Dir.Right;
        const vDir = dy < 0 ? Dir.Up : Dir.Down;
        this._dragCardinalDir = Math.abs(dx) > (Math.abs(dy)) ? hDir : vDir;
    }
}