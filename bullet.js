class Bullet {
    constructor(pos, target, dmg, stun) {
        this.spd = 20;

        this.pos = pos;
        this.dir = target.sub(pos).setMag(this.spd);

        this.size = 5;
        this.poped = false;
        this.stun = stun;
        this.dmg = dmg + random(-2, 2);
    }

    display() {
        push();
        strokeWeight(3);
        stroke(255, 255, 0);
        line(this.dir.copy().setMag(5).x + this.pos.x,
            this.dir.copy().setMag(5).y + this.pos.y,
            this.pos.x,
            this.pos.y);

        particles.push(new Particle({
            x: this.pos.x,
            y: this.pos.y,
            red: 255,
            green: 255,
            blue: 0,
            speed: 2,
            lifetime: 15,
            damp: .9,
            size: [3]
        }));

        pop();
    }

    update() {
        this.pos.add(this.dir.x, this.dir.y);
        return (this.pos.x > arenaWidth ||
            this.pos.x < 0 ||
            this.pos.y > arenaHeight ||
            this.pos.y < 0);
    }
}