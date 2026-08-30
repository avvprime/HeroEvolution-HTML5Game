import { Assets, BitmapText, Container, Filter, GlProgram, Sprite } from "pixi.js";
import type Tiles from "./Tiles";
import { ActiveRef } from "../../ActiveList";
import { easeOutBack, easeOutSine, lerp } from "../../util";
import { Events, Event} from "../../managers/EventManager";
import { highlight } from "../../shaders/fragment";
import vertex from "../../shaders/vertex";

export default class Tile extends Container {

    private _moveAnim: any = {
        from: { x: 0, y: 0 },
        to: { x: 0, y: 0 },
        duration: 200,
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

    private _highlightAnim: any = {
        from: 0,
        to: 1,
        duration: 500,
        elapsedTime: 0,
        playing: false
    }

    private _levelLabelRiseAnim: any = {
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

    private _otherTileTriggered: boolean = false;
    private _mergeTriggered: boolean = false;

    private _totalActiveAnims: number = 0;

    private _body: Sprite;
    private _highlightFilter: Filter;
    private _leveLabel: BitmapText;

    private _baseTileSize: number = 32;
    private _levelLabelScale: number = 1;

    constructor(parent: Tiles, x: number, y: number, size: number, value: number) {
        super();

        this._baseTileSize = size;

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

        this._leveLabel = new BitmapText({
            text: 'Level 1',
            style: {
                fontFamily: 'SlackeyBitmap',
                fontSize: 16,
                fill: 0x000000
            },
            anchor: { x: 0.5, y: 0.5 },
            x: this._body.width / 2,
            y: -20
        });
        this.addChild(this._leveLabel);

        this._highlightFilter = new Filter({
            glProgram: new GlProgram({
                vertex,
                fragment: highlight
            }),
            resources: {
                highlighUniforms: {
                    uProgress: { value: 0, type: 'f32' },
                    uLineSmoothness: { value: 0.045, type: 'f32' },
                    uLineWidth: { value: 0.09, type: 'f32' },
                    uBrightness: { value: 3.0, type: 'f32' },
                    uRotationDeg: { value: 30, type: 'f32' },
                    uDistortion: { value: 1.8, type: 'f32' },
                    uPosition: { value: 0, type: 'f32' },
                    uPositionMin: { value: -0.3, type: 'f32' },
                    uPositionMax: { value: 1.3, type: 'f32' },
                    uAlpha: { value: 1.0, type: 'f32' },
                }
            }
        });
        this._body.filters = [this._highlightFilter];

    }

    public get value(): number { return this._value }

    public prepare(x: number, y: number, value: number): void {
        this.position.set(x, y);
        this.setValue(value);
        this.visible = true;
        this._leveLabel.visible = true;
        console.log("pool tile")
    }

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

        /*
        const dx = x - this.x;
        const dy = y - this.y;
        const dist = Math.hypot(dx, dy);
        const speed = 1;

        this._moveAnim.duration = dist / speed;*/
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

        this._leveLabel.visible = false;
    }

    public resize(x: number, y: number, tileSize: number): void {
        const scale = tileSize / this._baseTileSize;
        this._body.scale.set(scale);
        this._body.position.set(this.width / 2);

        this._leveLabel.scale.set(scale);
        this._leveLabel.x = this._body.width / 2;
        this._levelLabelScale = this._leveLabel.scale.x;

        this.position.set(x, y);

        this._mergeScaleUpAnim.from = scale * 0.5;
        this._mergeScaleUpAnim.to = scale;

        this._mergeScaleDownAnim.from = scale;
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
                    Events.emit(Event.GUI_TILE_MERGED, this.x - this._body.width / 2, this.y - this._body.height / 2, this._targetVal);
                }

                if (t > 0.6 && !this._mergeTriggered) {
                    this.setValue(this._targetVal);
                    this._mergeTriggered = true;
                    
                    this._highlightAnim.playing = true;
                    this._highlightAnim.elapsedTime = 0;
                    this.onAnimAdded();

                    this._levelLabelRiseAnim.elapsedTime = 0;
                    this._levelLabelRiseAnim.playing = true;
                    this.onAnimAdded();

                    this._leveLabel.text = 'Level ' + this._targetVal;
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

        if (this._highlightAnim.playing) {
            const a = this._highlightAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._highlightFilter.resources.highlighUniforms.uniforms.uProgress = lerp(a.from, a.to, t);
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimFinished();
            }
        }

        if (this._levelLabelRiseAnim.playing) {
            const a = this._levelLabelRiseAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._leveLabel.y = lerp(10, -20, easeOutSine(t));
            this._leveLabel.alpha = t;
            this._leveLabel.scale.set(lerp(this._levelLabelScale * 0.5, this._levelLabelScale, easeOutBack(t)));
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimFinished();
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
        
    }

    private onDisappeared(): void {
        this.visible = false;

    }
}