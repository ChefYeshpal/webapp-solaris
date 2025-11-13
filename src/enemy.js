export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 3;
        this.direction = 1; // 1 for right, -1 for left
        this.image = new Image();
        this.image.src = 'assets/enemy1.png';
        this.imageLoaded = false;
        
        this.projectiles = [];
        this.shootTimer = 0;
        this.shootInterval = (Math.random() * 2000) + 2000;
        
        this.image.onload = () => {
            this.imageLoaded = true;
        };
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
            this.shootInterval = (Math.random() * 2000) + 2000;
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
        
        this.projectiles.push(new EnemyProjectile(this.x + this.width / 2 - 2.5, this.y + this.height));
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
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
