import BoardModel from './board/BoardModel'
import { Dir } from './common';
import GameManager from './GameManager';

import Input from './managers/InputManager';
import Loop from './managers/LoopManager';
import SwipeHandler from './SwipeHandler';

import './style.css'


const model = new BoardModel(3, 3);
model.setCell(0, 1);
model.setCell(1, 1);
model.setCell(2, 1)
model.setCell(3, 1);
model.consoleLog();

const gameManager = new GameManager(model, new SwipeHandler());

Loop.registerUpdateCallback(update);
Loop.start();

function update(deltaMS: number): void {

  gameManager.update();

  Input.loopClear();
}

