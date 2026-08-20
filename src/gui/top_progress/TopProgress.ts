import { Container } from "pixi.js";
import TopProgressBackground from "./TopProgressBackground";
import { isMobile } from "../../common";


export default class TopProgress extends Container{

    private _relWidth: number = 1;
    private _relHeight: number = 0.1;

    private _bg!: TopProgressBackground;

    constructor(parentWidth: number, parentHeight: number) {
        super();


        this._bg = new TopProgressBackground(parentWidth, parentHeight * this._relHeight);
        this.addChild(this._bg);

        if (!isMobile) return;

        this.y = -(parentHeight * this._relHeight);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        const width = newParentWidth * this._relWidth;
        const height = newParentHeight * this._relHeight;
        this._bg.resize(width, height);
    }

}