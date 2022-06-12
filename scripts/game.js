let defaultClosedColor = "#90EE90";
let defaultAPI = 'dogs';
let prefClosedColor;
let prefApi;

const token = localStorage.getItem('jwt')
const auth = `Bearer ${token}`
const header = JSON.parse(atob(token.split(".")[0]));
const data = JSON.parse(atob(token.split(".")[1]));
const playerId = header.sub;

let cards;

let cardPairs = [];
let openCards = [];

let intervalTimer;

let amountOfCards = 0;
let foundPairs = 0;

const PRE_GAME = 0;
const ACTIVE_GAME = 1;

let gameState = PRE_GAME;

// ============= PAGE START UP =============

document.addEventListener("DOMContentLoaded", function() {
    getAllCardsReferences();
    amountOfCards = cards.length;
    for (let i = 0; i < cards.length; i++) {
        cards[i].id = "card_" + (i+1);
        cards[i].addEventListener("click", cardHandler);
    }

    document.querySelector('.start_button').onclick = initialiseGame;

    getData().then(r => console.log("Success!"));
});

function getAllCardsReferences() {
    cards = document.querySelectorAll('.memory_cards');
}

// ============= SETTINGS FUNCTIONS =============

function updateClosed() {
    document.querySelectorAll('.card_closed').forEach( element => element.style.background = prefClosedColor);
}

function getData() {
    showLoadingScreen();
    return Promise.all([
        fetch('http://localhost:8000/scores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
            .then( resp => resp.json() )
            .then( json => {
                json.sort((a, b) => a.score - b.score);
                topFiveFunctionality(json);

                return 200;
            } ),
        fetch('http://localhost:8000/api/player/' + playerId + '/preferences', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": auth
            }
        })
            .then( data => {
                if (data.status === 401) {
                    throw new Error("Log opnieuw in.");
                }
                return data;
            })
            .then( resp => resp.json())
            .then( json => {
                json.color_closed === "" ? prefClosedColor = defaultClosedColor : prefClosedColor = json.color_closed;
                json.preferred_api === "" ? prefApi = defaultAPI : prefApi = json.preferred_api;
                updateClosed();
                hideLoadingScreen();

                return 200;
            })
            .catch(err => {
                handleExpiredToken(err);
            })
    ]);
}

function refreshTopFive() {
    const token = localStorage.getItem('jwt')

    fetch('http://localhost:8000/scores',
        {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then( resp => resp.json() )
        .then( json => {
            json.sort((a, b) => a.score - b.score);
            topFiveFunctionality(json);
        } )
}

function topFiveFunctionality(json) {
    let length = ((json.length < 5) ? json.length : 5);

    let list = document.querySelector('#players-top');
    list.innerHTML = "";
    for (let i = 0; i < length; i++) {
        let entry = document.createElement('li');
        entry.textContent = json[i].username+': '+json[i].score;
        list.appendChild(entry);
    }
}

// ============= INI GAME FUNCTIONS =============

function initialiseGame() {
    gameState = ACTIVE_GAME;
    openCards = [];
    resetPairsCounter()
    iniCardsForGame(cards.length/2)
}

function resetPairsCounter() {
    foundPairs = 0;
    document.getElementById("found-pairs").innerHTML = "Gevonden kaart paren: 0";
}

function iniCardsForGame(amount) {
    showLoadingScreen();

    switch (prefApi) {
        case "dogs":
            fetch("https://dog.ceo/api/breeds/image/random/"+amount)
                .then((response) => response.json())
                .then(data => data.message)
                .then(message => setCards(message));
            break;
        case "cats":
            fetch("https://api.thecatapi.com/v1/images/search?limit="+amount+"&mime_types=jpg,png")
                .then((response) => response.json())
                .then(data => processCatAPI(data))
                .then(message => setCards(message));
            break;
        case "lorem":
            fetch("https://picsum.photos/v2/list?page=0&limit="+amount)
                .then((response) => response.json())
                .then(data => processLoremAPI(data))
                .then(message => setCards(message));
            break;
        default:
            fetch("https://dog.ceo/api/breeds/image/random/"+amount)
                .then((response) => response.json())
                .then(data => data.message)
                .catch(error => { return error.status } )
                .then(message => setCards(message));
            break;
    }
}

function processCatAPI(data) {
    let cats = [];
    for (const catsKey in data) {
        cats[catsKey] = data[catsKey].url;
    }
    return cats;
}

function processLoremAPI(data) {
    let lorem = [];
    for (const loremKey in data) {
        lorem[loremKey] = data[loremKey].download_url;
    }
    return lorem;
}


function setCards(message) {
    let images = []

    for (let i = 0; i < message.length; i++) {
        images[i] = message[i];
    }

    let dupe = images.slice(0);
    let complete = shuffleArray(images.concat(dupe));

    for (let i = 0; i < cards.length; i++) {
        cardPairs[cards[i].id] = complete[i];
    }

    resetCards();
    hideLoadingScreen();
    startTimer();
}

function shuffleArray(arrayOfImages) {
    for (let i = arrayOfImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arrayOfImages[i];
        arrayOfImages[i] = arrayOfImages[j];
        arrayOfImages[j] = temp;
    }

    return arrayOfImages;
}

function resetCards() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add('card_closed')
        if (cards[i].classList.contains("card_open")) {
            cards[i].classList.remove('card_open')
        } else if (cards[i].classList.contains("card_matched")) {
            cards[i].style.opacity = null;
            cards[i].classList.remove('card_matched')
        }
    }
    updateClosed();
}

function startTimer() {
    let startTime = 0;
    stopTimer();
    intervalTimer = setInterval(myTimer, 1000);

    function myTimer() {
        startTime++;
        document.querySelector("#timer").innerHTML = "Verlopen tijd: "+startTime.toString()+" seconden";
    }
}

function stopTimer(){
    if (intervalTimer !== undefined) {
        clearInterval(intervalTimer);
    }
}

// ============= DURING GAME FUNCTIONS =============

function cardHandler(e) {
    if (gameState === PRE_GAME) return;
    if (e.target.classList.contains("card_closed")) {
        resetNonePairs();

        e.target.classList.add('card_open')
        e.target.classList.remove('card_closed')
        e.target.style.backgroundImage = "url("+cardPairs[e.target.id]+")";
        e.target.style.backgroundPosition = "center";
        e.target.style.backgroundSize = "cover";
        openCards.push(e.target.id);

        checkForPairs();
        checkForWin();
    }
}

function resetNonePairs(){
    if (openCards.length >= 2) {
        for (const openCardsKey in openCards) {
            let card = document.getElementById(openCards[openCardsKey]);
            card.classList.remove('card_open')
            card.classList.add('card_closed')
            card.style.background = prefClosedColor;
        }
        openCards = [];
    }
}

function checkForPairs(){
    if (openCards.length === 2) {
        if (cardPairs[openCards[0]] === cardPairs[openCards[1]]) {
            for (let i = 0; i < openCards.length; i++) {
                let card = document.getElementById(openCards[i]);
                if (card.classList.contains("card_open")) {
                    card.classList.remove('card_open')
                    card.classList.add('card_matched')
                    card.style.opacity = "50%";
                }
            }
            openCards = [];
            foundPairs++;
            document.getElementById("found-pairs").innerHTML = "Gevonden kaart paren: " + foundPairs.toString();
        }
    }
}

// ============= VICTORY =============

function checkForWin() {
    if (foundPairs === (amountOfCards/2)) {
        gameState = PRE_GAME;
        stopTimer();
        showVictoryScreen();
        saveGame();
        resetCards();
    }

    // --- Uncomment for testing ---
    // if (foundPairs === 1) {
    //     gameState = PRE_GAME;
    //     stopTimer();
    //     showVictoryScreen();
    //     saveGame();
    //     resetCards();
    // }
}

function showVictoryScreen() {
    document.getElementById("win-text").innerHTML = "Je hebt gewonnen!";
    let victory = document.getElementById("victory");
    victory.ariaHidden = "false";
    victory.style.visibility = "visible";
    let vTimer = setInterval(victoryTimer, 3500);

    function victoryTimer() {
        let victory = document.getElementById("victory");
        victory.ariaHidden = "true";
        victory.style.visibility = "hidden";
        document.getElementById("win-text").innerHTML = "";
        clearInterval(vTimer);
    }
}

function saveGame() {
    let timer = document.querySelector("#timer");
    fetch('http://localhost:8000/game/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": auth
        },
        body: '{"id": "'+playerId+'", "score": "'+timer.innerHTML.split(" ")[2]+'", "api": "'+prefApi+'", "color_closed": "'+prefClosedColor+'", "color_found": ""}'
    })
        .then(resp => refreshTopFive())
}

// ============= MISC FUNCTIONS =============

function showLoadingScreen() {
    let loading = document.getElementById("loading");
    loading.ariaHidden = "false";
    loading.style.visibility = "visible";
    document.getElementById("loading-text").innerHTML = "Loading..."
}

function hideLoadingScreen() {
    let loading = document.getElementById("loading");
    loading.ariaHidden = "true";
    loading.style.visibility = "hidden";
}


function handleExpiredToken(msg) {
    if (msg !== "") {
        localStorage.setItem('errorMessage', msg);
    } else {
        localStorage.setItem('errorMessage', "Log opnieuw in.");
    }
    window.location.href = "http://localhost:8001/login.html";
}
