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
    loader.style.visibility = "visible";

    fetchData(playerId, auth)
        .then( resp => {
            for (let respons of resp) {
                respons.json().then(r => handleData(r));
            }
            loader.style.visibility = "hidden";
        });
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
                console.log(data.status);
                if (data.status === 200) {
                    return data;
                } else {
                    console.log("Error!");
                    handleExpiredToken("");
                }
            }),
        fetch('http://localhost:8000/api/player/' + playerId + '/email', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": bearer
            }
        })
    ]);
}

function handleExpiredToken(msg) {
    if (msg !== "") {
        localStorage.setItem('errorMessage', msg);
    } else {
        localStorage.setItem('errorMessage', "Log opnieuw in.");
    }
    window.location.href = "http://localhost:8001/login.html";
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
    loader.style.visibility = "visible";

    sendData(playerId, auth)
        .then( resp => {
            if (resp[0].status === 204 && resp[1].status === 204) {
                let success = document.querySelector('#success');
                success.innerHTML = "";
                let div = document.createElement('div');
                div.innerHTML = "Voorkeuren opgeslagen";
                success.appendChild(div);
            }
            loader.style.visibility = "hidden"
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
        }),
        fetch('http://localhost:8000/api/player/' + playerId + '/email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": bearer
            },
            body: '{ "email": "'+email.value+'" }'
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