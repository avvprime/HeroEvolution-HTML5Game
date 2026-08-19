import { Container} from "pixi.js";
import BoardBackground from "./BoardBackground";


export default class Board extends Container{

    private _relWidth: number = 0.4;
    private _relHeight: number = 1;

    private _bg!: BoardBackground;

    constructor(parentWidth: number, parentHeight: number) {
        super();

        this._bg = new BoardBackground(parentWidth * this._relWidth, parentHeight * this._relHeight);
        this.addChild(this._bg)
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        const width = newParentWidth * this._relWidth;
        const height = newParentHeight * this._relHeight;
        this._bg.resize(width, height);
    }


}