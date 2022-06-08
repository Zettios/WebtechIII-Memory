document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.register-button').addEventListener('click', btn => {
        btn.preventDefault();
        document.querySelector('#errors').innerHTML = "";
        let username = document.querySelector('#username').value;
        let email = document.querySelector('#email').value;
        let password = document.querySelector('#password').value;
        let passwordRepeat = document.querySelector('#password-repeat').value;

        if(!validateForm(username, email, password, passwordRepeat)){
            fetch('http://localhost:8000/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: '{"username":"' + username + '","password":"' + password + '","email":"' + email + '"}'
                })
                .then(resp => handleLogin(resp))
        }
    });
});

function validateForm(username, email, password, passwordRepeat) {
    let errors = document.querySelector('#errors');
    let foundError = false;

    if (username === "") {
        foundError = appendError(errors, "- Gebruikersnaam is leeg!");
    }

    if (email === "") {
        foundError = appendError(errors, "- Email is leeg!");
    } else {
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        if (!regexExp.test(email)) {
            foundError = appendError(errors, "- Email heeft geen valide formaat!");
        }
    }

    if (password === "") {
        foundError = appendError(errors, "- Wachtwoord is leeg!");
    }

    if (passwordRepeat === "") {
        foundError = appendError(errors, "- Herhaling van wachtwoord ontbreekt!");
    }

    if (password !== passwordRepeat) {
        foundError = appendError(errors, "- Wachtwoorden komen niet overeen!");
    }
    return foundError;
}

function appendError(errors, msg) {
    let div = document.createElement('div');
    div.innerHTML = msg;
    errors.appendChild(div);
    return true;
}

function handleLogin(status) {
    switch (status["status"]) {
        case 201:
            handleSuccessRegister();
            break;
        case 400:
            handleFailedRegister();
            break;
        default:
            handleFailedRegister();
            break;
    }
}

function handleFailedRegister() {
    let errors = document.querySelector('#errors');
    appendError(errors, "- An error occurred!")
}

function handleSuccessRegister(json) {
    window.location.href = "http://localhost:8001/login.html";
}

function showJWT() {
    const token = localStorage.getItem('jwt')
    const auth = `Bearer ${token}`

    var tokens = token.split(".");

    console.log(JSON.parse(atob(tokens[0])));
    console.log(JSON.parse(atob(tokens[1])));
}