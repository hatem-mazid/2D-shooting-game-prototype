class Particle {
    constructor(obj) {
        //particle position
        this.pos = createVector(obj.x, obj.y);
        //speed
        this.xDir = random(-obj.speed, obj.speed);
        this.yDir = random(-obj.speed, obj.speed);

        //color
        this.r = obj.red;
        this.g = obj.green;
        this.b = obj.blue;
        this.color;

        //speed reducer [0 => 1]
        //1 no speed reduce
        //0 no speed
        this.damp = obj.damp;

        //life time
        this.life = obj.lifetime;
        this.maxLife = obj.lifetime;

        //size
        this.weight = obj.size;
    }

    display() {
        push();

        stroke(this.color);
        //one size
        if (this.weight.length == 1)
            strokeWeight(this.weight[0]);
        //two size
        if (this.weight.length == 2)
            strokeWeight(map(this.life, this.maxLife, 0, this.weight[0], this.weight[1]));

        point(this.pos.x, this.pos.y);

        pop();

    }

    update() {
        this.xDir *= this.damp;
        this.yDir *= this.damp;

        this.pos.x += this.xDir;
        this.pos.y += this.yDir;

        this.color = color(this.r, this.g, this.b, map(this.life, this.maxLife, 0, 255, 0));

        this.life--;
        return (this.life < 0 ||
            this.pos.x < 0 || this.pos.x > arenaWidth ||
            this.pos.y < 0 || this.pos.y > arenaHeight);

    }
}