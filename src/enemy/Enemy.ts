import { ActiveList } from "../ActiveList";
import LocalEvents from "../LocalEvents";
import HealthBar from "./HealthBar";


export default class Enemy {
    
    private _health: number = 0;
    private _events: LocalEvents;
    
    private _activeList: ActiveList;
    
    private _healthBar: HealthBar;

    constructor(health: number) {
        this._health = health;
        this._events = new LocalEvents(['HealthChanged', 'Died']);
        this._activeList = new ActiveList();

        this._healthBar = new HealthBar(this, health);
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