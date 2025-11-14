import { GameContainer } from './game-container.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { getGameOverResponse } from './game-response.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.gameContainer = new GameContainer(this.canvas);
        this.player = new Player(this.gameContainer.width, this.gameContainer.height);
        this.enemies = [];
        this.enemyProjectiles = [];
        this.lastTime = 0;
        this.level = 0;
        this.score = 0;
        this.lives = 5;
        this.countdownActive = false;
        this.countdownTime = 0;
        this.countdownDuration = 5000;
        this.isGameOver = false;
        
        // UI Elements
        this.scoreElement = document.getElementById('scoreValue');
        this.livesElement = document.getElementById('levelValue');
        
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
        let enemy2Count = 0;
        let enemy3Count = 0;
        
        if (this.level === 0) {
            totalEnemies = 3;
            enemy2Count = 0;
            enemy3Count = 0;
        } else if (this.level === 1) {
            totalEnemies = 4;
            enemy2Count = 0;
            enemy3Count = 0;
        } else if (this.level === 2) {
            totalEnemies = 7;
            enemy2Count = 0;
            enemy3Count = 0;
        } else if (this.level === 3) {
            totalEnemies = 7;
            enemy2Count = 2; //30%
            enemy3Count = 0;
        } else if (this.level === 4) {
            totalEnemies = 8;
            enemy2Count = 4; // 50%
            enemy3Count = 0;
        } else if (this.level === 5) {
            totalEnemies = 8;
            enemy2Count = 6; // 75%
            enemy3Count = 0;
        } else if (this.level >= 6 && this.level < 10) {
            // Level 6-9: Only enemy2
            totalEnemies = 8 + Math.floor((this.level - 6) / 2);
            enemy2Count = totalEnemies; // 100% enemy2
            enemy3Count = 0;
        } else if (this.level >= 10) {
            // Level 10+: Mix of enemy2 and enemy3
            totalEnemies = 10 + Math.floor((this.level - 10) / 2);
            enemy2Count = Math.floor(totalEnemies / 2);
            enemy3Count = totalEnemies - enemy2Count; // 50/50 split
        }
        
        let enemy1Count = totalEnemies - enemy2Count - enemy3Count;

        // Generate symmetrical enemy patterns
        const numLines = Math.min(Math.floor(Math.random() * 3) + 1, 3); // 1-3 lines

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
                
                // Determine enemy type
                let enemyType = 1;
                const totalOtherEnemies = enemy1Count + enemy2Count + enemy3Count;
                
                if (totalOtherEnemies > 0) {
                    const rand = Math.random();
                    const enemy1Chance = enemy1Count / totalOtherEnemies;
                    const enemy2Chance = enemy2Count / totalOtherEnemies;
                    
                    if (rand < enemy1Chance) {
                        enemyType = 1;
                        enemy1Count--;
                    } else if (rand < enemy1Chance + enemy2Chance) {
                        enemyType = 2;
                        enemy2Count--;
                    } else {
                        enemyType = 3;
                        enemy3Count--;
                    }
                }
                
                this.enemies.push(new Enemy(enemyX, lineY, enemyType, this.level));
                enemiesPlaced++;
            }
        }
    }

    start() {
        this.gameLoop(0);
    }

    gameLoop(timestamp) {
        if (this.isGameOver) {
            requestAnimationFrame((time) => this.gameLoop(time));
            return;
        }
        
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
            enemy.update(this.gameContainer.width, deltaTime);
        });
        
        // Update orphaned projectiles
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            this.enemyProjectiles[i].update();
            if (this.enemyProjectiles[i].isOffscreen(this.gameContainer.height)) {
                this.enemyProjectiles.splice(i, 1);
            }
        }

        this.checkCollisions();

        this.gameContainer.draw();
        this.player.draw(this.gameContainer.ctx);
        
        this.enemies.forEach(enemy => {
            enemy.draw(this.gameContainer.ctx);
        });
        
        // Draw orphaned projectiles, they probably get better lives but oh anyways...
        this.enemyProjectiles.forEach(projectile => {
            projectile.draw(this.gameContainer.ctx);
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
                    // Remove projectile
                    this.player.projectiles.splice(i, 1);
                    
                    const enemyDestroyed = enemy.takeDamage();
                    
                    if (enemyDestroyed) {
                        // Transfer enemy projectiles to orphaned list
                        this.enemyProjectiles.push(...enemy.projectiles);
                        this.enemies.splice(j, 1);
                        this.score += enemy.type;
                        this.updateUI();
                    }
                    
                    break;
                }
            }
        }
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            for (let j = enemy.projectiles.length - 1; j >= 0; j--) {
                const projectile = enemy.projectiles[j];
                
                if (this.checkPlayerCollision(projectile)) {
                    enemy.projectiles.splice(j, 1);
                    this.lives--;
                    this.updateUI();
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.enemyProjectiles[i];
            
            if (this.checkPlayerCollision(projectile)) {
                this.enemyProjectiles.splice(i, 1);
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    checkPlayerCollision(projectile) {
        return (
            projectile.x < this.player.x + this.player.width &&
            projectile.x + projectile.width > this.player.x &&
            projectile.y < this.player.y + this.player.height &&
            projectile.y + projectile.height > this.player.y
        );
    }
    
    gameOver() {
        const gameOverScreen = document.getElementById('gameOverScreen');
        const gameOverLevel = document.getElementById('gameOverLevel');
        const restartBtn = document.getElementById('restartBtn');
        const responseElement = document.getElementById('gameOverResponse');
        
        gameOverLevel.textContent = this.level;
        gameOverScreen.classList.remove('game-over-hidden');
        
        const response = getGameOverResponse(this.level);
        responseElement.textContent = response;
        
        this.isGameOver = true;
        
        restartBtn.onclick = () => this.restart();
    }
    
    restart() {
        this.level = 0;
        this.score = 0;
        this.lives = 5;
        this.enemies = [];
        this.enemyProjectiles = [];
        this.player.projectiles = [];
        this.countdownActive = false;
        this.countdownTime = 0;
        this.isGameOver = false;
        
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.classList.add('game-over-hidden');
        
        this.player.x = this.gameContainer.width / 2 - this.player.width / 2;
        
        this.updateUI();
        
        this.initEnemies();
        this.lastTime = 0;
        this.start();
    }

    updateUI() {
        this.scoreElement.textContent = String(this.score).padStart(2, '0');
        this.livesElement.textContent = String(this.lives);
    }
}

window.addEventListener('load', () => {
    new Game();
});
