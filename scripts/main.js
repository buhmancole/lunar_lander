// Cole Buhman (A02228854) - HW3
// This file contains the main functions (initialize/gameloop) and some utility functions

let canvas = null;
let context = null;
let game = null;
let prevTime = null;
let run = false;
let controls = {
    thrust: 'w', 
    rotateLeft: 'a',
    rotateRight: 'd'
};

let coordSize = document.getElementById('canvas').width;
let highscores = { scores: [] };
let score = null;
let actions = [];
let keyboard = input.Keyboard();

// local storage utility function
function getStorage() {
    let stored = localStorage.getItem('scores');
    if (stored !== null) {
        highscores.scores = JSON.parse(stored).scores;
    }
    stored = localStorage.getItem('controls');
    if (stored !== null) {
        controls = JSON.parse(stored);
        document.getElementById('thrust').textContent = controls.thrust;
        document.getElementById('rotateLeft').textContent = controls.rotateLeft;
        document.getElementById('rotateRight').textContent = controls.rotateRight;
    }
    updateScores();
}

// random gaussian utility function
function gausRand() {
    let num = 0;
    for (let i = 0; i < 6; ++i) {
        num += Math.random() / 6;
    }
    return num - .5;
}

// random midpoint displacement utility function
function RMD(coords) {
    let roughness = 3.0;
    let displacement = roughness * gausRand() * (coords[1][0] - coords[0][0]);
    let midx = (coords[0][0] + coords[1][0]) / 2;
    let midy = (coords[0][1] + coords[1][1]) / 2 + displacement;
    if (midy > coordSize - 10 || midy < coordSize / 4) {
        midy -= displacement;
    }
    if (coords[1][0] - coords[0][0] > 20) {
        let left = RMD([coords[0], [midx, midy]]);
        let right = RMD([[midx, midy], coords[1]]);
        return left.concat(right);
    }
    return [coords[0], [midx, midy], coords[1]];
}

// keys are bound to their actions here
function processInput(elapsedTime) {
    keyboard.update(elapsedTime);
}

// update game logic according to actions and move character
function update(elapsedTime) {
    game.duration += elapsedTime;
    game.update(elapsedTime);
}

// render with updated logic
function render(elapsedTime) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderBackground();
    renderTerrain(game.terrain);
    renderFire();
    renderCharacter(game.player);
    renderStatus();
}

function gameLoop(time) {
    let elapsedTime = time - prevTime;
    prevTime = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render(elapsedTime);

    if (run) {
        requestAnimationFrame(gameLoop);
    }
}

function initialize() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    game = new GameModel({});
    coords = game.create();
    
    prevTime = performance.now();
    requestAnimationFrame(gameLoop);
}
