import { Container } from "pixi.js";
import type Enemy from "./Enemy";
import { lerp } from "../util";


export default class HealthBar extends Container {

    private _parent: Enemy;
    private _value: number = 100;

    private _valueChangeAnim: any = {
        from: 0,
        to: 1,
        duration: 300,
        elapsedTime: 0,
        playing: false
    }

    constructor(enemy: Enemy, value: number) {
        super();
        this._parent = enemy;

        this._value = value;

        enemy.on('HealthChanged', this.updateValue.bind(this));
    }

    public update(deltaMS: number): void {
        if (this._valueChangeAnim.playing) {
            const a = this._valueChangeAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(a.elapsedTime / a.duration);
            this._value = lerp(a.from, a.to, t);

            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onChangeAnimCompleted();        
            }
        }
    }

    private updateValue(value: number): void {
        this._value = value;
        
    }

    private onChangeAnimCompleted(): void {

    }
}