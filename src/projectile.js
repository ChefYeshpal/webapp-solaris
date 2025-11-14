export class Projectile {
    constructor(x, y, type = 'projectile') {
        this.x = x;
        this.y = y;
        this.type = type;
        
        if (type === 'lazer') {
            this.width = 8;
            this.height = 0;
            this.speed = 0; 
            this.isLazer = true;
        } else {
            this.width = 5;
            this.height = 12;
            this.speed = 10;
            this.isLazer = false;
        }
    }

    update() {
        if (!this.isLazer) {
            this.y -= this.speed;
        }
    }

    draw(ctx) {
        if (this.isLazer) {
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, 0);
            gradient.addColorStop(0, '#ff0000');
            gradient.addColorStop(0.3, '#ff6600');
            gradient.addColorStop(0.6, '#ffaa00');
            gradient.addColorStop(1, '#ffff00');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x - this.width / 2, 0, this.width, this.y);
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff6600';
            ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
            ctx.fillRect(this.x - this.width / 2 - 2, 0, this.width + 4, this.y);
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    isOffscreen(gameHeight) {
        if (this.isLazer) {
            return false;
        }
        return this.y + this.height < 0;
    }
}
