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
        this.level = 0;
        this.score = 0;
        this.countdownActive = false;
        this.countdownTime = 0;
        this.countdownDuration = 5000;
        
        // UI Elements
        this.scoreElement = document.getElementById('scoreValue');
        this.levelElement = document.getElementById('levelValue');
        
        this.initEnemies();
        this.updateUI();
        this.start();
    }

    initEnemies() {
        const gameWidth = this.gameContainer.width;
        const horizontalSpacing = 80;
        const verticalSpacing = 100;
        const startY = 50;

        let totalEnemies;
        if (this.level === 0) {
            totalEnemies = 3;
        } else if (this.level === 1) {
            totalEnemies = 4;
        } else {
            totalEnemies = 7;
        }

        // Generate symmetrical enemy patterns
        // Lines: 1-3 (always less than 4)
        // Enemies per line: distributed to match total count while maintaining symmetry
        const numLines = Math.floor(Math.random() * 3) + 1; // 1-3 lines

        // Distribute enemies across lines as symmetrically as possible
        const enemiesPerLine = Math.ceil(totalEnemies / numLines);
        let enemiesPlaced = 0;

        for (let line = 0; line < numLines && enemiesPlaced < totalEnemies; line++) {
            const remainingEnemies = totalEnemies - enemiesPlaced;
            let numEnemiesInLine = Math.min(enemiesPerLine, remainingEnemies);

            numEnemiesInLine = Math.min(numEnemiesInLine, 4);

            const lineY = startY + (line * verticalSpacing);
            
            // Calculate starting X to center the line
            const totalLineWidth = (numEnemiesInLine - 1) * horizontalSpacing;
            const centerX = gameWidth / 2;
            const startX = centerX - (totalLineWidth / 2);

            // Create enemies symmetrically in THIS, THIS VERY SPECIFIC line
            for (let i = 0; i < numEnemiesInLine; i++) {
                const enemyX = startX + (i * horizontalSpacing);
                this.enemies.push(new Enemy(enemyX, lineY));
                enemiesPlaced++;
            }
        }
    }

    start() {
        this.gameLoop(0);
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.enemies.length === 0 && !this.countdownActive) {
            this.countdownActive = true;
            this.countdownTime = 0;
        }

        if (this.countdownActive) {
            this.countdownTime += deltaTime;
            if (this.countdownTime >= this.countdownDuration) {
                this.level++;
                this.countdownActive = false;
                this.countdownTime = 0;
                this.updateUI();
                this.initEnemies();
            }
        }

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

        if (this.countdownActive) {
            this.drawCountdown();
        }

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    drawCountdown() {
        const remainingSeconds = Math.ceil((this.countdownDuration - this.countdownTime) / 1000);
        const ctx = this.gameContainer.ctx;
        const nextLevel = this.level + 1;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.gameContainer.width, this.gameContainer.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 60px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${remainingSeconds}`, this.gameContainer.width / 2, this.gameContainer.height / 2);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = '24px "Press Start 2P"';
        ctx.fillText(`LEVEL ${nextLevel}`, this.gameContainer.width / 2, this.gameContainer.height / 2 + 80);
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
                    this.score++;
                    this.updateUI();
                    break;
                }
            }
        }
    }

    updateUI() {
        // Format score as 2-digit number with leading zeros
        this.scoreElement.textContent = String(this.score).padStart(2, '0');
        this.levelElement.textContent = String(this.level);
    }
}

window.addEventListener('load', () => {
    new Game();
});
