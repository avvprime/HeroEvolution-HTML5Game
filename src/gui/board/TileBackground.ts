import { Assets, Container, Sprite } from "pixi.js";

export default class TileBackground extends Container {

    private _relWidth: number = 0.8;
    private _rows: number = 3;
    private _cols: number = 3;
    private _gap: number = 10;
    private _tileColor: number = 0xf2f2f2;

    constructor(parentWidth: number, parentHeight: number, rows: number, cols: number) {
        super();
        
        this._rows = rows;
        this._cols = cols;
        this._gap = parentWidth * 0.01;

        const gap = this._gap;
        
        const width = parentWidth * this._relWidth;
        const tileWidth = (width - ((this._cols - 1) * gap)) / this._cols;

        const texture = Assets.get('boardTile');
        const color = this._tileColor;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = new Sprite(texture);

                tile.width = tileWidth;
                tile.height = tileWidth;

                tile.x = c * (tileWidth + gap);
                tile.y = r * (tileWidth + gap);
                tile.tint = color;
                this.addChild(tile);
            }
        }

        this.x = parentWidth / 2 - width / 2;
        this.y = parentHeight / 2 - width / 2;
    }

    public expand(newRows: number, newCols: number): void {
        this._rows = newRows;
        this._cols = newCols;

        const tileWidth = (this.width - ((this._cols - 1) * this._gap)) / this._cols;

        const oldLength = this.children.length;
        const texture = Assets.get('boardTile');
        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                const idx = r * this._cols + c + 1;
                let tile;

                if (idx > oldLength) {
                    tile = new Sprite(texture);
                    tile.tint = this._tileColor;
                    this.addChild(tile);
                }
                else {
                    tile = this.children[idx - 1]; 
                }
                
                tile.width = tileWidth;
                tile.height = tileWidth;
                tile.x = c * (tileWidth + this._gap);
                tile.y = r * (tileWidth + this._gap);
            }
        }
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        this._gap = newParentWidth * 0.01;
        const gap = this._gap;

        const width = newParentWidth * this._relWidth;
        const tileWidth = (width - ((this._cols - 1) * gap)) / this._cols;

        for (let r = 0; r < this._rows; r++) {
            for (let c = 0; c < this._cols; c++) {
                const tile = this.children[r * this._cols + c];
                tile.width = tileWidth;
                tile.height = tileWidth;
                
                tile.x = c * (tileWidth + gap);
                tile.y = r * (tileWidth + gap);
            }
        }

        this.width = width;
        this.height = width;
        this.x = newParentWidth / 2 - width / 2;
        this.y = newParentHeight / 2 - width / 2;
    }
}