// This file contains all render functionality (including for images and sounds)

function prepareImg(src) {
    let img = new Image();
    img.isReady = false;
    img.onload = function() {
        this.isReady = true;
    }
    img.src = src;
    return img;
}

let background = prepareImg('img/background.jpeg');
let fire = prepareImg('img/fire.png');
let landerImg = prepareImg('img/lander.png');

function prepareSound(src) {
    let sound = new Audio();
    sound.src = src;
    sound.volume = .15;
    return sound;
}

let engine = prepareSound('sounds/rocket.wav');
let success = prepareSound('sounds/success.wav');
let failure = prepareSound('sounds/failure.wav');

function renderText(text, safe, line = 0) {
    let green = 'rgb(0, 255, 0)';
    let white = 'rgb(255, 255, 255)';
    context.font = '20px arial';
    context.fillStyle = safe ? green : white;
    context.fillText(text, 870, 50 + 28*line);
}

function renderHeading(text, line = 0) {
    context.font = '40px arial';
    context.fillStyle = 'rgb(255, 255, 255)'
    let width = context.measureText(text).width;
    context.fillText(text, 500 - width/2, 300 + 48*line);
}

function renderBackground() {
    if (background.isReady) {
        context.drawImage(background, -canvas.width*.2, 0, canvas.width*1.4, canvas.height);
    }
}

function renderTerrain(coords) {
    // Render the terrain first
    context.beginPath();
    context.moveTo(coords[0][0], coords[0][1]);
    for (x of coords) {
        context.lineTo(x[0], x[1]);
    }
    context.lineTo(coordSize, coordSize);
    context.lineTo(0, coordSize);
    context.closePath();
    context.strokeStyle = 'rgb(0, 0, 0)';
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = 'rgb(160, 160, 180)';
    context.fill();

    // Draw a black border around the whole canvas
    context.beginPath();
    context.moveTo(1, 1);
    context.lineTo(coordSize - 1, 1);
    context.lineTo(coordSize - 1, coordSize - 1);
    context.lineTo(1, coordSize - 1);
    context.closePath();
    context.strokeStyle = 'rgb(0, 0, 0)';
    context.lineWidth = 6;
    context.stroke();
}

function renderFire() {
    if (fire.isReady) {
        Object.getOwnPropertyNames(game.particleSystem.particles).forEach( function(value) {
            let particle = game.particleSystem.particles[value];
            context.save();

            context.translate(particle.center.x, particle.center.y);
            context.rotate(particle.rotation);
            context.translate(-particle.center.x, -particle.center.y);

            context.drawImage(fire,
                particle.center.x - particle.size.x / 2,
                particle.center.y - particle.size.y / 2,
                particle.size.x, particle.size.y);

            context.restore();
        });
    }
}

function renderCharacter(player) {
    if (!game.over) {
        player.draw();
    }
}

function renderStatus() {
    let p1 = game.player;
    renderText('fuel: ' + p1.getFuel(), p1.hasFuel(), 0);
    renderText('speed: ' + p1.getSpeed(), p1.safeSpeed(), 1);
    renderText('angle: ' + p1.getAngle(), p1.safeAngle(), 2);
    if (game.over) {
        renderHeading('Game Over', 0);
        renderHeading('Score: ' + game.score, 1);
    }
    if (game.won) {
        renderHeading('You Won!', 0);
        renderHeading(3 - Math.floor(game.duration/1000), 1);
    }
}
