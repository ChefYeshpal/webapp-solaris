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
        
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    update(gameWidth) {
        this.x += this.speed * this.direction;
        if (this.x <= 0 || this.x + this.width >= gameWidth) {
            this.direction *= -1;
        }
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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
