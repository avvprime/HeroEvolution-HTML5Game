import { Container, Sprite, Texture } from "pixi.js";
import ScaleManager from "../managers/ScaleManager";
import Board from "./board/Board";
import TopProgress from "./top_progress/TopProgress";


const Scale = ScaleManager.instance;

export default class GUI extends Container{

    private _board: Board;
    private _topProgress: TopProgress;

    constructor() {
        super();

        Scale.connect(this.onResize.bind(this));
        const clientSize = Scale.clientSize;

        this._topProgress = new TopProgress();
        this.addChild(this._topProgress);

        
        this._board = new Board(clientSize.width, clientSize.height, 3, 3);
        this.addChild(this._board);


        /* // mark
        const topLeft = new Sprite(Texture.WHITE);
        topLeft.tint = 'red';
        topLeft.width = 32;
        topLeft.height = 32;
        this.addChild(topLeft);*/
    }

    private onResize(newScreenWidth: number, newScreenHeight: number): void {
        const clientSize = ScaleManager.instance.clientSize;
        const dx = ((clientSize.width - newScreenWidth) / 2) * -1;
        const dy = ((clientSize.height - newScreenHeight) / 2) * -1;

        this.x = dx;
        this.y = dy;

        this._board.resize(clientSize.width, clientSize.height);       
        this._topProgress.resize(clientSize.width, clientSize.height); 
    }
}