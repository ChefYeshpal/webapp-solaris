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
        } else if (type === 'bomb') {
            this.width = 10;
            this.height = 10;
            this.speed = 2;
            this.isLazer = false;
            this.isBomb = true;
            this.timeAlive = 0;
            this.explosionDelay = 3000;
            this.hasExploded = false;
            this.pellets = [];
        } else {
            this.width = 5;
            this.height = 12;
            this.speed = 10;
            this.isLazer = false;
            this.isBomb = false;
        }
    }

    update() {
        if (!this.isLazer) {
            if (this.isBomb) {
                this.y -= this.speed;
                this.timeAlive += 16;
                
                if (this.timeAlive >= this.explosionDelay && !this.hasExploded) {
                    this.explode();
                }
                
                for (let i = this.pellets.length - 1; i >= 0; i--) {
                    this.pellets[i].update();
                }
            } else {
                this.y -= this.speed;
            }
        }
    }

    explode() {
        this.hasExploded = true;
        const pelletCount = 18;
        const angleStep = (Math.PI * 2) / pelletCount;
        
        for (let i = 0; i < pelletCount; i++) {
            const angle = i * angleStep;
            const speed = 8;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const pelletX = this.x + Math.cos(angle) * 15;
            const pelletY = this.y + Math.sin(angle) * 15;
            
            this.pellets.push(new Pellet(pelletX, pelletY, vx, vy));
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
        } else if (this.isBomb && !this.hasExploded) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(this.x - 2, this.y - 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 2, this.y - 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillRect(this.x - 1, this.y, 2, 3);
        } else if (this.isBomb && this.hasExploded) {
            this.pellets.forEach(pellet => {
                pellet.draw(ctx);
            });
        } else {
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    isOffscreen(gameHeight) {
        if (this.isLazer) {
            return false;
        }
        if (this.isBomb) {
            if (this.hasExploded) {
                return this.pellets.length === 0;
            }
            return false;
        }
        return this.y + this.height < 0;
    }
}

class Pellet {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 4;
        this.height = 4;
        this.timeAlive = 0;
        this.lifespan = 3000;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.timeAlive += 16;
    }

    draw(ctx) {
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    isAlive() {
        return this.timeAlive < this.lifespan;
    }
}
