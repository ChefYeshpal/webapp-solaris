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
        this.moveUp = false;
        this.moveDown = false;
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
                case 'w':
                    this.moveUp = true;
                    break;
                case 'a':
                    this.moveLeft = true;
                    break;
                case 's':
                    this.moveDown = true;
                    break;
                case 'd':
                    this.moveRight = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w':
                    this.moveUp = false;
                    break;
                case 'a':
                    this.moveLeft = false;
                    break;
                case 's':
                    this.moveDown = false;
                    break;
                case 'd':
                    this.moveRight = false;
                    break;
            }
        });
    }

    update() {
        if (this.moveLeft) {
            this.x -= this.speed;
        }
        if (this.moveRight) {
            this.x += this.speed;
        }
        if (this.moveUp) {
            this.y -= this.speed;
        }
        if (this.moveDown) {
            this.y += this.speed;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.gameWidth) this.x = this.gameWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.gameHeight) this.y = this.gameHeight - this.height;
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
