import { Container } from "pixi.js";
import Tile from "./Tile";
import { ActiveList, ActiveRef } from "../../ActiveList";
import type Board from "./Board";


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
    private _visualBoard: (Tile | undefined)[] = [];
    private _tilesToDisappear = new Map<number, Tile>();

    private _holdVec2: { x: number, y: number } = { x: 0, y: 0 }

    private _parent: Board;
    private _activeList: ActiveList;
    private _activeRef: ActiveRef;

    constructor(parent: Board, parentWidth: number, parentHeight: number, rows: number, cols: number) {
        super();

        this._parent = parent;
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

        this._activeList = new ActiveList();
        this._activeRef = new ActiveRef(this.update.bind(this));
        this._parent.activeList.add(this._activeRef);

        this.sortableChildren = true;
    }

    public get activeList(): ActiveList { return this._activeList }

    public makeMove(moves: number[]): void {
        const totalMoves = moves.length / 3;
        for (let i = 0; i < totalMoves; i++) {
            const from = moves[i * 3];
            const to = moves[i * 3 + 1];
            const val = moves[i * 3 + 2];
            this.calcTargetPos(to, this._holdVec2);

            const tileToMove = this._visualBoard[from];

            if (tileToMove === undefined) {
                console.warn("Tiles: No tile found at: ", from);
                continue;
            }

            if (val > 0) this._tilesToDisappear.set(to, this._visualBoard[to]!);
            
            tileToMove.move(this._holdVec2.x, this._holdVec2.y, val, to);
            
            this._visualBoard[from] = undefined;
            this._visualBoard[to] = tileToMove;
        }
    }

    public onMergeTileMoved(tileToDisappearBoardIdx: number): void {
        const tile = this._tilesToDisappear.get(tileToDisappearBoardIdx)!;
        tile.disappear();
        this._tilePool.push(tile);
        this._tilesToDisappear.delete(tileToDisappearBoardIdx);
    }

    public addTile(idx: number, val: number): void {
        const row = Math.floor(idx / this._cols);
        const col = idx % this._cols;
        const x = col * this._stepSize + this._tilePadding;
        const y = row * this._stepSize + this._tilePadding;
        const tile = new Tile(this, x, y, this._tileSize, val);

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

    public free(): void {
        
    }

    private update(deltaMS: number): void {
        this._activeList.update(deltaMS);
    }

    private calcTileSize(width: number): number {
        return ((width - ((this._cols - 1) * this._gap)) / this._cols) * 0.8;
    }

    private calcTargetPos(targetIdx: number, outVec: { x: number, y: number }): void {
        const row = Math.floor(targetIdx / this._cols);
        const col = targetIdx % this._cols;
        outVec.x = this._stepSize * col + this._tilePadding;
        outVec.y = this._stepSize * row + this._tilePadding;
    }
}