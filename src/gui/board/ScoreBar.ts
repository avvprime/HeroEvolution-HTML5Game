import { Assets, BitmapText, Container, Sprite } from "pixi.js";
import { isMobile } from "../../common";
import { ActiveRef } from "../../ActiveList";
import type Board from "./Board";
import { easeOutSine, lerp } from "../../util";

export default class ScoreBar extends Container {
    
    private _relWidth: number = 0.8; // auto height
    private _heightToWidthRatio: number = 0;

    private _bg: Sprite;
    private _label: BitmapText;

    private _parent: Board;
    private _activeRef: ActiveRef;

    private _scoreChangeAnim: any = {
        from: 0,
        to: 1,
        duration: 300,
        elapsedTime: 0,
        playing: false
    }

    private _scoreScaleUpAnim: any = {
        from: 1, 
        to: 1.3,
        duration: 200,
        elapsedTime: 0,
        playing: false
    }

    private _scoreScaleDownAnim: any = {
        from: 1.3,
        to: 1,
        duration: 100,
        elapsedTime: 0,
        playing: false
    }

    private _totalAnimsPlaying: number = 0;

    private _value: number = 0;

    constructor(parent: Board, parentWidth: number, parentHeight: number) {
        super();

        this._parent = parent;

        this._bg = new Sprite(Assets.get('blade'));
        this.addChild(this._bg);

        this._label = new BitmapText({
            text: '999',
            style: {
                fontFamily: 'Slackey',
                fontSize: 36,
                fill: 0x3d3d3d,
                align: 'center'
            },
            x: this._bg.width / 2,
            y: this._bg.height / 2,
            anchor: { x: 0.5, y: 0.5 }
        });
        this.addChild(this._label);

        this._heightToWidthRatio = this._bg.height / this._bg.width;

        this.adjustSize(parentWidth, parentHeight);
        this.adjustPosition(parentWidth, parentHeight);

        this._activeRef = new ActiveRef(this.update.bind(this));
    }

    public updateScore(score: number): void {
        if (this._scoreChangeAnim.playing) {
            this._scoreChangeAnim.to = score;
            this._scoreChangeAnim.elapsedTime = 0;
            return;
        }
        this._scoreChangeAnim.from = this._value;
        this._scoreChangeAnim.to = score * 1000;
        this._scoreChangeAnim.elapsedTime = 0;
        this._scoreChangeAnim.playing = true;

        this.onAnimAdded();

        if (this._scoreScaleUpAnim.playing) {
            this._scoreScaleUpAnim.elapsedTime = 0;
            return;
        }

        this._scoreScaleUpAnim.from = 1;
        this._scoreScaleUpAnim.elapsedTime = 0;
        this._scoreScaleUpAnim.playing = true;

        if (this._scoreScaleDownAnim.playing) {
            this._scoreScaleDownAnim.elapsedTime = 0;
            this._scoreScaleDownAnim.playing = false;
            this._scoreScaleUpAnim.from = this._label.scale.x;
        }

        this.onAnimAdded();
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        this.adjustSize(newParentWidth, newParentHeight);
        this.adjustPosition(newParentWidth, newParentHeight);
    }

    private update(deltaMS: number): void {
        if (this._scoreChangeAnim.playing) {
            const a = this._scoreChangeAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._value = Math.floor(lerp(a.from, a.to, t));
            this._label.text = this._value;
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimEnded();
            }
        }

        if (this._scoreScaleUpAnim.playing) {
            const a = this._scoreScaleUpAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._label.scale.set(lerp(a.from, a.to, easeOutSine(t)));
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                
                this._scoreScaleDownAnim.elapsedTime = 0;
                this._scoreScaleDownAnim.playing = true;
            }
        }

        if (this._scoreScaleDownAnim.playing) {
            const a = this._scoreScaleDownAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._label.scale.set(lerp(a.from, a.to, easeOutSine(t)));
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onAnimEnded();
            }
        }
    }

    private adjustSize(width: number, _height: number): void {
        this._bg.width = width * this._relWidth;
        this._bg.height = this._bg.width * this._heightToWidthRatio;
    }

    private adjustPosition(width: number, height: number): void {
        if (isMobile) {
            this.x = width / 2 - this._bg.width / 2;
            this.y = -height * 0.1;
        }
        else {
            this.x = width / 2 - this._bg.width / 2;
            this.y = height * 0.05;
        }
        this._label.x = this._bg.width / 2 + 16;
        this._label.y = this._bg.height / 2 - 6;
    }

    private onAnimAdded(): void {
        if (this._totalAnimsPlaying === 0) this._parent.activeList.add(this._activeRef);
        this._totalAnimsPlaying++;
    }
    
    private onAnimEnded(): void {
        this._totalAnimsPlaying--;
        if (this._totalAnimsPlaying === 0) this._parent.activeList.remove(this._activeRef);
    }
}