import { Container, Sprite, Texture } from "pixi.js";
import ScaleManager from "../managers/ScaleManager";
import Board from "./board/Board";
import TopProgress from "./top_progress/TopProgress";
import { ActiveList, ActiveRef } from "../ActiveList";
import type Game from "../Game";
import { Event, Events } from "../managers/EventManager";


const Scale = ScaleManager.instance;

export default class GUI extends Container{

    private _activeRef: ActiveRef;
    private _activeList: ActiveList;

    private _board: Board;
    private _topProgress: TopProgress;

    private _parent: Game;

    private _boundEventListeners: Record<Event, ((...args: any[]) => void)> = {}

    constructor(parent: Game) {
        super();
        
        this._parent = parent;

        this._activeRef = new ActiveRef(this.update.bind(this));
        parent.activeList.add(this._activeRef);

        this._activeList = new ActiveList();

        Scale.connect(this.onResize.bind(this));
        const clientSize = Scale.clientSize;

        this._topProgress = new TopProgress(clientSize.width, clientSize.height);
        this.addChild(this._topProgress);

        this._board = new Board(this, clientSize.width, clientSize.height, 3, 3);
        this.addChild(this._board);

        this._boundEventListeners[Event.BOARD_MOVE] = this.onBoardMove.bind(this);

        this.addEventListeners();

        /* // mark
        const topLeft = new Sprite(Texture.WHITE);
        topLeft.tint = 'red';
        topLeft.width = 32;
        topLeft.height = 32;
        this.addChild(topLeft);*/
    }

    public get activeList(): ActiveList { return this._activeList }

    public free(): void {
        this._board.free();
        this._parent.activeList.remove(this._activeRef);
        this.removeEventListeners();
    }

    private addEventListeners(): void {
        for (const key of Object.keys(this._boundEventListeners)) {
            const parsedKey = parseInt(key);
            Events.on(parsedKey, this._boundEventListeners[parsedKey])
        }
    }

    private removeEventListeners(): void {
        for (const key of Object.keys(this._boundEventListeners)) {
            const parsedKey = parseInt(key);
            Events.off(parsedKey, this._boundEventListeners[parsedKey])
        }
    }

    private update(deltaMS: number): void {
        this._activeList.update(deltaMS);
    }

    private onBoardMove(_dir: number, moves: number[]): void {
        this._board.makeMove(moves);
    }

    private onResize(newScreenWidth: number, newScreenHeight: number): void {
        const clientSize = ScaleManager.instance.clientSize;
        const dx = ((clientSize.width - newScreenWidth) / 2) * -1;
        const dy = ((clientSize.height - newScreenHeight) / 2) * -1;

        this.x = dx;
        this.y = dy;

        this._board.resize(clientSize.width, clientSize.height);       
        this._topProgress.resize(clientSize.width, clientSize.height); 
    }
}