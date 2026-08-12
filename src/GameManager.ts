import type BoardModel from "./board/BoardModel";
import { Dir } from "./common";
import Input from "./managers/InputManager";
import type SwipeHandler from "./SwipeHandler";


export default class GameManager {

    private _model: BoardModel;
    private _swipeHandler: SwipeHandler;

    constructor(model: BoardModel, swipeHandler: SwipeHandler) {
        this._model = model;
        this._swipeHandler = swipeHandler;
    }

    private gatherInput(): number {
        this._swipeHandler.update();

        let dir = -1;
        if (this._swipeHandler.dragging) {
            if (this._swipeHandler.dragDist > 30) {
                dir = this._swipeHandler.dragCardinalDir;
                this._swipeHandler.cancelSwipe();
            }
        }
        else {
            if (!this._swipeHandler.isMobile) {
                if (Input.isPressed("Up")) {
                    dir = Dir.Up;
                }
                else if (Input.isPressed("Down")) {
                    dir = Dir.Down
                }
                else if (Input.isPressed("Left")) {
                    dir = Dir.Left
                }
                else if (Input.isPressed("Right")) {
                    dir = Dir.Right;
                }
            }
        }

        return dir;
    }

    public update(): void {
        const dir = this.gatherInput();
        if (dir > -1) console.log(dir);
    }


}