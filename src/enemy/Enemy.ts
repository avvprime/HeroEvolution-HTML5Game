import LocalEvents from "../LocalEvents";


export default class Enemy {
    
    private _health: number = 0;
    private _events: LocalEvents;
    
    private _activeList: any[] = [];

    constructor() {
        this._events = new LocalEvents(['HealthChanged']);
    }

    public addToActiveList(func: (() => void), owner: any): void {
        this._activeList.push({ owner, func });
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

    private onDeath(): void {

    }
}