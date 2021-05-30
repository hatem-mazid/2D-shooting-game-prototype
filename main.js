let p;
let bots = [];
let arenaWidth = 800;
let arenaHeight = 500;
let score = 0;

let particles = [];

let playing = false;

function setup() {
    let cnv = createCanvas(800, 600);

    //frameRate(5)
    cnv.style("cursor", "none");

    this.oncontextmenu = function(e) {
        e.preventDefault();
    };


    p = new Player(width / 2, height / 2);
}

function draw() {

    if (!playing) {
        background(255);
        push();
        textAlign(CENTER, CENTER);

        textSize(24);
        text("control:", width / 2, 50);

        textSize(16);
        text("(w a s d) moving", width / 2, 100);
        text("(shift) run", width / 2, 150);
        text("change weapon:", width / 2, 200);
        text("(1) gun, (2) shotgun, (3) rifle", width / 2, 250);
        text("(r) reload", width / 2, 300);
        text("(mouse left) shot", width / 2, 350);
        text("(mouse right) throw grenade", width / 2, 400);

        textSize(20);
        fill(0, 120, 0);
        text("it alpha version so the ammo is endless and you never die", width / 2, 450);
        text("looking for a fork improvement", width / 2, 475);

        textSize(32);
        fill(255, 0, 0);
        text("press any key to start", width / 2, 525);
        pop();
    } else if (playing) {
        background(120);
        //arena
        push();
        rectMode(CORNER);
        fill(200)
        rect(0, 0, arenaWidth, arenaHeight);
        pop();

        //info bar
        push();
        //health
        noFill();
        stroke(0);
        rectMode(CORNER)
        rect(25, 15 + arenaHeight, 100, 20);
        noStroke()
        fill(255, 0, 0);
        rect(25, 15 + arenaHeight, map(p.health, 0, 100, 0, 100), 20);
        textAlign(CENTER, CENTER);
        fill(0);
        text(`${floor(p.health)}/100`, 25, 15 + arenaHeight, 100, 20)

        //ammo
        noFill();
        stroke(0);
        rectMode(CORNER)
        rect(150, 15 + arenaHeight, 100, 20);
        noStroke();
        fill(0, 0, 255);
        if (p.reloading != 0) {
            rect(150, 15 + arenaHeight, map(p.reloading, 0, p.gunEquip.reloadTime, 100, 0), 20);
            textAlign(CENTER, CENTER);
            fill(0);
            text(`reloading...`, 150, 15 + arenaHeight, 100, 20)
        } else {
            rect(150, 15 + arenaHeight, map(p.gunEquip.ammo, 0, p.gunEquip.maxAmmo, 0, 100), 20);
            textAlign(CENTER, CENTER);
            fill(0);
            text(`${p.gunEquip.ammo}/${p.gunEquip.maxAmmo}`, 150, 15 + arenaHeight, 100, 20)
        }


        //score
        fill(0);
        textSize(16)
        text(`score: ${score}`, 300, 30 + arenaHeight)

        pop();

        //particles
        particles.map((p, i) => {
            if (p.update()) particles.splice(i, 1);
            p.display();
        });

        //player
        p.display();
        p.update();

        //bots
        bots.map(bot => {
            bot.display();
            bot.update();
            bot.follow(p.pos.x, p.pos.y);
        });

        keysControl();
        collisions();
        botSpawner();
        if (mouseIsPressed) {
            if (mouseButton == LEFT) {
                p.shoot(mouseX, mouseY);
            }
            if (mouseButton == RIGHT)
                p.throwGrenade(mouseX, mouseY);
        }
    }

    // mouse pointer
    push();
    stroke(0);
    line(mouseX - 5, mouseY, mouseX + 5, mouseY);
    line(mouseX, mouseY - 5, mouseX, mouseY + 5);

    pop();
}

function botSpawner() {
    bots.map((bot, i) => {
        if (bot.health <= 0) {
            for (let i = 0; i < 3; i++)
                particles.push(new Particle({ x: bot.pos.x, y: bot.pos.y, red: 0, green: 120, blue: 0, speed: 5, lifetime: 300, damp: .8, size: [8] }));
            bots.splice(i, 1);
            score++;
        }
    });

    if (bots.length < 15) {
        let x = random(arenaWidth);
        let y = random(arenaHeight);
        for (let i = 0; i < 10; i++)
            particles.push(new Particle({ x: x, y: y, red: 255, green: 255, blue: 255, speed: 6, lifetime: 40, damp: .9, size: [50] }));
        bots.push(new Bot(x, y));
    }
}

function collisions() {
    //bullet vs bots
    p.bullets.map(bullet => {
        bots.map(bot => {
            if (dist(bullet.pos.x, bullet.pos.y, bot.pos.x, bot.pos.y) < bullet.size + bot.size && !bullet.poped && bot.health > 0) {
                bot.hited(bullet.dmg, bullet.stun, p.pos);
                bullet.poped = true;
            }
        });
    })

    //player vs bots
    bots.map(bot => {
        if (dist(p.pos.x, p.pos.y, bot.pos.x, bot.pos.y) < p.size / 2 + bot.size / 2 &&
            bot.health > 0) {
            p.hited(bot.dmg);
        }
    });

    //grenade vs bots
    p.grenades.map(grenade => {
        bots.map(bot => {
            if (dist(grenade.pos.x, grenade.pos.y, bot.pos.x, bot.pos.y) < grenade.exRange + bot.size &&
                grenade.timer == 0 && bot.hitRecovery == 0) {
                bot.hited(grenade.dmg, grenade.stun, grenade.pos);
            }
        });
    });

    //bot vs bot
    bots.map(bot1 => {
        bots.map(bot2 => {
            let d = dist(bot1.pos.x, bot1.pos.y, bot2.pos.x, bot2.pos.y);
            if (d < bot1.size / 2 + bot2.size / 2 && bot1 != bot2) {
                let a = bot1.pos.copy().sub(bot2.pos.copy());
                let overlap = abs((bot1.size / 2 + bot2.size / 2) - d);

                bot1.pos.x = bot1.pos.x + (overlap * cos(a.heading()));
                bot1.pos.y = bot1.pos.y + (overlap * sin(a.heading()));

                bot2.pos.x = bot2.pos.x - (overlap * cos(a.heading()));
                bot2.pos.y = bot2.pos.y - (overlap * sin(a.heading()));


                bot1.dir.x = cos(a.heading()) * bot1.dir.mag();
                bot1.dir.y = sin(a.heading()) * bot1.dir.mag();

                bot2.dir.x = -cos(a.heading()) * bot2.dir.mag();
                bot2.dir.y = -sin(a.heading()) * bot2.dir.mag();
            }
        });
    })
}

function keysControl() {
    if (playing) {
        //w
        if (keyIsDown(87)) {
            p.walk("UP", keyIsDown(16))
        }
        //d
        if (keyIsDown(68)) {
            p.walk("RIGHT", keyIsDown(16))
        }
        //a
        if (keyIsDown(65)) {
            p.walk("LEFT", keyIsDown(16))
        }
        //s
        if (keyIsDown(83)) {
            p.walk("DOWN", keyIsDown(16))
        }
        //r
        if (keyIsDown(82)) {
            p.reload()
        }
        //1
        if (keyIsDown(49)) {
            p.changeGun(1)
        }
        //2 
        if (keyIsDown(50)) {
            p.changeGun(2)
        }
        //3 
        if (keyIsDown(51)) {
            p.changeGun(3)
        }
    }
}

function keyPressed() {
    if (!playing) { playing = true }
}