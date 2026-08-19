import { Container, Sprite, Texture } from "pixi.js";
import TopProgressBackground from "./TopProgressBackground";


export default class TopProgress extends Container{

    private _relWidth: number = 1;
    private _relHeight: number = 0.1;

    private _bg!: TopProgressBackground;

    constructor() {
        super();
        
        this._bg = new TopProgressBackground(1128, 100);
        this.addChild(this._bg);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        const width = newParentWidth * this._relWidth;
        const height = newParentHeight * this._relHeight;
        this._bg.resize(width, height);
    }

}