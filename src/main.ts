import BoardModel from './board/BoardModel'
import { Dir } from './common';
import Input from './managers/InputManager';
import Loop from './managers/LoopManager';

import './style.css'


const model = new BoardModel(3, 5);
for (let i = 0; i < 6; i++) model.setCell(i, 1);
model.consoleLog();

Loop.registerUpdateCallback(update);
Loop.start();

function update(deltaMS: number): void {
  if (Input.isPressed("Up")) {
    model.makeMove(Dir.Up);
    afterMove()
  }
  else if (Input.isPressed("Down")) {
    model.makeMove(Dir.Down);
    afterMove()
  }
  else if (Input.isPressed("Left")) {
    model.makeMove(Dir.Left);
    afterMove()
  }
  else if (Input.isPressed("Right")) {
    model.makeMove(Dir.Right);
    afterMove()
  }


  Input.loopClear();
}


function afterMove(): void {
  model.consoleLog();
}
