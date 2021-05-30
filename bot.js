class Bot {
    constructor(x, y) {
        this.pos = createVector(x, y);

        this.dir = createVector();

        this.spd = random(1, 1.5);
        this.size = 15;

        this.health = 100;
        this.hitRecovery = 0;

        this.hitPos = createVector();

        this.dmg = random(8, 12);
    }

    display() {
        if (this.hitRecovery > 0) fill(255, 0, 0);
        else fill(50);
        if (!(this.pos.x > arenaWidth ||
                this.pos.x < 0 ||
                this.pos.y > arenaHeight ||
                this.pos.y < 0))
            ellipse(this.pos.x, this.pos.y, this.size);
    }

    update() {
        if (this.hitRecovery > 0) {
            this.hitRecovery--;
            this.follow(this.hitPos.x, this.hitPos.y);
        }

    }

    hited(dmg, stun, sourcePos) {
        this.hitPos = sourcePos;
        this.hitRecovery = stun;
        this.health -= dmg;
        for (let i = 0; i < 1; i++)
            particles.push(new Particle({ x: this.pos.x, y: this.pos.y, red: 255, green: 0, blue: 0, speed: 5, lifetime: 200, damp: .8, size: [1, 10] }));
    }

    follow(x, y) {
        let target = createVector(x, y);
        this.dir.add(target.sub(this.pos).normalize());
        this.dir.limit(this.spd);

        if (this.hitRecovery > 0) {
            this.pos.x -= this.dir.x * 2;
            this.pos.y -= this.dir.y * 2;
        } else {
            this.pos.add(this.dir)
        }
    }


}