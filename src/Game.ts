import { Application, Assets, Cache, Container, Sprite } from "pixi.js";
import ScaleManager from "./managers/ScaleManager";
import BoardModel from "./board/BoardModel";
import GameManager from "./GameManager";
import SwipeHandler from "./SwipeHandler";
import Loop from "./managers/LoopManager";
import Input from "./managers/InputManager";
import GUI from "./gui/GUI";
import { Event, Events } from "./managers/EventManager";

export default class Game {

    private _app: Application;

    private _world!: Container;
    private _gui!: Container;
    
    private _model: BoardModel;
    private _swipeHandler: SwipeHandler;
    private _manager!: GameManager;

    private _initialized: boolean = false;

    
    constructor() {
        this.loadAssets();

        Events.on(Event.GENERATE_TEX_REQ, this.onTexGenRequested.bind(this));

        this._app = new Application();

        this._swipeHandler = new SwipeHandler();

        this._model = new BoardModel(3, 3);
        this._model.setCell(0, 1);
        this._model.setCell(1, 1);
        this._model.setCell(2, 1)
        this._model.setCell(3, 1);
        this._model.consoleLog();

    }

    public async init(callback: (canvas: HTMLCanvasElement) => void): Promise<void> {
        await this._app.init({
            backgroundColor: '#94e6ff',
            width: 1128,
            height: 615,
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

    public addChild(entity: any): void {
        this._app.stage.addChild(entity);
    }

    public removeChild(entity: any): void {
        this._app.stage.removeChild(entity);
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

        this._manager = new GameManager(this, this._model, this._swipeHandler);

        const ground = new Sprite(Assets.get('ground'));
        ground.x = 420;
        ground.y = 400;
        this._world.addChild(ground);


        ScaleManager.instance.register(this._app.canvas, this._app.renderer);
        ScaleManager.instance.connect(this.onResize.bind(this));
        ScaleManager.instance.setScaleMode('cover');
        ScaleManager.instance.setBaseSize(1128, 615);

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