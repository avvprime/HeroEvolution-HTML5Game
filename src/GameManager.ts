import type BoardModel from "./board/BoardModel";
import type SwipeHandler from "./SwipeHandler";


export default class GameManager {
    
    private _model: BoardModel;
    private _swipeHandler: SwipeHandler;
    
    constructor(model: BoardModel, swipeHandler: SwipeHandler) {
        this._model = model;
        this._swipeHandler = swipeHandler;
    }

    private gatherInput(): void {
        
    }

    public update(): void {
        this._swipeHandler.update();


        if (this._swipeHandler.dist > 0) {
            console.log("drag")
        }  
    }

    
}