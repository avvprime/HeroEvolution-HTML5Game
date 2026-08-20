import { Container } from "pixi.js";
import Tile from "./Tile";


export default class Tiles extends Container {

    private _parentWidth: number = 0;
    private _parentHeight: number = 0;
    private _relWidth: number = 0.8;

    private _rows: number = 3;
    private _cols: number = 3;
    private _gap: number = 10;
    private _stepSize: number = 0; // dist from one tile to other
    private _tileSize: number = 0; // hero size
    private _tilePadding: number = 0;

    private _tiles: Tile[] = [];
    private _tilePool: Tile[] = [];
    private _visualBoard: Tile[] = [];

    constructor(parentWidth: number, parentHeight: number, rows: number, cols: number) {
        super();

        this._parentWidth = parentWidth;
        this._parentHeight = parentHeight;
        this._rows = rows;
        this._cols = cols;

        this._gap = parentWidth * 0.01;

        const width = parentWidth * this._relWidth;

        this._stepSize = width / rows;
        this._tileSize = this.calcTileSize(width);
        this._tilePadding = (this._stepSize - this._tileSize) / 2;

        this.x = parentWidth / 2 - width / 2;
        this.y = parentHeight / 2 - width / 2;
    }

    public addTile(idx: number, val: number): void {
        const row = Math.floor(idx / this._cols);
        const col = idx % this._cols;
        const x = col * this._stepSize + this._tilePadding;
        const y = row * this._stepSize + this._tilePadding;
        const tile = new Tile(x, y, this._tileSize, val);

        this.addChild(tile);
        this._tiles.push(tile);
        this._visualBoard[idx] = tile;
    }

    public expand(newRows: number, newCols: number): void {
        this._rows = newRows;
        this._cols = newCols;
        this.resize(this._parentWidth, this._parentHeight);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        this._parentWidth = newParentWidth;
        this._parentHeight = newParentHeight;

        const width = newParentWidth * this._relWidth;

        this._gap = newParentWidth * 0.01;

        this._stepSize = width / this._cols;
        this._tileSize = this.calcTileSize(width);
        this._tilePadding = (this._stepSize - this._tileSize) / 2;

        this.x = newParentWidth / 2 - width / 2;
        this.y = newParentHeight / 2 - width / 2;


        // only this sets child size directly to avoid duplicate calcs
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                const idx = r * this._cols + c;
                if (this._visualBoard[idx] === undefined) continue;
                
                const tile = this._visualBoard[idx];
                const x = c * this._stepSize + this._tilePadding;
                const y = r * this._stepSize + this._tilePadding;
                tile.resize(x, y, this._tileSize);
            }
        }

        const totalPoolTiles = this._tilePool.length;
        for (let i = 0; i < totalPoolTiles; i++) {
            this._tilePool[i].resize(0, 0, this._tileSize);
        }

    }

    private calcTileSize(width: number): number {
        return ((width - ((this._cols - 1) * this._gap)) / this._cols) * 0.8;
    }
}