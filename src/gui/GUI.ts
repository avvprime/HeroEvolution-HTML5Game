import { Container, Sprite, Texture } from "pixi.js";
import ScaleManager from "../managers/ScaleManager";
import Board from "./Board";
import TopProgress from "./TopProgress";

const Scale = ScaleManager.instance;

export default class GUI extends Container{
    
    constructor() {
        super();

        Scale.connect(this.onResize.bind(this));

        
        const board = new Board();
        this.addChild(board);
        /*
        const topProgress = new TopProgress();
        this.addChild(topProgress);*/

        const topLeft = new Sprite(Texture.WHITE);
        topLeft.tint = 'red';
        topLeft.width = 32;
        topLeft.height = 32;
        this.addChild(topLeft);
    }

    private onResize(newScreenWidth: number, newScreenHeight: number): void {
        const clientSize = ScaleManager.instance.clientSize;
        const dx = ((clientSize.width - newScreenWidth) / 2) * -1;
        const dy = ((clientSize.height - newScreenHeight) / 2) * -1;

        this.x = dx;
        this.y = dy;

        const totalChildren = this.children.length;
        for (let i = 0; i < totalChildren; i++) {
            
        }
    }
}