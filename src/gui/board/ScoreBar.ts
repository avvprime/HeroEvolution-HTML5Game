import { Assets, BitmapText, Container, Sprite, Text } from "pixi.js";
import { isMobile } from "../../common";
import { ActiveRef } from "../../ActiveList";
import type Board from "./Board";
import { lerp } from "../../util";

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

    private _value: number = 0;

    constructor(parent: Board, parentWidth: number, parentHeight: number) {
        super();

        this._parent = parent;

        this._bg = new Sprite(Assets.get('blade'));
        this.addChild(this._bg);

        this._label = new BitmapText({
            text: '999',
            style: {
                fontFamily: 'SlackeyBitmap',
                fontSize: 32,
                fill: 0x000000,
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
        this._scoreChangeAnim.to = score;
        this._scoreChangeAnim.elapsedTime = 0;
        this._scoreChangeAnim.playing = true;

        this._parent.activeList.add(this._activeRef);
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
                this._parent.activeList.remove(this._activeRef);
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
        
    }
}