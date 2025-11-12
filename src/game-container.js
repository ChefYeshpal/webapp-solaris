export class GameContainer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.containerElement = document.getElementById('gameContainer');
        
        this.resizeContainer();
        
        window.addEventListener('resize', () => this.resizeContainer());
        
        this.stars = [];
        this.initStars();
    }

    resizeContainer() {
        const availableHeight = window.innerHeight - 4;
        
        const width = Math.floor(availableHeight * (4 / 3));
        
        this.width = width;
        this.height = availableHeight;
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.containerElement.style.width = this.width + 'px';
        this.containerElement.style.height = this.height + 'px';
        
        this.ctx.imageSmoothingEnabled = false;
    }

    initStars() {
        // Create small stars scattered across the game container
        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }

    update() {
        // Update star twinkle effect
        this.stars.forEach(star => {
            star.opacity += star.twinkleSpeed;
            if (star.opacity >= 0.8 || star.opacity <= 0.3) {
                star.twinkleSpeed *= -1;
            }
        });
    }

    draw() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fillRect(star.x, star.y, 1, 1);
        });
    }
}
