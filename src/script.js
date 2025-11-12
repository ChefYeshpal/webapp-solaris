import { GameContainer } from './game-container.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.gameContainer = new GameContainer(this.canvas);
        this.player = new Player(this.gameContainer.width, this.gameContainer.height);
        this.enemies = [];
        this.lastTime = 0;
        this.initEnemies();
        this.start();
    }

    initEnemies() {
        const gameWidth = this.gameContainer.width;
        const spacing = 100;
        const startX = (gameWidth / 2) - (spacing);
        const startY = 50;

        // 3 enemy's for now, ima probably have to change this later on because it needs to variable
        for (let i = 0; i < 3; i++) {
            this.enemies.push(new Enemy(startX + (i * spacing), startY));
        }
    }

    start() {
        this.gameLoop(0);
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.gameContainer.update();
        this.player.update();
    
        this.enemies.forEach(enemy => {
            enemy.update(this.gameContainer.width);
        });

        this.checkCollisions();

        this.gameContainer.draw();
        this.player.draw(this.gameContainer.ctx);
        
        this.enemies.forEach(enemy => {
            enemy.draw(this.gameContainer.ctx);
        });

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    checkCollisions() {
        for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.player.projectiles[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                if (enemy.checkCollision(projectile)) {
                    // Remove projectile and enemy
                    this.player.projectiles.splice(i, 1);
                    this.enemies.splice(j, 1);
                    break;
                }
            }
        }
    }
}

window.addEventListener('load', () => {
    new Game();
});
