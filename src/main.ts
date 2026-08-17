
import './style.css'
import Game from './Game';

const game = new Game();
game.init((canvas: HTMLCanvasElement) => { document.getElementById('app')?.appendChild(canvas)});

