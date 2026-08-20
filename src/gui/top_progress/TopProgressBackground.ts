import { Assets, Container, Sprite, Texture } from "pixi.js";
import { isMobile } from "../../common";


export default class TopProgressBackground extends Container {

    private _bg: Sprite;
    private _shadow!: Sprite;

    constructor(width: number, height: number) {
        super();

        const body = new Sprite(Texture.WHITE);
        body.width = width;
        body.height = height;
        this.addChild(body);
        this._bg = body;

        if (isMobile) return;

        const shadow = new Sprite(Texture.WHITE);
        shadow.tint = 0x000000;
        shadow.alpha = 0.2;
        shadow.width = width * 0.6;
        shadow.height = 6;
        shadow.x = width * 0.4;
        shadow.y = height;

        this._shadow = shadow;

        this.addChild(this._shadow);
    }

    public resize(newParentWidth: number, newParentHeight: number): void {
        this._bg.width = newParentWidth;
        this._bg.height = newParentHeight;

        if (isMobile) return;

        this._shadow.width = newParentWidth * 0.6;
        this._shadow.x = newParentWidth * 0.4 + Assets.get('boardBgCornerTop').width;
        this._shadow.y = newParentHeight;
    }
}