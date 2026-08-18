import { Container, Sprite, Texture } from "pixi.js";


export default class TopProgress extends Container{

    private _bg!: Container;

    constructor() {
        super();
        
        this.generateBackground(1128, 60);
        this.addChild(this._bg);
    }


    private generateBackground(width: number, height: number): void {
        this._bg = new Container();

        const body = new Sprite(Texture.WHITE);
        body.width = width;
        body.height = height;

        const shadow = new Sprite(Texture.WHITE);
        shadow.tint = 0x000000;
        shadow.alpha = 0.2;
        shadow.width = 800;
        shadow.height = 6;
        shadow.x = 487;
        shadow.y = height;

        this._bg.addChild(body);
        this._bg.addChild(shadow);
    }
}