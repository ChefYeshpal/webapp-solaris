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
        
        // Weapon unlocking system
        this.unlockedWeapons = {
            projectile: true,
            lazer: false,
            bomb: false
        };
        
        this.secretKeyPresses = [];
        this.secretKeyTimeout = null;
        
        // UI Elements
        this.scoreElement = document.getElementById('scoreValue');
        this.livesElement = document.getElementById('levelValue');
        this.weaponBoxes = {
            projectile: document.getElementById('projectileWeapon'),
            lazer: document.getElementById('lazerWeapon'),
            bomb: document.getElementById('bombWeapon')
        };
        
        this.setupWeaponUI();
        this.initEnemies();
        this.updateUI();
        this.start();
    }

    setupWeaponUI() {
        Object.keys(this.weaponBoxes).forEach(weaponType => {
            this.weaponBoxes[weaponType].addEventListener('click', () => {
                this.handleWeaponClick(weaponType);
            });
        });
        
        window.addEventListener('weaponSwitch', (e) => {
            this.handleWeaponSwitch(e.detail.weaponType);
        });
        
        window.addEventListener('startLazer', () => {
            this.handleLazerStart();
        });
        
        // Secret code listener
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'g') {
                this.handleSecretKeyPress();
            }
        });
        
        this.updateWeaponUI();
    }

    handleSecretKeyPress() {
        if (this.secretKeyTimeout) {
            clearTimeout(this.secretKeyTimeout);
        }
        
        this.secretKeyPresses.push(Date.now());
        
        if (this.secretKeyPresses.length > 7) {
            this.secretKeyPresses.shift();
        }
        
        if (this.secretKeyPresses.length === 7) {
            const firstPress = this.secretKeyPresses[0];
            const lastPress = this.secretKeyPresses[6];
            
            if (lastPress - firstPress < 2000) {
                this.unlockAllWeapons();
            }
        }
        
        this.secretKeyTimeout = setTimeout(() => {
            this.secretKeyPresses = [];
        }, 2000);
    }

    unlockAllWeapons() {
        this.unlockedWeapons.projectile = true;
        this.unlockedWeapons.lazer = true;
        this.unlockedWeapons.bomb = true;
        this.score += 1000;
        this.updateWeaponUI();
        this.updateUI();
        this.secretKeyPresses = [];
    }

    handleWeaponClick(weaponType) {
        if (this.unlockedWeapons[weaponType]) {
            this.player.currentWeapon = weaponType;
            this.updateWeaponUI();
        }
    }

    handleWeaponSwitch(weaponType) {
        if (this.unlockedWeapons[weaponType]) {
            if (this.player.currentWeapon === 'lazer' && weaponType !== 'lazer') {
                this.player.stopLazer();
            }
            this.player.currentWeapon = weaponType;
            this.updateWeaponUI();
        }
    }

    handleLazerStart() {
        if (this.score >= 20) {
            this.player.activateLazer();
        }
    }

    updateWeaponUI() {
        Object.keys(this.weaponBoxes).forEach(weaponType => {
            const box = this.weaponBoxes[weaponType];
            
            box.classList.remove('active', 'locked');
            
            if (!this.unlockedWeapons[weaponType]) {
                box.classList.add('locked');
            }
            
            // Add active class if current weapon
            if (this.player.currentWeapon === weaponType) {
                box.classList.add('active');
            }
        });
    }

    checkWeaponUnlocks() {
        if (this.level >= 9 && !this.unlockedWeapons.lazer) {
            this.unlockedWeapons.lazer = true;
            this.updateWeaponUI();
        }
        if (this.level >= 12 && !this.unlockedWeapons.bomb) {
            this.unlockedWeapons.bomb = true;
            this.updateWeaponUI();
        }
    }

    initEnemies() {
        const gameWidth = this.gameContainer.width;
        const horizontalSpacing = 80;
        const verticalSpacing = 100;
        const startY = 50;
        
        // Create a shared direction object for all enemies in this level
        const groupDirection = { value: 1 };

        let totalEnemies;
        let enemy2Count = 0;
        let enemy3Count = 0;
        let enemy4Count = 0;
        
        if (this.level === 0) {
            totalEnemies = 3;
            enemy2Count = 0;
            enemy3Count = 0;
            enemy4Count = 0;
        } else if (this.level === 1) {
            totalEnemies = 4;
            enemy2Count = 0;
            enemy3Count = 0;
            enemy4Count = 0;
        } else if (this.level === 2) {
            totalEnemies = 7;
            enemy2Count = 0;
            enemy3Count = 0;
            enemy4Count = 0;
        } else if (this.level === 3) {
            totalEnemies = 7;
            enemy2Count = 2; //30%
            enemy3Count = 0;
            enemy4Count = 0;
        } else if (this.level === 4) {
            totalEnemies = 8;
            enemy2Count = 4; // 50%
            enemy3Count = 0;
            enemy4Count = 0;
        } else if (this.level === 5) {
            totalEnemies = 8;
            enemy2Count = 6; // 75%
            enemy3Count = 0;
            enemy4Count = 0;
        } else if (this.level >= 6 && this.level < 8) {
            totalEnemies = 8 + Math.floor((this.level - 6) / 2);
            enemy2Count = totalEnemies; 
            enemy3Count = 0;
            enemy4Count = 0;
        } else if (this.level >= 8 && this.level < 11) {
            totalEnemies = 10 + Math.floor((this.level - 8) / 2);
            enemy2Count = Math.floor(totalEnemies / 2);
            enemy3Count = totalEnemies - enemy2Count; // 50/50 split
            enemy4Count = 0;
        } else if (this.level >= 11) {
            totalEnemies = 11 + Math.floor((this.level - 11) / 2);
            enemy2Count = Math.floor(totalEnemies / 3);
            enemy3Count = Math.floor(totalEnemies / 3);
            enemy4Count = Math.min(3, totalEnemies - enemy2Count - enemy3Count);
        }
        
        let enemy1Count = totalEnemies - enemy2Count - enemy3Count - enemy4Count;

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
                const totalOtherEnemies = enemy1Count + enemy2Count + enemy3Count + enemy4Count;
                
                if (totalOtherEnemies > 0) {
                    const rand = Math.random();
                    const enemy1Chance = enemy1Count / totalOtherEnemies;
                    const enemy2Chance = enemy2Count / totalOtherEnemies;
                    const enemy3Chance = enemy3Count / totalOtherEnemies;
                    
                    if (rand < enemy1Chance) {
                        enemyType = 1;
                        enemy1Count--;
                    } else if (rand < enemy1Chance + enemy2Chance) {
                        enemyType = 2;
                        enemy2Count--;
                    } else if (rand < enemy1Chance + enemy2Chance + enemy3Chance) {
                        enemyType = 3;
                        enemy3Count--;
                    } else {
                        enemyType = 4;
                        enemy4Count--;
                    }
                }
                
                this.enemies.push(new Enemy(enemyX, lineY, enemyType, this.level, groupDirection));
                enemiesPlaced++;
            }
        }
    }

    changeAllEnemyDirections() {
        this.enemies.forEach(enemy => {
            enemy.direction *= -1;
        });
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
                this.checkWeaponUnlocks();
                this.updateUI();
                this.initEnemies();
            }
        }

        this.gameContainer.update();
        this.player.update();
        
    
        if (this.player.isShootingLazer) {
            const duration = this.player.lazerDuration / 60;
            const baseCost = 20 / 60;
            const multiplier = 1 + (duration * duration) * 0.5;
            const pointsPerFrame = baseCost * multiplier;
            this.score -= pointsPerFrame;
            
            if (this.score <= 0) {
                this.score = 0;
                this.player.stopLazer();
            }
            
            this.updateUI();
        }
    
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
        
        for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.player.projectiles[i];
            if (projectile.isBomb && !projectile.hasCost) {
                projectile.hasCost = true;
                this.score -= 30;
                if (this.score < 0) {
                    this.score = 0;
                }
                this.updateUI();
            }
        }

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
            
            if (projectile.isLazer) {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    if (enemy.type === 4) {
                        const isHitting = this.checkLazerCollision(projectile, enemy);
                        enemy.updateLazerTimer(16, isHitting); // 16ms per frame
                        
                        const enemyDestroyed = enemy.checkLazerDamageThreshold();
                        if (enemyDestroyed) {
                            this.enemyProjectiles.push(...enemy.projectiles);
                            this.enemies.splice(j, 1);
                            this.score += enemy.type;
                            this.updateUI();
                        }
                    } else if (this.checkLazerCollision(projectile, enemy)) {
                        const enemyDestroyed = enemy.takeDamage();
                        
                        if (enemyDestroyed) {
                            this.enemyProjectiles.push(...enemy.projectiles);
                            this.enemies.splice(j, 1);
                            this.score += enemy.type;
                            this.updateUI();
                        }
                    }
                }
            } else if (projectile.isBomb) {
                for (let j = projectile.pellets.length - 1; j >= 0; j--) {
                    const pellet = projectile.pellets[j];
                    
                    for (let k = this.enemies.length - 1; k >= 0; k--) {
                        const enemy = this.enemies[k];
                        
                        if (this.checkPelletCollision(pellet, enemy)) {
                            let enemyDestroyed;
                            if (enemy.type === 4) {
                                enemyDestroyed = enemy.takePelletDamage();
                            } else {
                                enemyDestroyed = enemy.takePelletDamage();
                            }
                            
                            if (enemyDestroyed) {
                                this.enemyProjectiles.push(...enemy.projectiles);
                                this.enemies.splice(k, 1);
                                this.score += enemy.type;
                                this.updateUI();
                            }
                        }
                    }
                    
                    if (!pellet.isAlive()) {
                        projectile.pellets.splice(j, 1);
                    }
                }
                
                if (projectile.hasExploded && projectile.pellets.length === 0) {
                    this.player.projectiles.splice(i, 1);
                }
            } else {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    if (enemy.type !== 4 && enemy.checkCollision(projectile)) {
                        this.player.projectiles.splice(i, 1);
                        
                        const enemyDestroyed = enemy.takeDamage();
                        
                        if (enemyDestroyed) {
                            this.enemyProjectiles.push(...enemy.projectiles);
                            this.enemies.splice(j, 1);
                            this.score += enemy.type;
                            this.updateUI();
                        }
                        
                        break;
                    }
                }
            }
        }
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (enemy.type === 4 && enemy.lazerBeam) {
                if (enemy.checkLazerCollision(this.player.x, this.player.width, this.player.y, this.player.height)) {
                    this.lives--;
                    this.updateUI();
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
            
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
        
        for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.player.projectiles[i];
            
            if (projectile.isBomb && projectile.hasExploded) {
                for (let j = projectile.pellets.length - 1; j >= 0; j--) {
                    const pellet = projectile.pellets[j];
                    
                    if (this.checkPelletPlayerCollision(pellet)) {
                        projectile.pellets.splice(j, 1);
                        this.lives--;
                        this.updateUI();
                        
                        if (this.lives <= 0) {
                            this.gameOver();
                        }
                    }
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
    
    checkPelletCollision(pellet, enemy) {
        return (
            pellet.x - pellet.width / 2 < enemy.x + enemy.width &&
            pellet.x + pellet.width / 2 > enemy.x &&
            pellet.y - pellet.height / 2 < enemy.y + enemy.height &&
            pellet.y + pellet.height / 2 > enemy.y
        );
    }
    
    checkPelletPlayerCollision(pellet) {
        return (
            pellet.x - pellet.width / 2 < this.player.x + this.player.width &&
            pellet.x + pellet.width / 2 > this.player.x &&
            pellet.y - pellet.height / 2 < this.player.y + this.player.height &&
            pellet.y + pellet.height / 2 > this.player.y
        );
    }
    
    checkLazerCollision(lazer, enemy) {
        const lazerLeft = lazer.x - lazer.width / 2;
        const lazerRight = lazer.x + lazer.width / 2;
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.width;
        
        return (
            lazerRight > enemyLeft &&
            lazerLeft < enemyRight &&
            enemy.y < lazer.y
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
        this.player.stopLazer();
        this.countdownActive = false;
        this.countdownTime = 0;
        this.isGameOver = false;
        
        this.unlockedWeapons = {
            projectile: true,
            lazer: false,
            bomb: false
        };
        this.player.currentWeapon = 'projectile';
        this.player.lazerDuration = 0;
        
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.classList.add('game-over-hidden');
        
        this.player.x = this.gameContainer.width / 2 - this.player.width / 2;
        
        this.updateUI();
        this.updateWeaponUI();
        
        this.initEnemies();
        this.lastTime = performance.now();
    }

    updateUI() {
        this.scoreElement.textContent = String(Math.floor(this.score)).padStart(2, '0');
        this.livesElement.textContent = String(this.lives);
    }

    // Ah these test functions... ofc I wont ever work in js and NOT have one...
    skipToLevel(targetLevel) {
        this.level = targetLevel;
        this.enemies = [];
        this.enemyProjectiles = [];
        this.countdownActive = false;
        this.countdownTime = 0;
        this.checkWeaponUnlocks();
        this.updateUI();
        this.updateWeaponUI();
        this.initEnemies();
        console.log(`Skipped to level ${targetLevel}`);
    }
}

window.addEventListener('load', () => {
    const game = new Game();
    // Expose game instance to console for testing
    window.game = game;
    console.log('Game loaded, Use window.game.skipToLevel() to skip to specified');
});
