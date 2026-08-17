import { Container } from "pixi.js";
import type Enemy from "./Enemy";
import { lerp } from "../util";
import { ActiveRef } from "../ActiveList";


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

    private _activeRef: ActiveRef;

    constructor(enemy: Enemy, value: number) {
        super();
        this._parent = enemy;
        this._value = value;

        this._activeRef = new ActiveRef(this.update.bind(this));
        this._parent.events.on('HealthChanged', this.updateValue.bind(this));
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

            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
                this.onChangeAnimCompleted();        
            }
        }
    }

    private updateValue(value: number): void {
        console.log("HealthBar: updateValue");

        this._valueChangeAnim.from = this._value;
        this._valueChangeAnim.to = value;
        this._valueChangeAnim.elapsedTime = 0;
        this._valueChangeAnim.playing = true;
        
        this._parent.activeList.add(this._activeRef);
    }

    private onChangeAnimCompleted(): void {
        console.log("HealthBar: animCompleted")
        this._parent.activeList.remove(this._activeRef);
    }
}