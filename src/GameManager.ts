
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

    private _moveQueue: number[] = [];
    private _moveThreshold: number = 100;
    private _moveTime: number = 0;

    private _hitWaitTime: number = 1000;
    private _currentHitTime: number = 0;

    private _boundEventListeners: Record<Event, ((...args: any[]) => void)> = {}

    private _enabled: boolean = true;

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
        this._game.addBoardTile(4, 1);
        this._game.addBoardTile(5, 1);
        this._game.addBoardTile(6, 2);
        this._game.addBoardTile(7, 3);
        this._game.addBoardTile(8, 3);
        this._game.logBoardModel();

        this.addEventListeners();
    }

    public free(): void {
        this.removeEventListeners();
    }

    private addEventListeners(): void {
        this._boundEventListeners[Event.ENEMY_DIED] = this.onEnemyDied.bind(this);

        for (const key of Object.keys(this._boundEventListeners)) {
            const parsedKey = parseInt(key);
            Events.on(parsedKey, this._boundEventListeners[parsedKey])
        }
    }

    private removeEventListeners(): void {
        for (const key of Object.keys(this._boundEventListeners)) {
            const parsedKey = parseInt(key);
            Events.off(parsedKey, this._boundEventListeners[parsedKey])
        }
    }

    private update(deltaMS: number): void {
        if (!this._enabled) return;

        this._moveTime += deltaMS;
        const dir = this.gatherInput();

        if (this._moveQueue.length > 0) {
            if (this._moveTime > this._moveThreshold) {
                const dir = this._moveQueue.pop()!;
                this._game.makeBoardMove(dir);
                this._game.damageEnemy();
                this._moveTime = 0;
            }
        }

        if (dir !== -1) {
            if (this._moveTime > this._moveThreshold) {
                this._game.makeBoardMove(dir);
                this._game.damageEnemy();
                this._moveTime = 0;
            }
            else {
                if (this._moveQueue.length < 2) {
                    this._moveQueue.push(dir);
                }
            }
        }

        this._currentHitTime += deltaMS;
        if (this._currentHitTime >= this._hitWaitTime) {
            this._currentHitTime = 0;
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

    private onEnemyDied(): void {

    }


}