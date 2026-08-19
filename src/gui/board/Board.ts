import { Container} from "pixi.js";
import BoardBackground from "./BoardBackground";
import TileBackground from "./TileBackground";


export default class Board extends Container{

    private _relWidth: number = 0.4;
    private _relHeight: number = 1;

    private _bg: BoardBackground;
    private _tileBg: TileBackground;

    constructor(parentWidth: number, parentHeight: number, rows: number, cols: number) {
        super();

        const width = parentWidth * this._relWidth;
        const height = parentHeight * this._relHeight;

        this._bg = new BoardBackground(width, height);
        this._tileBg = new TileBackground(width, height, rows, cols);

        this.addChild(this._bg);
        this.addChild(this._tileBg);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        const width = newParentWidth * this._relWidth;
        const height = newParentHeight * this._relHeight;

        this._bg.resize(width, height);
        this._tileBg.resize(width, height);
    }


}