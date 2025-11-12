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
        const horizontalSpacing = 80;
        const verticalSpacing = 100;
        const startY = 50;

        // Generate symmetrical enemy patterns
        // Lines: 1-3 (always less than 4)
        // Enemies per line: 1-4 (always less than 5)
        const numLines = Math.floor(Math.random() * 3) + 1;

        for (let line = 0; line < numLines; line++) {
            const numEnemiesInLine = Math.floor(Math.random() * 4) + 1;
            const lineY = startY + (line * verticalSpacing);
            
            // Calculate starting X to center the line
            const totalLineWidth = (numEnemiesInLine - 1) * horizontalSpacing;
            const centerX = gameWidth / 2;
            const startX = centerX - (totalLineWidth / 2);

            // Create enemies symmetrically in THIS, THIS VERY SPECIFIC line
            for (let i = 0; i < numEnemiesInLine; i++) {
                const enemyX = startX + (i * horizontalSpacing);
                this.enemies.push(new Enemy(enemyX, lineY));
            }
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
