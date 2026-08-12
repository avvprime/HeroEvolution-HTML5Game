import BoardModel from './board/BoardModel'
import { Dir } from './common';
import Input from './managers/InputManager';
import Loop from './managers/LoopManager';

import './style.css'


const model = new BoardModel(5, 5);
model.setCell(0, 1);
model.setCell(1, 1);
model.setCell(2, 1)
model.setCell(3, 1);
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
    const moves = model.makeMove(Dir.Right);
    //console.log("moves")
    //console.log(moves)
    afterMove()
  }


  Input.loopClear();
}


function afterMove(): void {
  const emptyTiles = model.getEmptyTiles();
  const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  //model.setCell(randomTile, 1);

  //console.log("new")
  model.consoleLog();
  /*
  console.log("history");
  const data = model.getHistory(3);
  if (data === undefined) return;
  model.consoleLog(data);*/
}
