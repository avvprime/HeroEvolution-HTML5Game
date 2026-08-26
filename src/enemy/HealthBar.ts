import { Assets, Container, Sprite, Texture } from "pixi.js";
import type Enemy from "./Enemy";
import { lerp } from "../util";
import { ActiveRef } from "../ActiveList";


export default class HealthBar extends Container {

    private _parent: Enemy;
    private _maxValue: number = 100;
    private _value: number = 100;

    private _valueChangeAnim: any = {
        from: 0,
        to: 1,
        duration: 300,
        elapsedTime: 0,
        playing: false
    }

    private _activeRef: ActiveRef;

    private _underSprite: Sprite;
    private _valueSprite: Sprite;
    private _overSprite: Sprite;

    private _mask: Sprite;

    constructor(enemy: Enemy, value: number, textureKeys: string[]) {
        super();
        this._parent = enemy;
        this._value = value;
        this._maxValue = value;

        this._activeRef = new ActiveRef(this.update.bind(this));
        this._parent.events.on('HealthChanged', this.updateValue.bind(this));

        this._underSprite = new Sprite(Assets.get(textureKeys[0]));
        
        this._valueSprite = new Sprite(Assets.get(textureKeys[1]));
        this._valueSprite.x = 5;
        this._valueSprite.y = 5;

        this._overSprite  = new Sprite(Assets.get(textureKeys[2]));
        this._overSprite.x = 5;
        this._overSprite.y = 8;

        this.addChild(this._underSprite);
        this.addChild(this._valueSprite);
        this.addChild(this._overSprite);

        this._mask = new Sprite(Texture.WHITE);
        this._mask.width = this._valueSprite.width;
        this._mask.height = this._valueSprite.height;
        this._mask.x = 5;
        this._mask.y = 5;
        this.addChild(this._mask);
        this._valueSprite.mask = this._mask;
    }

    public free(): void {
        this._parent.activeList.remove(this._activeRef);
        this._parent.events.off('HealthChanged', this.updateValue);
    }

    private update(deltaMS: number): void {
        if (this._valueChangeAnim.playing) {
            const a = this._valueChangeAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._value = lerp(a.from, a.to, t);
            // if mask width is 0 it doesn't work
            this._mask.width = Math.max((this._value / this._maxValue) * this._valueSprite.width, 0.01);
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onChangeAnimCompleted();        
            }
        }
    }

    private updateValue(value: number): void {
        this._valueChangeAnim.from = this._value;
        this._valueChangeAnim.to = value;
        this._valueChangeAnim.elapsedTime = 0;
        this._valueChangeAnim.playing = true;
        
        this._parent.activeList.add(this._activeRef);
    }

    private onChangeAnimCompleted(): void {
        this._parent.activeList.remove(this._activeRef);
    }
}