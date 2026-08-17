import { Assets, Container, Sprite } from "pixi.js";
import { ActiveList } from "../ActiveList";
import LocalEvents from "../LocalEvents";
import HealthBar from "./HealthBar";


export default class Enemy extends Container{
    
    private _health: number = 0;
    private _events: LocalEvents;
    
    private _activeList: ActiveList;
    
    private _sprite: Sprite;
    private _healthBar: HealthBar;

    constructor(health: number, textureKey: string) {
        super();

        this._health = health;
        this._events = new LocalEvents(['HealthChanged', 'Died']);
        this._activeList = new ActiveList();

        this._sprite = new Sprite(Assets.get(textureKey));
        
        this._healthBar = new HealthBar(this, health, ['healthbarUnder', 'healthbarValue', 'healthbarOver']);
        this._healthBar.x = this._sprite.width / 2 - this._healthBar.width / 2;
        this._healthBar.y = -60;

        this.addChild(this._sprite);
        this.addChild(this._healthBar);
    }

    public get activeList(): ActiveList {
        return this._activeList;
    }

    public get events(): LocalEvents {
        return this._events;
    }

    public takeDamage(value: number): void {
        if (this._health === 0) return;

        this._health -= value;

        if (this._health <= 0) {
            this._health = 0;
            setTimeout(() => {
                this.onDeath();
            }, 500);
        }
        
        console.log("Enemy: Health is ", this._health);
        this._events.emit('HealthChanged', this._health);
    }

    public update(deltaMS: number): void {
        if (!this._activeList.empty) {
            this._activeList.update(deltaMS);
        }
    }

    public free(): void {
        this._healthBar.free();
    }

    private onDeath(): void {
        this._events.emit('Died');
    }
}