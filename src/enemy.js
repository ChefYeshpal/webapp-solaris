export class Enemy {
    constructor(x, y, type = 1, level = 0) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.level = level;
        
        // Increase speed after level 15
        const baseSpeed = 3;
        const speedBonus = level > 15 ? (level - 15) * 0.3 : 0;
        this.speed = baseSpeed + speedBonus;
        
        this.direction = 1; // 1 for right, -1 for left
        this.type = type;
        this.image = new Image();
        this.image.src = `assets/enemy${type}.png`;
        this.imageLoaded = false;
        
        this.maxHealth = type === 1 ? 1 : type === 2 ? 3 : 5;
        this.health = this.maxHealth;
        
        this.projectiles = [];
        this.shootTimer = 0;
        const baseInterval = (Math.random() * 2000) + 2000;
        const intervalReduction = level > 15 ? (level - 15) * 100 : 0;
        this.shootInterval = Math.max(1000, baseInterval - intervalReduction);
        
        this.enemy3SecondShotTimer = 0;
        this.enemy3SecondShotDelay = 150; 
        
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }
    
    takeDamage() {
        this.health--;
        return this.health <= 0;
    }

    update(gameWidth, deltaTime) {
        this.x += this.speed * this.direction;
        if (this.x <= 0 || this.x + this.width >= gameWidth) {
            this.direction *= -1;
        }
        
        // Update shooting timer
        this.shootTimer += deltaTime;
        if (this.shootTimer >= this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
            const baseInterval = (Math.random() * 2000) + 2000;
            const intervalReduction = this.level > 15 ? (this.level - 15) * 100 : 0;
            this.shootInterval = Math.max(1000, baseInterval - intervalReduction);
        }
        
        // enemy3 second shot delay
        if (this.type === 3 && this.enemy3SecondShotTimer > 0) {
            this.enemy3SecondShotTimer -= deltaTime;
            if (this.enemy3SecondShotTimer <= 0) {
                this.shootSecondRow();
                this.enemy3SecondShotTimer = 0;
            }
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            if (this.projectiles[i].isOffscreen(800)) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    shoot() {
        const EnemyProjectile = class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = 5;
                this.height = 12;
                this.speed = 7;
            }
            
            update() {
                this.y += this.speed;
            }
            
            draw(ctx) {
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            
            isOffscreen(gameHeight) {
                return this.y - this.height > gameHeight;
            }
        };
        
        if (this.type === 2) {
            const spacing = 15; 
            const centerX = this.x + this.width / 2 - 2.5;
            this.projectiles.push(new EnemyProjectile(centerX - spacing / 2, this.y + this.height));
            this.projectiles.push(new EnemyProjectile(centerX + spacing / 2, this.y + this.height));
        } else if (this.type === 3) {
            const spacing = 20;
            const centerX = this.x + this.width / 2 - 2.5;
            this.projectiles.push(new EnemyProjectile(centerX - spacing, this.y + this.height));
            this.projectiles.push(new EnemyProjectile(centerX, this.y + this.height));
            this.projectiles.push(new EnemyProjectile(centerX + spacing, this.y + this.height));
            this.enemy3SecondShotTimer = this.enemy3SecondShotDelay;
        } else {
            this.projectiles.push(new EnemyProjectile(this.x + this.width / 2 - 2.5, this.y + this.height));
        }
    }
    
    shootSecondRow() {
        const EnemyProjectile = class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = 5;
                this.height = 12;
                this.speed = 7;
            }
            
            update() {
                this.y += this.speed;
            }
            
            draw(ctx) {
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            
            isOffscreen(gameHeight) {
                return this.y - this.height > gameHeight;
            }
        };
        
        const spacing = 20;
        const centerX = this.x + this.width / 2 - 2.5;
        this.projectiles.push(new EnemyProjectile(centerX - spacing, this.y + this.height));
        this.projectiles.push(new EnemyProjectile(centerX, this.y + this.height));
        this.projectiles.push(new EnemyProjectile(centerX + spacing, this.y + this.height));
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            if (this.type === 1) {
                ctx.fillStyle = '#ff0000';
            } else if (this.type === 2) {
                ctx.fillStyle = '#ff00ff';
            } else {
                ctx.fillStyle = '#00ffff';
            }
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        if ((this.type === 2 || this.type === 3) && this.health < this.maxHealth) {
            const healthBarWidth = 40;
            const healthBarHeight = 4;
            const healthBarX = this.x + (this.width - healthBarWidth) / 2;
            const healthBarY = this.y - 10;
            
            ctx.fillStyle = '#333333';
            ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
            
            const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth;
            ctx.fillStyle = this.type === 3 ? '#ffff00' : '#00ff00';
            ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
        }
        
        this.projectiles.forEach(projectile => {
            projectile.draw(ctx);
        });
    }

    checkCollision(projectile) {
        return (
            projectile.x < this.x + this.width &&
            projectile.x + projectile.width > this.x &&
            projectile.y < this.y + this.height &&
            projectile.y + projectile.height > this.y
        );
    }
}
