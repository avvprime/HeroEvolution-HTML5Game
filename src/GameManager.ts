
import { ActiveRef } from "./ActiveList";
import { Dir } from "./common";
import type Game from "./Game";
import { Event, Events } from "./managers/EventManager";
import Input from "./managers/InputManager";
import SwipeHandler from "./SwipeHandler";


export default class GameManager {

    
    private _swipeHandler: SwipeHandler;

    private _game: Game;
    private _activeRef: ActiveRef;

    constructor(game: Game) {
        this._game = game;
        
        this._swipeHandler = new SwipeHandler();
        
        this._activeRef = new ActiveRef(this.update.bind(this));
        this._game.activeList.add(this._activeRef);
        
        this._game.addBoardModel();
        this._game.addEnemy();
        this._game.addGround();


        this._game.addBoardTile(0, 1);
        this._game.addBoardTile(1, 1);
        this._game.addBoardTile(2, 1)
        this._game.addBoardTile(3, 1);
        this._game.logBoardModel();
    }

    private update(): void {
        const dir = this.gatherInput();
        if (dir !== -1) {
            this._game.makeBoardMove(dir);
            this._game.damageEnemy();
        }

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

    


}