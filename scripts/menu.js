// This file contains the functionality for the main menu (non-canvas) stuff

function showScreen(id) {
    for (x of document.getElementsByClassName('active')) {
        x.classList.remove('active');
    }
    if (id == 'game') {
        initialize();
    }
    document.getElementById(id).classList.add('active');
}

document.addEventListener('keydown', e => {
    if (e.key == 'Escape') {
        showScreen('mainmenu');
        run = false;
    }
});

function setKey(id, key) {
    console.log(id);
    let button = document.getElementById(id);
    button.text = key;
}

function updateKey(id) {
    let button = document.getElementById(id);
    button.style.background = '#ee82ee';
    button.addEventListener('keydown', function(event) {  
        button.textContent = event.key;
        controls[id] = event.key;
        button.style.background = 'whitesmoke';
        localStorage['controls'] = JSON.stringify(controls);
    }, {once: true});
}

function updateScores(score = 0) {
    if (score > 0) {
        highscores.scores.push(score);
        highscores.scores.sort(function(a, b) { return a - b; });
        highscores.scores.reverse();
        localStorage['scores'] = JSON.stringify(highscores);
    }
    let ele = document.getElementById('scores');
    ele.innerHTML = '';
    for (score of highscores.scores) {
        let span = document.createElement('span');
        span.style.marginTop = '5px';
        span.textContent = '' + score;
        ele.append(span);
    }
}

showScreen('mainmenu');
getStorage();
