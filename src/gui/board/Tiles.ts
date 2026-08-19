import { Container } from "pixi.js";
import type Tile from "./Tile";


export default class Tiles extends Container {

    private _relWidth: number = 0.8;

    private _rows: number = 3;
    private _cols: number = 3;
    private _gap: number = 10;
    private _stepSize: number = 0;

    private _tiles: Tile[] = [];
    private _visualBoard: Tile[] = [];

    constructor(parentWidth: number, parentHeight: number, rows: number, cols: number) {
        super();

        this._rows = rows;
        this._cols = cols;

        this._gap = parentWidth * 0.01;
        
        this.width = parentWidth * this._relWidth;
        this.height = this.width;

        this._stepSize = this.width / rows;

        this.x = parentWidth / 2 - this.width / 2;
        this.y = parentHeight / 2 - this.height / 2;
    }

    public addTile(idx: number, val: number): void {

    }


    public resize(newParentWidth: number, newParentHeight: number): void {
        this._gap = newParentWidth * 0.01;

        this.width = newParentWidth * this._relWidth;
        this.height = this.width;

        this.x = newParentWidth / 2 - this.width / 2;
        this.y = newParentHeight / 2 - this.height / 2;

        
        // only this sets child size directly to avoid duplicate calcs
        const tileWidth = (this.width - ((this._cols - 1) * this._gap)) / this._cols;
        const totalTiles = this._tiles.length;
        for (let i = 0; i < totalTiles; i++) this._tiles[i].resize(tileWidth);

    }
}