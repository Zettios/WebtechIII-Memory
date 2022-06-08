document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.login-button').addEventListener('click', btn => {
        btn.preventDefault();
        document.querySelector('#errors').innerHTML = "";
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;

        if (!validateLogin(username, password)) {
            fetch('http://localhost:8000/api/login_check',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: '{"username":"'+username+'","password":"'+password+'"}'
                })
                .then( resp => resp.json() )
                .then( json => {
                    if (json.hasOwnProperty('code')) {
                        handleFailedLogin();
                    } else {
                        handleSuccessLogin(json);
                    }
                } )
        }
    })
});

function validateLogin(username, password) {
    let errors = document.querySelector('#errors');
    let foundError = false;

    if (username === "") {
        foundError = appendError(errors, "- Gebruikersnaam is leeg!");
    }

    if (password === "") {
        foundError = appendError(errors, "- Wachtwoord is leeg!");
    }

    return foundError;
}

function appendError(errors, msg) {
    let div = document.createElement('div');
    div.innerHTML = msg;
    errors.appendChild(div);
    return true;
}

function handleSuccessLogin(json) {
    localStorage.setItem('jwt', json.token);
    window.location.href = "http://localhost:8001/game.html";
}

function handleFailedLogin() {
    let errors = document.querySelector('#errors');
    appendError(errors, "- Login niet succesvol! Controleer je gegevens.");
}



function showJWT() {
    const token = localStorage.getItem('jwt')
    const auth = `Bearer ${token}`

    var tokens = token.split(".");

    console.log(JSON.parse(atob(tokens[0])));
    console.log(JSON.parse(atob(tokens[1])));
}