import type BoardModel from "./board/BoardModel";
import { Dir, isMobile } from "./common";
import Enemy from "./enemy/Enemy";
import type Game from "./Game";
import Input from "./managers/InputManager";
import type SwipeHandler from "./SwipeHandler";


export default class GameManager {

    private _model: BoardModel;
    private _swipeHandler: SwipeHandler;
    private _enemy: Enemy;

    private _onEnemyDied = () => {
        this._enemy.events.off('Died', this._onEnemyDied);
    }

    constructor(game: Game, model: BoardModel, swipeHandler: SwipeHandler) {
        this._model = model;
        this._swipeHandler = swipeHandler;

        this._enemy = new Enemy(100, 'enemy');
        this._enemy.events.on('Died', this._onEnemyDied);
        if (isMobile) {
            this._enemy.y = 160;
        }else {
            this._enemy.x = 600;
            this._enemy.y = 160;
        }

        game.addToWorld(this._enemy);
    }

    public update(deltaMS: number): void {
        const dir = this.gatherInput();
        if (dir !== -1) {
            const moves = this._model.makeMove(dir);
            //this._model.consoleLog();
            this._enemy.takeDamage(10);
        }


        this._enemy.update(deltaMS);
        
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