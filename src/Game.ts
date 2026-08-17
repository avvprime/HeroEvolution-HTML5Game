import { Application, Assets, Container } from "pixi.js";
import ScaleManager from "./managers/ScaleManager";
import BoardModel from "./board/BoardModel";
import GameManager from "./GameManager";
import SwipeHandler from "./SwipeHandler";
import Loop from "./managers/LoopManager";
import Input from "./managers/InputManager";
import type Enemy from "./enemy/Enemy";

export default class Game {

    private _app: Application;
    private _model: BoardModel;
    private _swipeHandler: SwipeHandler;
    private _manager!: GameManager;

    private _initialized: boolean = false;

    constructor() {
        this.loadAssets();

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
            backgroundColor: 'lightblue',
            width: 1128,
            height: 615,
        });
        this._initialized = true;

        ScaleManager.instance.register(this._app.canvas, this._app.renderer);
        ScaleManager.instance.setBaseSize(1128, 615);

        callback(this._app.canvas);
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
        ]).then(() => { this.onAssetsLoaded() });
    }

    private onAssetsLoaded(): void {
        if (!this._initialized) {
            setTimeout(() => {
                this.onAssetsLoaded();
            }, 100);

            return;
        }

        this._manager = new GameManager(this, this._model, this._swipeHandler);

        Loop.registerUpdateCallback(this.update.bind(this));
        Loop.start();
    }
}