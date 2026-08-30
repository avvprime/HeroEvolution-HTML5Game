import { Assets, Container, Sprite } from "pixi.js";
import { ActiveList, ActiveRef } from "../ActiveList";
import LocalEvents from "../LocalEvents";
import HealthBar from "./HealthBar";
import type Game from "../Game";
import { Event, Events } from "../managers/EventManager";
import { ColorOverlayFilter } from "pixi-filters";
import { lerp } from "../util";
import { DamageParticles } from "./DamageParticles";

export default class Enemy extends Container{
    
    private _colorOverlayFadeOutAnim: any = {
        from: 1,
        to: 0,
        duration: 200,
        playing: false
    }

    private _health: number = 0;
    private _events: LocalEvents;
    
    private _activeList: ActiveList;
    private _activeRef: ActiveRef;
    
    private _sprite: Sprite;
    private _healthBar: HealthBar;

    private _parent: Game;
    private _colorOverlayFilter: ColorOverlayFilter;

    private _damageParticles: DamageParticles;

    private _totalActiveAnims: number = 0;

    constructor(parent: Game, health: number, textureKey: string) {
        super();
        
        this._parent = parent;

        this._health = health;
        this._events = new LocalEvents(['HealthChanged']);
        this._activeList = new ActiveList();

        this._activeRef = new ActiveRef(this.update.bind(this));
        this._parent.activeList.add(this._activeRef);

        this._sprite = new Sprite(Assets.get(textureKey));
        
        this._colorOverlayFilter = new ColorOverlayFilter({ color: 0xffffff, alpha: 0}); 
        this._sprite.filters = [this._colorOverlayFilter];

        this._healthBar = new HealthBar(this, health, ['healthbarUnder', 'healthbarValue', 'healthbarOver']);
        this._healthBar.x = this._sprite.width / 2 - this._healthBar.width / 2;
        this._healthBar.y = -60;

        this._damageParticles = new DamageParticles(this);
        this._damageParticles.x = this._sprite.width;

        this.addChild(this._sprite);
        this.addChild(this._healthBar);
        this.addChild(this._damageParticles);
    }

    public get activeList(): ActiveList {
        return this._activeList;
    }

    public addToActiveList(activeRef: ActiveRef): void {
        this._activeList.add(activeRef);
        this.onAnimAdded();
    }

    public removeFromActiveList(activeRef: ActiveRef): void {
        this._activeList.remove(activeRef);
        this.onAnimEnded();
    }

    public get events(): LocalEvents {
        return this._events;
    }

    public takeDamage(value: number): void {
        if (this._health === 0 || value === 0) return;

        this._health -= value;

        if (this._health <= 0) {
            this._health = 0;
            setTimeout(() => {
                this.onDeath();
            }, 500);
        }
        
        console.log("Enemy: HP ", this._health);
        
        this._colorOverlayFilter.alpha = 1;
        setTimeout(() => {
            this._colorOverlayFadeOutAnim.playing = true;
            this._colorOverlayFadeOutAnim.elapsedTime = 0;
        }, 100);

        this._damageParticles.emitParticle(value);
        this._events.emit('HealthChanged', this._health);
    }

    public free(): void {
        this._healthBar.free();
        this._parent.activeList.remove(this._activeRef);
    }

    private update(deltaMS: number): void {
        if (!this._activeList.empty) {
            this._activeList.update(deltaMS);
        }

        if (this._colorOverlayFadeOutAnim.playing) {
            const a = this._colorOverlayFadeOutAnim;
            a.elapsedTime += deltaMS;
            const t = Math.min(1, a.elapsedTime / a.duration);
            this._colorOverlayFilter.alpha = lerp(a.from, a.to, t);
            if (t >= 1) {
                a.elapsedTime = 0;
                a.playing = false;
            }
        }
    }

    private onAnimAdded(): void {
        if (this._totalActiveAnims === 0) this._parent.activeList.add(this._activeRef);
        this._totalActiveAnims++;
    }

    private onAnimEnded(): void {
        this._totalActiveAnims--;
        if (this._totalActiveAnims === 0) this._parent.activeList.remove(this._activeRef);
    }

    private onDeath(): void {
        Events.emit(Event.ENEMY_DIED);
    }
}