import { Projectile } from './projectile.js';

export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 50;
        this.height = 50;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight - 100;
        this.speed = 5;
        this.moveLeft = false;
        this.moveRight = false;
        this.projectiles = [];
        this.shootCooldown = 0;
        this.shootCooldownMax = 10; // Frames b/w shots
        this.image = new Image();
        this.image.src = 'assets/player.png';
        this.imageLoaded = false;
        
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.setupInput();
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'a':
                    this.moveLeft = true;
                    break;
                case 'd':
                    this.moveRight = true;
                    break;
                case ' ':
                    e.preventDefault();
                    this.shoot();
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'a':
                    this.moveLeft = false;
                    break;
                case 'd':
                    this.moveRight = false;
                    break;
            }
        });
    }

    shoot() {
        if (this.shootCooldown <= 0) {
            const projectileX = this.x + this.width / 2 - 2.5;
            const projectileY = this.y;
            this.projectiles.push(new Projectile(projectileX, projectileY));
            this.shootCooldown = this.shootCooldownMax;
        }
    }

    update() {
        if (this.moveLeft) {
            this.x -= this.speed;
        }
        if (this.moveRight) {
            this.x += this.speed;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.gameWidth) this.x = this.gameWidth - this.width;

        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }

        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            if (projectile.isOffscreen(this.gameHeight)) {
                this.projectiles.splice(index, 1);
            }
        });
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.projectiles.forEach(projectile => {
            projectile.draw(ctx);
        });
    }
}
