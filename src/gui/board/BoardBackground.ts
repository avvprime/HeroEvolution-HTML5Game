import { Assets, Container, Sprite, Texture } from "pixi.js";
import { isMobile } from "../../common";



export default class BoardBackground extends Container {

    private _bg!: Sprite;
    private _bgShadow!: Sprite;

    private _cornerTop!: Sprite;
    private _cornerBottom!: Sprite;

    private _brickGroup: Container[] = [];

    constructor(width: number, height: number) {
        super();



        const body = new Sprite(Texture.WHITE);
        body.width = width;
        body.height = height;
        this.addChild(body);
        this._bg = body;

        if (isMobile) {

            return;
        }

        
        const bodyShadow = new Sprite(Texture.WHITE);
        bodyShadow.tint = 0x000000;
        bodyShadow.alpha = 0.2;
        bodyShadow.width = 6;
        bodyShadow.height = height
        bodyShadow.x = width;
        this.addChild(bodyShadow);
        this._bgShadow = bodyShadow;
        

        

        const cornerTop = new Sprite(Assets.get('boardBgCornerTop'));
        cornerTop.x = width;
        cornerTop.y = height * 0.1;

        const cornerBottom = new Sprite(Assets.get('boardBgCornerBottom'));
        cornerBottom.x = width;
        cornerBottom.y = height - cornerBottom.height;

        this.addChild(cornerTop);
        this.addChild(cornerBottom);

        this.addBricks();

        this._cornerTop = cornerTop;
        this._cornerBottom = cornerBottom;

        /*
        Events.on(Event.GENERATE_TEX_RES, (key: string, texture: Texture) => {
            if (key !== 'boardBg') return;
            for (let i = this.children.length - 1; i > -1; i--) this.removeChildAt(i);

            this._sprite = new Sprite(texture);
            this.addChild(this._sprite);
        });
        Events.emit(Event.GENERATE_TEX_REQ, this, 'boardBg');*/
    }

    public resize(width: number, height: number): void {

        this._bg.width = width;
        this._bg.height = height;

        if (isMobile) {
            return;
        }

        this._cornerTop.x = width;
        this._cornerTop.y = height * 0.1;

        this._cornerBottom.x = width;
        this._cornerBottom.y = height - this._cornerBottom.height;

        this._bgShadow.x = width;
        this._bgShadow.y = height * 0.1 + this._cornerTop.height;
        this._bgShadow.height = height - ((height * 0.1) + this._cornerTop.height + this._cornerBottom.height);

        const bricksTop = this._brickGroup[0];

        bricksTop.width = width * 0.3;
        bricksTop.height = height * 0.11;
        bricksTop.x = width * 0.1;
        bricksTop.y = height * 0.1;
        //bricksTop.width = width * (isMobile ? 0.1 : 0.3);
        //bricksTop.height = height * (isMobile ? 0.05 : 0.11);
        //bricksTop.x = width * (isMobile ? 0.01 : 0.1);
        //bricksTop.y = height * (isMobile ? 0.05: 0.1);

        const bricksBottom = this._brickGroup[1];

        bricksBottom.width = width * 0.3;
        bricksBottom.height = height * 0.11;
        bricksBottom.x = width * 0.5;
        bricksBottom.y = height * 0.85;
    }

    private addBricks(): void {
        const brickTexture = Assets.get('brick');
        const halfBrickTexture = Assets.get('halfBrick');
        const brickColor = 0xedf2f5;

        const brickOne = new Sprite(brickTexture);
        brickOne.tint = brickColor;
        brickOne.x = 0;
        brickOne.y = 0;

        const brickTwo = new Sprite(brickTexture);
        brickTwo.tint = brickColor;
        brickTwo.x = 75;
        brickTwo.y = 0;

        const brickThree = new Sprite(halfBrickTexture);
        brickThree.tint = brickColor;
        brickThree.x = 52;
        brickThree.y = -33;
        brickThree.scale.x = 1.2;


        const brickFour = new Sprite(brickTexture);
        brickFour.tint = brickColor;
        brickFour.x = 0;
        brickFour.y = 0;

        const brickFive = new Sprite(brickTexture);
        brickFive.tint = brickColor;
        brickFive.x = 75;
        brickFive.y = 0;

        const brickSix = new Sprite(brickTexture);
        brickSix.tint = brickColor;
        brickSix.x = 40;
        brickSix.y = 34;


        const cont1 = new Container();
        cont1.addChild(brickOne, brickTwo, brickThree);

        const cont2 = new Container();
        cont2.addChild(brickFour, brickFive, brickSix);

        this.addChild(cont1, cont2);
        this._brickGroup.push(cont1, cont2);
    }
}