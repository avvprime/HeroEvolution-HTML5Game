import { Assets, Container, Sprite } from "pixi.js";
import { isMobile } from "../common";

export default class ScoreBar extends Container {
    
    private _relWidth: number = 0.8; // auto height
    private _heightToWidthRatio: number = 0;

    private _bg: Sprite;

    constructor(parentWidth: number, parentHeight: number) {
        super();

        this._bg = new Sprite(Assets.get('blade'));
        this.addChild(this._bg);

        this._heightToWidthRatio = this._bg.height / this._bg.width;

        this.adjustSize(parentWidth, parentHeight);
        this.adjustPosition(parentWidth, parentHeight);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        this.adjustSize(newParentWidth, newParentHeight);
        this.adjustPosition(newParentWidth, newParentHeight);
    }

    private adjustSize(width: number, _height: number): void {
        this._bg.width = width * this._relWidth;
        this._bg.height = this._bg.width * this._heightToWidthRatio;
    }

    private adjustPosition(width: number, height: number): void {
        if (isMobile) {
            this.x = width / 2 - this._bg.width / 2;
            this.y = -height * 0.1;
        }
        else {
            this.x = width / 2 - this._bg.width / 2;
            this.y = height * 0.05;
        }
        
    }
}