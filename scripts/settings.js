let defaultClosedColor = "#90EE90";

let dogs = 1;
let cats = 2;

let image;
let color;
let email;

document.addEventListener("DOMContentLoaded", function() {
    let loader = document.querySelector('.screen-cover');
    document.querySelector('#save-button').addEventListener('click', btn => {
        btn.preventDefault();
        image = document.querySelector('#images').value;
        color = document.querySelector('#closed-card-color').value;
        email = document.querySelector('#email-changer').value;

        loader.style.visibility = "visible";

        console.log("Image: " + image);
        console.log(color);
        console.log(email);
        loader.style.visibility = "hidden";
    })
    loader.style.visibility = "visible";
    getPlayerInfo();
    loader.style.visibility = "hidden";

});

function getPlayerInfo() {
    const token = localStorage.getItem('jwt')
    var tokens = token.split(".");

    let header = JSON.parse(atob(tokens[0]));
    let data = JSON.parse(atob(tokens[1]));
    let playerId = header.sub;
    let bearer = `Bearer ${token}`;

    fetchData(playerId, bearer)
        .then( resp => {
            for (let respons of resp) {
                respons.json().then(r => handleData(r));
            }
        })

}

function handleData(data){
    if (data instanceof Object) {
        console.log(data.preferred_api);
        console.log(data.color_closed);
        console.log(data.color_found);
    } else {
        console.log(data);
        email.value = data;
    }
}

function fetchData(playerId, bearer){
    return Promise.all([
        fetch('http://localhost:8000/api/player/' + playerId + '/preferences', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": bearer
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

function showJWT() {
    const token = localStorage.getItem('jwt')
    console.log(token);
    const auth = `Bearer ${token}`

    var tokens = token.split(".");

    console.log(JSON.parse(atob(tokens[0])));
    console.log(JSON.parse(atob(tokens[1])));
}