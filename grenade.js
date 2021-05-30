class Grenade {
    constructor(pos, target) {
        this.spd = dist(pos.x, pos.y, target.x, target.y) / 3;

        this.pos = pos;
        this.dir = target.sub(pos).setMag(this.spd);

        this.size = 8;
        this.poped = false;
        //timer before explode
        this.timer = 100;
        //timer throw explode
        this.exTimer = 20;
        //explosion range;
        this.exRange = 0;

        this.stun = 10;
        this.dmg = 50;
    }

    display() {
        noStroke();
        if (this.timer > 0) {
            fill(0, 255, 0)
            ellipse(this.pos.x, this.pos.y, this.size);
        } else if (this.exTimer > 0) {
            fill(255, 0, 0, map((20 - this.exTimer), 0, 20, 255, 0))

            this.exTimer % 2 == 0 && particles.push(new Particle({
                x: this.pos.x,
                y: this.pos.y,
                red: 255,
                green: 120,
                blue: 0,
                speed: 6,
                lifetime: 50,
                damp: .9,
                size: [50]
            }));
            this.exRange = (20 - this.exTimer) * 10;
        }

    }

    update() {
        this.pos.add(this.dir.x, this.dir.y);
        this.dir.setMag(this.spd);
        this.spd *= .5;

        if (this.timer > 0) {
            this.timer -= 1;
        } else if (this.exTimer > 0) {
            this.exTimer -= 1;
        } else this.poped = true;
    }
}