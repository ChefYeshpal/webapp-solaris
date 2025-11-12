import { GameContainer } from './game-container.js';
import { Player } from './player.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.gameContainer = new GameContainer(this.canvas);
        this.player = new Player(this.gameContainer.width, this.gameContainer.height);
        this.lastTime = 0;
        this.start();
    }

    start() {
        this.gameLoop(0);
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.gameContainer.update();
        this.player.update();

        this.gameContainer.draw();
        this.player.draw(this.gameContainer.ctx);

        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

window.addEventListener('load', () => {
    new Game();
});
