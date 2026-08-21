import { Container} from "pixi.js";
import BoardBackground from "./BoardBackground";
import TileBackground from "./TileBackground";
import Tiles from "./Tiles";
import { isMobile } from "../../common";
import { Event, Events } from "../../managers/EventManager";
import { ActiveList, ActiveRef } from "../../ActiveList";
import type GUI from "../GUI";


export default class Board extends Container{

    private _relWidth: number = 0.4;
    private _relHeight: number = 1;

    private _bg: BoardBackground;
    private _tileBg: TileBackground;
    private _tiles: Tiles;

    private _activeList: ActiveList;
    private _activeRef: ActiveRef;

    private _parent: GUI;

    constructor(parent: GUI, parentWidth: number, parentHeight: number, rows: number, cols: number) {
        super();

        this._parent = parent;
        this._activeList = new ActiveList();
        this._activeRef = new ActiveRef(this.update.bind(this));
        this._parent.activeList.add(this._activeRef);

        if (isMobile) {
            this._relWidth = 1;
            this._relHeight = 0.5;
            this.y = parentHeight - (parentHeight * this._relHeight);
        }
        else {
            this._relWidth = 0.4;
            this._relHeight = 1;
        }

        const width = parentWidth * this._relWidth;
        const height = parentHeight * this._relHeight;

        this._bg = new BoardBackground(width, height);
        this._tileBg = new TileBackground(width, height, rows, cols);
        this._tiles = new Tiles(this, width, height, rows, cols);

        this.addChild(this._bg);
        this.addChild(this._tileBg);
        this.addChild(this._tiles);

        /*
        setTimeout(() => {
            this._tileBg.expand(4, 4);
            this._tiles.expand(4, 4);
        }, 1000);*/
    }

    public get activeList(): ActiveList { return this._activeList }

    public addTile(idx: number, val: number): void {
        this._tiles.addTile(idx, val);
    }

    public makeMove(moves: number[]): void {
        this._tiles.makeMove(moves);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        const width = newParentWidth * this._relWidth;
        const height = newParentHeight * this._relHeight;

        this._bg.resize(width, height);
        this._tileBg.resize(width, height);
        this._tiles.resize(width, height);
    }

    public free(): void {
        this._parent.activeList.remove(this._activeRef);
    }

    private update(deltaMS: number): void {
        this._activeList.update(deltaMS);
    }
}   