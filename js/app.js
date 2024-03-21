import { GameEngine } from "./GameEngine.js";

const game = new GameEngine();

document.getElementById('play').onclick = () => {
    document.getElementById('menu').classList.remove('show', 'victory', 'failure');
    game.isGameOVer = false;
    game.player !== null ? game.init() : game.run();
}