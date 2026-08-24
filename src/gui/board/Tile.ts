import { Assets, Container, Sprite } from "pixi.js";
import type Tiles from "./Tiles";
import { ActiveRef } from "../../ActiveList";
import { easeOutBack, lerp } from "../../util";


export default class Tile extends Container {

    private _moveAnim: any = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
        duration: 0,
        elapsedTime: 0,
        playing: false
    }

    private _mergeScaleUpAnim: any = {
        from: 0.5,
        to: 1,
        duration: 300,
        elapsedTime: 0,
        playing: false
    }

    private _mergeScaleDownAnim: any = {
        from: 1,
        to: 0,
        duration: 200,
        elapsedTime: 0,
        playing: false
    }

    private _value: number = 0;
    private _targetVal: number = 0;
    private _boardIdx: number = -1;
    private _parent: Tiles;
    private _activeRef: ActiveRef;

    private _otherTileTriggered: boolean = false;
    private _mergeTriggered: boolean = false;

    private _totalActiveAnims: number = 0;

    private _body: Sprite;

    constructor(parent: Tiles, x: number, y: number, size: number, value: number) {
        super();

        this._body = new Sprite(Assets.get('hero' + value));
        this._body.pivot.set(size / 2);
        this._body.position.set(size / 2);
        this.addChild(this._body);

        this._parent = parent;
        this._activeRef = new ActiveRef(this.update.bind(this));
        this.position.set(x, y);
        this.width = size;
        this.height = size;
        this.setValue(value);
    }

    public get value(): number { return this._value }
    
    public move(x: number, y: number, val: number, boardIdx: number): void {

        if (this._moveAnim.playing) {
            if (this._targetVal > 0) {
                this._parent.onMergeTileMoved(this._boardIdx);
                this.setValue(this._targetVal);
            }
        }

        this._otherTileTriggered = false;
        this._mergeTriggered = false;
        if (val > 0) this.zIndex = 1;
        

        this._targetVal = val;
        this._boardIdx = boardIdx;

        const dx = x - this.x;
        const dy = y - this.y;
        const dist = Math.hypot(dx, dy);
        const speed = 1;
        
        this._moveAnim.duration = dist / speed;
        this._moveAnim.from.x = this.x;
        this._moveAnim.from.y = this.y;
        this._moveAnim.to.x = x;
        this._moveAnim.to.y = y;
        this._moveAnim.elapsedTime = 0;
        this._moveAnim.playing = true;

        this.onAnimAdded();
    }

    public disappear(): void {
        this._mergeScaleDownAnim.elapsedTime = 0;
        this._mergeScaleDownAnim.playing = true;
        this.onAnimAdded();
    }

    public resize(x: number, y: number, tileSize: number): void {
        this.x = x;
        this.y = y;
        this.width = tileSize;
        this.height = tileSize;
    }

    private setValue(val: number) {
        this._value = val;
        this._body.texture = Assets.get('hero' + this._value);
        this.zIndex = 0;

        this._mergeScaleUpAnim.elapsedTime = 0;
        this._mergeScaleUpAnim.playing = true;
        this.onAnimAdded();
    }

    private update(deltaMS: number): void {
        if (this._moveAnim.playing) {
            const a = this._moveAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            const easedT = easeOutBack(t, 1.1);
            const x = lerp(a.from.x, a.to.x, easedT);
            const y = lerp(a.from.y, a.to.y, easedT);
            this.position.set(x, y);


            if (this._targetVal > 0) {
                if (t > 0.3 && !this._otherTileTriggered) {
                    this._parent.onMergeTileMoved(this._boardIdx);
                    this._otherTileTriggered = true;
                }

                if (t > 0.6 && !this._mergeTriggered) {
                    this.setValue(this._targetVal);
                    this._mergeTriggered = true;
                }
            }

            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimFinished();
                this.onMoved();
            }
        }
        
        if (this._mergeScaleUpAnim.playing) {
            const a = this._mergeScaleUpAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._body.scale.set(lerp(a.from, a.to, easeOutBack(t, 3)));
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimFinished();
            }
        }

        if (this._mergeScaleDownAnim.playing) {
            const a = this._mergeScaleDownAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._body.scale.set(lerp(a.from, a.to, t));
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimFinished();
                this.onDisappeared();
            }
        }
    }

    private onAnimAdded(): void {
        if (this._totalActiveAnims === 0) this._parent.activeList.add(this._activeRef);
        this._totalActiveAnims++;
    }

    private onAnimFinished(): void {
        this._totalActiveAnims--;
        if (this._totalActiveAnims === 0) this._parent.activeList.remove(this._activeRef);
    }

    private onMoved(): void {
        //
    }

    private onDisappeared(): void {
        this.visible = false;

    }
}