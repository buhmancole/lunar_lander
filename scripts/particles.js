// This file contans the particle system, which emits particles for explosions and engines

let ParticleSystem = function(spec) {
    let nextName = 1;
    let particles = {};

    function create(dx, dy, mult, life) {
        let size = Math.abs(gausRand() + .5) * 40;
        let p = {
                center: { x: spec.center.x, y: spec.center.y },
                size: { x: size, y: size},  // Making square particles
                direction: { x: dx, y: dy },
                speed: Math.abs(gausRand() + .5) * mult, // pixels per second
                rotation: 0,
                lifetime: Math.abs(gausRand() + .5) * life,    // How long the particle should live, in seconds
                alive: 0    // How long the particle has been alive, in seconds
        };
        return p;
    }

    function emitExplode(num) {
        for (let i = 0; i < num; ++i) {
            particles[nextName++] = create(gausRand(), gausRand(), 2000, 2);
        }
    }

    function emitThrust(num, dx, dy) {
        for (let i = 0; i < num; ++i) {
            particles[nextName++] = create(dx, dy, 800, .5);
        }
    }
    
    function update(elapsedTime) {
        let removeMe = [];
        
        Object.getOwnPropertyNames(particles).forEach(function(value, index, array) {
            let particle = particles[value];

            particle.alive += elapsedTime/1000;
            particle.center.x += (particle.direction.x * particle.speed * elapsedTime/1000);
            particle.center.y += (particle.direction.y * particle.speed * elapsedTime/1000);
            particle.rotation += particle.speed;

            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });
        
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    }

    let api = {
        update: update,
        get particles() { return particles; },
        emitExplode: emitExplode,
        emitThrust: emitThrust
    };

    return api;
}

