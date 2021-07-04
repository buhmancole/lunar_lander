// This file contains the lander object, which the player controls

let Lander = function(spec) {
    let that = {};

    that.image = spec.image;
    that.thrustRate = spec.thrustRate;
    that.rotationRate = spec.rotationRate;
    that.center = spec.center;
    that.radius = spec.radius;
    that.rotation = spec.rotation;
    that.momentum = spec.momentum;
    that.fuel = spec.fuel;
    that.sound = false;
    that.enabled = true;
    
    that.update = function(elapsedTime) {
        console.log(elapsedTime);
        if (that.enabled) {
            that.momentum.y += .5;
            that.center.x += that.momentum.x * elapsedTime/1000;
            that.center.y += that.momentum.y * elapsedTime/1000;
            if (that.rotation < 0) {
                that.rotation += 2*Math.PI;
            }
            if (that.rotation >= 2*Math.PI) {
                that.rotation -= 2*Math.PI;
            }
        }
        that.sound ? engine.play() : engine.pause();
        that.sound = false;
    }
    that.rotateRight = function(elapsedTime) {
        if (that.enabled) {
            that.rotation += that.rotationRate * elapsedTime/1000;
        }
    }
    that.rotateLeft = function(elapsedTime) {
        if (that.enabled) {
            that.rotation -= that.rotationRate * elapsedTime/1000;
        }
    }
    that.thrust = function(elapsedTime) {
        if (that.enabled && that.hasFuel()) {
            that.sound = true;
            that.fuel -= elapsedTime/1000;
            if (that.fuel < 0) {
                that.fuel = 0;
            }
            game.particleSystem.emitThrust(4, -Math.sin(that.rotation), Math.cos(that.rotation));
            that.momentum.x += Math.sin(that.rotation) * that.thrustRate * elapsedTime;
            that.momentum.y -= Math.cos(that.rotation) * that.thrustRate * elapsedTime;
        }
    }
    that.getSpeed = function() {
        return Math.floor(Math.sqrt(that.momentum.x * that.momentum.x + that.momentum.y * that.momentum.y));
    }
    that.getFuel = function() {
        return Math.floor(that.fuel * 10) / 10;
    }
    that.hasFuel = function() {
        return that.fuel > 0;
    }
    that.safeSpeed = function() {
        return that.getSpeed() < 100;
    }
    that.safeAngle = function() {
        return that.getAngle() < 6 || that.getAngle() > 354;
    }
    that.disable = function() {
        that.enabled = false;
    }
    that.enable = function() {
        that.enabled = true;
    }
    that.getAngle = function() {
        return Math.round(that.rotation*180/Math.PI);
    }
    that.draw = function() {
        if (that.image.isReady) {
            context.save();
            context.translate(that.center.x, that.center.y);
            context.rotate(that.rotation);
            context.translate(-that.center.x, -that.center.y);

            context.drawImage(that.image, that.center.x - 50, that.center.y - 50, 100, 100);
            context.restore();
        }
    }

    return that;
}
