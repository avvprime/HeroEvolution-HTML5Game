import { Application, Assets, Container, Sprite, type ContainerChild, type Renderer } from "pixi.js";
import GameManager from "./GameManager";
import { Event, Events } from "./managers/EventManager";
import { isMobile } from "./common";
import GUI from "./gui/GUI";
import Enemy from "./enemy/Enemy";
import BoardModel from "./board/BoardModel";
import ScaleManager from "./managers/ScaleManager";
import Loop from "./managers/LoopManager";
import Input from "./managers/InputManager";
import { ActiveList } from "./ActiveList";

export default class Game {

    private _app!: Application;
    private _world!: Container;
    private _gui!: GUI;
    
    private _boardModel!: BoardModel;
    private _enemy!: Enemy; 
    
    private _manager!: GameManager;

    private _activeList: ActiveList;

    private _initialized: boolean = false;

    constructor() {
        this._activeList = new ActiveList();

        this.loadAssets();
    }

    public async init(callback: (canvas: HTMLCanvasElement) => void): Promise<void> {
        this._app = new Application();

        await this._app.init({
            backgroundColor: '#94e6ff',
            width: isMobile ? 615 : 1128,
            height: isMobile ? 1128 : 615,
        });
        this._initialized = true;

        callback(this._app.canvas);
        
        Loop.registerUpdateCallback(this.update.bind(this));
        Loop.start();

    }

    public get activeList(): ActiveList { return this._activeList }

    public addGround(): void {
        const ground = new Sprite(Assets.get('ground'));
        if (isMobile) {
            ground.y = 400;
        }
        else {
            ground.x = 420;
            ground.y = 400;
        }
        this._world.addChild(ground);
    }

    public addEnemy(): void {
        const enemy = new Enemy(this, 100, 'enemy');
        enemy.events.on('Died', () => { /* enemy.events.off('Died', this)  */ } );
        if (isMobile) {
            enemy.x = 200;
            enemy.y = 160;
        } else {
            enemy.x = 600;
            enemy.y = 160;
        }
        this._world.addChild(enemy);
        this._enemy = enemy;
    }

    public addBoardModel(): void {
        this._boardModel = new BoardModel(3, 3);
    }
    
    public logBoardModel(): void {
        this._boardModel.consoleLog();
    }

    public addBoardTile(idx: number, val: number): void {
        this._boardModel.setCell(idx, val);
        Events.emit(Event.BOARD_ADD_TILE, idx, val);
    }

    public makeBoardMove(dir: number): void {
        const moves = this._boardModel.makeMove(dir);
        this._boardModel.consoleLog();

        if (moves.length > 0) Events.emit(Event.BOARD_MOVE, dir, moves);
        
    }

    public damageEnemy(): void {
        //this._enemy.takeDamage(10);
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

            { alias: 'blade', src: 'blade.png' }

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
        this._gui = new GUI(this);
        this._app.stage.addChild(this._world, this._gui);

         ScaleManager.instance.register(this._app.canvas, this._app.renderer);
        ScaleManager.instance.connect(this.onResize.bind(this));
        ScaleManager.instance.setScaleMode('cover');
        isMobile ? ScaleManager.instance.setBaseSize(615, 1128) : ScaleManager.instance.setBaseSize(1128, 615);

        this._manager = new GameManager(this);
    }

    private update(deltaMS: number): void {
        this._activeList.update(deltaMS);
        Input.loopClear();
    }

    private onResize(): void {
        const scale = ScaleManager.instance.scale;
        this._world.scale.set(scale.x, scale.y);
    }

}