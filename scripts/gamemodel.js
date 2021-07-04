// This file contains the game model, which sets up new games and holds game entities

let GameModel = function(spec) {
    let that = {};
    that.collides = function(coords, circle) {
        if (!that.player.enabled) return;
        for (let i = 1; i < coords.length; ++i) {
            let pt1 = { x: coords[i-1][0], y: coords[i-1][1] };
            let pt2 = { x: coords[i][0], y: coords[i][1] };
            let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
            let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
            let b = -2 * (v1.x * v2.x + v1.y * v2.y);
            let c =  2 * (v1.x * v1.x + v1.y * v1.y);
            let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
            if (isNaN(d)) { // no intercept
                continue;
            }
            // These represent the unit distance of point one and two on the line
            let u1 = (b - d) / c;  
            let u2 = (b + d) / c;
            if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
                return true;
            }
            if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
                return true;
            }
        }
        return false;
    }
    that.level = 0;
    that.score = 0;
    //that.particleSystemRenderer = new ParticleSystemRenderer();

    // create a new game
    that.create = function() {
        that.terrain = [];
        that.safezones = [];
        that.player = new Lander({
            image: landerImg,
            thrustRate: .5,
            rotationRate: 2,
            center: { x: 100, y: 100 },
            radius: 12.0,
            rotation: Math.PI/2,
            momentum: { x: 0.0, y: 0.0 },
            fuel: 10.0
        });
        keyboard.registerCommand(controls.thrust, game.player.thrust);
        keyboard.registerCommand(controls.rotateLeft, game.player.rotateLeft);
        keyboard.registerCommand(controls.rotateRight, game.player.rotateRight);

        that.particleSystem = new ParticleSystem({
            center: that.player.center,
            direction: { x: -Math.sin(that.player.rotation), y: -Math.cos(that.player.rotation) }
        });

        let platforms = 2 - that.level;
        for (let i = 0; i < platforms; ++i) {
            let domain = coordSize/platforms;
            that.safezones.push({
                width: 80 - that.level*20,
                x: domain*.15 + coordSize*.5*i + Math.random() * .7*domain,
                y: coordSize/2 + Math.random() * coordSize/2 - 20
            });
        }
        that.terrain = [];
        for (let i = 0; i <= platforms; ++i) {
            let prev = that.safezones[i-1];
            let curr = that.safezones[i];
            let beg = (i == 0 ? [0, coordSize/2] : [prev.x + prev.width/2, prev.y]);
            let end = (i == platforms ? [coordSize, coordSize/2] : [curr.x - curr.width/2, curr.y]);
            that.terrain = that.terrain.concat(RMD([beg, end]));
        }

        that.over = false;
        that.won = false;
        that.duration = 0;
        run = true;
    }

    that.update = function(elapsedTime) {
        let p1 = that.player;
        that.particleSystem.update(elapsedTime);
        p1.update(elapsedTime);
        if (that.won) {
            if (game.duration > 3000) {
                that.create();
            }
        }
        else if (that.collides(that.terrain, p1)) {
            let inZone = false;
            for (sz of that.safezones) {
                if (p1.center.x > sz.x - sz.width/2 + 10 && p1.center.x < sz.x + sz.width/2 - 10) {
                    inZone = true;
                }
            }
            if (inZone && p1.safeSpeed() && p1.safeAngle()) {
                success.play();
                that.won = true;
                p1.disable();
                that.level = 1;
                that.score += p1.getFuel() * 10;
                that.duration = 0;
            }
            else {
                failure.play();
                that.over = true;
                p1.disable();
                that.particleSystem.emitExplode(100);
                if (that.score > 0) {
                    updateScores(that.score);
                }
            }
        }
    }

    return that;
}
