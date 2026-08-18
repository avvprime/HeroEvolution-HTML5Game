import { Assets, Container, Sprite, Texture } from "pixi.js";
import BaseGuiObject from "./BaseGUIObject";


export default class Board extends Container{

    private _bg!: Container;

    constructor() {
        super();

        this.generateBackground(430, 615);
        this.addChild(this._bg)
    }

    private generateBackground(width: number, height: number): void {
        this._bg = new Container();

        const bodyShadow = new Sprite(Texture.WHITE);
        bodyShadow.tint = 0x000000;
        bodyShadow.alpha = 0.2;
        bodyShadow.width = 6;
        bodyShadow.height = height - 140;
        bodyShadow.x = width;
        bodyShadow.y = 144;


        const body = new Sprite(Texture.WHITE);
        body.width = width;
        body.height = height;

        this._bg.addChild(bodyShadow);
        this._bg.addChild(body);

        const cornerTop = new Sprite(Assets.get('boardBgCorner'));
        cornerTop.x = width;
        cornerTop.y = 60;

        this._bg.addChild(cornerTop);
    }


}