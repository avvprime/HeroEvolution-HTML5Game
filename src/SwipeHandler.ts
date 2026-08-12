import { Dir } from "./common";
import Input from "./managers/InputManager";


export default class SwipeHandler {

    private _isMobile: boolean = false;
    private _dragStart: { x: number, y: number } = { x: 0, y: 0 }
    private _dragDist: number = 0;
    private _dragDir: { x: number, y: number } = { x: 0, y: 0 };
    private _dragCardinalDir: number = 0;
    private _isDragStarted: boolean = false;
    private _isDragging: boolean = false;
    private _dragged: boolean = false;
    private _pointerDown: boolean = false;

    constructor() { 
        this._isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    public get isMobile(): boolean { return this._isMobile }

    public get dragging(): boolean { return this._isDragging }

    public get dragDir(): { x: number, y: number } { return this._dragDir }

    public get dragCardinalDir(): number { return this._dragCardinalDir }

    public get dragDist(): number { return this._dragDist }

    public update(): void {
        let pointerPos;

        if (this._isMobile) {
            this._pointerDown = Input.Touch.down;
            pointerPos = Input.Touch.position;
        }
        else {
            this._pointerDown = Input.Mouse.lmb.down;
            pointerPos = Input.Mouse.position;
        }

        if (this._pointerDown) {
            if (this._dragged) return;

            if (!this._isDragStarted) {
                this._dragStart.x = pointerPos.x;
                this._dragStart.y = pointerPos.y;
                this._isDragStarted = true;  
                return;
            }

            this.calcDrag(pointerPos.x, pointerPos.y);
            this._isDragging = true;
        }
        else {
            this._dragged = false;
            this._isDragging = false;
            this._isDragStarted = false;
        }
    }

    public cancelSwipe(): void {
        this._dragged = true;
        this._isDragging = false;
        this._dragDist = 0;
        this._dragDir.x = 0;
        this._dragDir.y = 0;
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