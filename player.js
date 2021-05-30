class Player {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.aimPos = createVector();
        this.spd = 1.5;
        this.size = 20;

        this.bullets = [];
        this.grenades = [];

        this.grenadeColDown = 0;

        this.weapons = [{
                id: 1,
                name: "gun",
                ammo: 10,
                maxAmmo: 10,
                colDown: 0,
                colDownTime: 15,
                reloadTime: 50,
                damage: 20,
                stun: 3
            },
            {
                id: 2,
                name: "shotgun",
                ammo: 5,
                maxAmmo: 5,
                colDown: 0,
                colDownTime: 25,
                reloadTime: 80,
                damage: 15,
                stun: 8
            },
            {
                id: 3,
                name: "rifle",
                ammo: 30,
                maxAmmo: 30,
                colDown: 0,
                colDownTime: 5,
                reloadTime: 100,
                damage: 15,
                stun: 2
            },
        ]

        this.gunEquip = this.weapons[0];

        this.reloading = 0;

        this.hitRecovery = 0;
        this.health = 100;
    }

    display() {
        noStroke();
        if (this.hitRecovery == 1) fill(255, 0, 0);
        else fill(255);
        ellipse(this.pos.x, this.pos.y, this.size);

        this.bullets.map((e, i) => {
            e.display();
            if (e.update() || e.poped) this.bullets.splice(i, 1)
        });

        this.grenades.map((e, i) => {
            e.display();
            e.update();
            if (e.poped) this.grenades.splice(i, 1);
        });
    }

    update() {
        this.aimPos = createVector(mouseX, mouseY).sub(this.pos.copy()).setMag(this.size);
        if (this.reloading > 0) {
            this.reloading--;
        }
        if (this.hitRecovery > 0) {
            this.hitRecovery--;
        }
        if (this.gunEquip.colDown > 0) {
            this.gunEquip.colDown--;
        }
        if (this.grenadeColDown > 0) {
            this.grenadeColDown--;
        }
    }

    walk(dir, run) {
        if (dir == "UP" && this.pos.y > this.size / 2)
            this.pos.y -= !run ? this.spd : this.spd * 2;

        if (dir == "RIGHT" && this.pos.x < arenaWidth - (this.size / 2))
            this.pos.x += !run ? this.spd : this.spd * 2;

        if (dir == "LEFT" && this.pos.x > this.size / 2)
            this.pos.x -= !run ? this.spd : this.spd * 2;

        if (dir == "DOWN" && this.pos.y < arenaHeight - (this.size / 2))
            this.pos.y += !run ? this.spd : this.spd * 2;
    }

    shoot(x, y) {
        if (this.gunEquip.ammo != 0 && this.reloading == 0 && this.gunEquip.colDown == 0) {

            //gun
            if (this.gunEquip.name == "gun") {
                let target = createVector(x, y);
                let bullet = new Bullet(this.pos.copy(), target, this.gunEquip.damage, this.gunEquip.stun);

                this.bullets.push(bullet);

                this.gunEquip.colDown += this.gunEquip.colDownTime;
                this.gunEquip.ammo--;
            }

            //shotgun
            if (this.gunEquip.name == "shotgun") {
                let bullets = [];
                for (let i = 0; i < 5; i++) {
                    let target = createVector(x + random(-20, 20), y + random(-20, 20));
                    bullets.push(new Bullet(this.pos.copy(), target, this.gunEquip.damage, this.gunEquip.stun));
                }
                this.bullets.push(...bullets);

                this.gunEquip.colDown += this.gunEquip.colDownTime;
                this.gunEquip.ammo--;
            }

            //rifle
            if (this.gunEquip.name == "rifle") {
                let target = createVector(x, y);
                let bullet = new Bullet(this.pos.copy(), target, this.gunEquip.damage, this.gunEquip.stun);

                this.bullets.push(bullet);
                this.gunEquip.colDown += this.gunEquip.colDownTime;
                this.gunEquip.ammo--;
            }

        }
    }

    reload() {
        this.gunEquip.ammo = this.gunEquip.maxAmmo;
        this.reloading = this.gunEquip.reloadTime;
    }

    throwGrenade(x, y) {
        if (this.grenadeColDown == 0) {
            let target = createVector(x, y);
            let grenade = new Grenade(this.pos.copy(), target);

            this.grenades.push(grenade);
            this.grenadeColDown = 50;
        }
    }

    changeGun(number) {
        if (this.weapons[number - 1] != undefined) {
            this.gunEquip = this.weapons[number - 1];
        }
    }

    hited(dmg) {
        if (this.hitRecovery == 0) {
            this.health -= dmg;
            this.hitRecovery = 20;
        }
    }
}