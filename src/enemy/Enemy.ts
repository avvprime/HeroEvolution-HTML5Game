import { ActiveList } from "../ActiveList";
import LocalEvents from "../LocalEvents";


export default class Enemy {
    
    private _health: number = 0;
    private _events: LocalEvents;
    
    private _activeList: ActiveList;

    constructor() {
        this._events = new LocalEvents(['HealthChanged']);
        this._activeList = new ActiveList();
    }

    public get activeList(): ActiveList {
        return this._activeList;
    }

    public takeDamage(value: number): void {
        this._health -= value;

        if (this._health <= 0) {
            this._health = 0;
            this.onDeath();
        }
        
        this._events.emit('HealthChanged', this._health);
        

    }

    public on(event: string, callback: (...args: any[]) => void): void {
        this._events.on(event, callback);
    } 

    public off(event: string, callback: (...args: any[]) => void): void {
        this._events.off(event, callback);
    }

    public update(deltaMS: number): void {
        if (!this._activeList.empty) this._activeList.update(deltaMS);
    }


    private onDeath(): void {

    }
}