import { Assets, Sprite } from "pixi.js";
import type Tiles from "./Tiles";
import { ActiveRef } from "../../ActiveList";
import { lerp } from "../../util";


export default class Tile extends Sprite {

    private _moveAnim: any = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
        duration: 0,
        elapsedTime: 0,
        playing: false
    }

    private _mergeScaleUpAnim: any = {
        from: 0,
        to: 1,
        duration: 200,
        elapsedTime: 0,
        playing: false
    }

    private _value: number = 0;
    private _targetVal: number = 0;
    private _boardIdx: number = -1;
    private _parent: Tiles;
    private _activeRef: ActiveRef;

    constructor(parent: Tiles, x: number, y: number, size: number, value: number) {
        super();

        this._parent = parent;
        this._activeRef = new ActiveRef(this.update.bind(this));
        this.value = value;
        this.position.set(x, y);
        this.width = size;
        this.height = size;
    }

    public get value(): number { return this._value }
    public set value(val: number) {
        this._value = val;
        this.texture = Assets.get('hero' + this._value);
    }

    public move(x: number, y: number, val: number, boardIdx: number): void {

        if (this._moveAnim.playing) {
            if (this._targetVal > 0) {
                this._parent.onMergeTileMoved(this._boardIdx);
                this.value = this._targetVal;
            }
        }


        const dx = x - this.x;
        const dy = y - this.y;
        const dist = Math.hypot(dx, dy);
        const speed = 3;
        
        this._moveAnim.duration = dist / speed;
        this._moveAnim.from.x = this.x;
        this._moveAnim.from.y = this.y;
        this._moveAnim.to.x = x;
        this._moveAnim.to.y = y;
        this._moveAnim.elapsedTime = 0;
        this._moveAnim.playing = true;

        this._parent.activeList.add(this._activeRef);

        this._targetVal = val;
        this._boardIdx = boardIdx;
    }

    public disappear(): void {
        if (this._activeRef.currentlyActive) this._parent.activeList.remove(this._activeRef);
        this.visible = false;
    }

    public resize(x: number, y: number, tileSize: number): void {
        this.x = x;
        this.y = y;
        this.width = tileSize;
        this.height = tileSize;
    }

    private update(deltaMS: number): void {
        if (this._moveAnim.playing) {
            const a = this._moveAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            const x = lerp(a.from.x, a.to.x, t);
            const y = lerp(a.from.y, a.to.y, t);
            this.position.set(x, y);
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onMoved();
            }
        }
    }

    private onMoved(): void {
        if (this._targetVal > 0) {
            this._parent.onMergeTileMoved(this._boardIdx);
            this.value = this._targetVal;
        }

        this._parent.activeList.remove(this._activeRef);
    }
}