import { Application, Assets, Cache, Container } from "pixi.js";
import ScaleManager from "./managers/ScaleManager";
import GameManager from "./GameManager";
import Loop from "./managers/LoopManager";
import Input from "./managers/InputManager";
import GUI from "./gui/GUI";
import { Event, Events } from "./managers/EventManager";
import { isMobile } from "./common";

export default class Game {

    private _app: Application;

    private _world!: Container;
    private _gui!: Container;
    private _manager!: GameManager;

    private _initialized: boolean = false;

    
    constructor() {
        this.loadAssets();

        Events.on(Event.GENERATE_TEX_REQ, this.onTexGenRequested.bind(this));

        this._app = new Application();
    }

    public async init(callback: (canvas: HTMLCanvasElement) => void): Promise<void> {
        await this._app.init({
            backgroundColor: '#94e6ff',
            width: isMobile ? 615 : 1128,
            height: isMobile ? 1128 : 615,
        });
        this._initialized = true;

        callback(this._app.canvas);
    }

    public addToWorld(entity: any): void {
        this._world.addChild(entity);
    }

    public removeFromWorld(entity: any): void {
        this._world.removeChild(entity);
    }

    private update(deltaMS: number): void {
        this._manager.update(deltaMS);


        Input.loopClear();
    }

    private loadAssets(): void {
        Assets.load([
            { alias: 'enemy', src: 'enemy.png' },
            
            { alias: 'healthbarUnder', src: 'healthbar-under.png' },
            { alias: 'healthbarValue', src: 'healthbar-value.png' },
            { alias: 'healthbarOver', src: 'healthbar-over.png' },

            { alias: 'boardBgCornerTop', src: 'board-bg-corner-top.png' },
            { alias: 'boardBgCornerBottom', src: 'board-bg-corner-bottom.png' },

            { alias: 'brick', src: 'brick.png' },
            { alias: 'halfBrick', src: 'half-brick.png' },

            { alias: 'boardTile', src: 'board-tile.png' },

            { alias: 'hero1', src: 'hero-1.png' },
            { alias: 'hero2', src: 'hero-2.png' },
            { alias: 'hero3', src: 'hero-3.png' },
            { alias: 'hero4', src: 'hero-4.png' },
            { alias: 'hero5', src: 'hero-5.png' },

            { alias: 'ground', src: 'ground.png' },
        ]).then(() => { this.onAssetsLoaded() });
    }

    private onAssetsLoaded(): void {
        if (!this._initialized) {
            setTimeout(() => {
                this.onAssetsLoaded();
            }, 100);

            return;
        }
        
        this._world = new Container();
        this._app.stage.addChild(this._world);

        this._gui = new GUI();
        this._app.stage.addChild(this._gui);

        this._manager = new GameManager(this);

        ScaleManager.instance.register(this._app.canvas, this._app.renderer);
        ScaleManager.instance.connect(this.onResize.bind(this));
        ScaleManager.instance.setScaleMode('cover');
        if (isMobile) ScaleManager.instance.setBaseSize(615, 1128);
        else ScaleManager.instance.setBaseSize(1128, 615);

        Loop.registerUpdateCallback(this.update.bind(this));
        Loop.start();
    }

    private onResize(): void {
        const scale = ScaleManager.instance.scale;
        this._world.scale.set(scale.x, scale.y);
    }

    private onTexGenRequested(container: Container, texKey: string): void {
        const texture = this._app.renderer.generateTexture(container);
        Cache.set(texKey, texture);
        Events.emit(Event.GENERATE_TEX_RES, texKey, texture);
    }
}