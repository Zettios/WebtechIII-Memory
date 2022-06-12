let defaultClosedColor = "#90EE90";
let dogs = 1;
let cats = 2;
let lorem = 3;

const token = localStorage.getItem('jwt')
const auth = `Bearer ${token}`
const header = JSON.parse(atob(token.split(".")[0]));
const data = JSON.parse(atob(token.split(".")[1]));
const playerId = header.sub;

let loader

let image;
let color;
let email;

document.addEventListener("DOMContentLoaded", function() {
    image = document.querySelector('#images');
    color = document.querySelector('#closed-card-color');
    email = document.querySelector('#email-changer');

    loader = document.querySelector('.screen-cover');
    document.querySelector('#save-button').addEventListener('click', btn => {
        btn.preventDefault();
        sendNewPlayerInfo()
    })

    getPlayerInfo();
});


// ----- GETTING DATA FUNCTIONS -----

function getPlayerInfo() {
    showLoadingScreen();

    fetchData(playerId, auth)
        .then( resp => {
            if (resp[0] === 401 || resp[1] === 401) {
                throw new Error("Log opnieuw in.");
            }
            hideLoadingScreen();
        })
        .catch(err => {
            handleExpiredToken(err);
        })
}

function fetchData(playerId, bearer){
    return Promise.all([
        fetch('http://localhost:8000/api/player/' + playerId + '/preferences', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": bearer
            }
        })
            .then(data => {
                if (data.status === 401) {
                    throw new Error();
                }
                return data
            })
            .then( resp => resp.json() )
            .then( json => handleData(json) )
            .catch(err => {
                return 401;
            }),
        fetch('http://localhost:8000/api/player/' + playerId + '/email', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": bearer
            }
        })
            .then(data => {
                if (data.status === 401) {
                    throw new Error("Log opnieuw in.");
                }
                return data;
            })
            .then( resp => resp.json() )
            .then( json => handleData(json) )
            .catch(err => {
                return 401;
            }),
    ]);
}

function handleData(data){
    if (data instanceof Object) {
        image.value = getPreferredAPI(data.preferred_api);
        if (data.color_closed === "") {
            color.value = defaultClosedColor;
        } else {
            color.value = data.color_closed;
        }
    } else {
        email.value = data;
    }
}

function getPreferredAPI(apiCode) {
    switch (apiCode) {
        case 'dogs':
            return dogs;
        case 'cats':
            return cats;
        case 'lorem':
            return lorem;
        default:
            return dogs;
    }
}

// ----- SAVING DATA FUNCTIONS -----

function sendNewPlayerInfo() {
    showLoadingScreen();

    sendData(playerId, auth)
        .then( resp => {
            if (resp[0] === 401 || resp[1] === 401){
                throw new Error("Log opnieuw in.");
            } else if (resp[0] === 204 && resp[1] === 204) {
                let success = document.querySelector('#success');
                success.innerHTML = "";
                let div = document.createElement('div');
                div.innerHTML = "Voorkeuren opgeslagen";
                success.appendChild(div);
            }
            hideLoadingScreen();
        })
        .catch(err => {
            handleExpiredToken(err);
        })
}

function sendData(playerId, bearer) {
    return Promise.all([
        fetch('http://localhost:8000/api/player/' + playerId + '/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": bearer
            },
            body: '{ "api": "'+imageValToAPI(image.value)+'", "color_closed": "'+color.value+'", "color_found": "" }'
        })
            .then(data => {
                if (data.status === 401) {
                    throw new Error();
                }
                return data.status;
            })
            .catch(err => {
                return 401;
            }),
        fetch('http://localhost:8000/api/player/' + playerId + '/email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": bearer
            },
            body: '{ "email": "'+email.value+'" }'
        })
            .then(data => {
                if (data.status === 401) {
                    throw new Error();
                }
                return data.status;
            })
            .catch(err => {
                return 401;
            })
    ]);
}

function imageValToAPI(value){
    switch (parseInt(value)) {
        case dogs:
            return 'dogs';
        case cats:
            return 'cats';
        case lorem:
            return 'lorem';
        default:
            return 'dogs';
    }
}

// ----- MISC FUNCTIONS -----

function handleExpiredToken(msg) {
    if (msg !== "") {
        localStorage.setItem('errorMessage', msg);
    } else {
        localStorage.setItem('errorMessage', "Log opnieuw in.");
    }
    window.location.href = "http://localhost:8001/login.html";
}

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

