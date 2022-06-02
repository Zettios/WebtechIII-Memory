document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.register-button').addEventListener('click', btn => {
        btn.preventDefault();
        let username = document.querySelector('#username').value;
        let email = document.querySelector('#email').value;
        let password = document.querySelector('#password').value;

        if (username === "" || password === "" || password === "") handleEmptyRegister();

        fetch('http://localhost:8000/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: '{"username":"' + username + '","password":"' + password + '","email":"' + email + '"}'
            })
            .then(resp => console.log(resp["status"]))

    });
});

function handleEmptyRegister() {
    console.log("TODO: handle empty login data.");
}

function handleFailedRegister() {

}

function handleSuccessRegister(json) {
    localStorage.setItem('jwt', json.token);
    window.location.href = "http://localhost:8001/game.html";
}

function showJWT() {
    const token = localStorage.getItem('jwt')
    const auth = `Bearer ${token}`

    var tokens = token.split(".");

    console.log(JSON.parse(atob(tokens[0])));
    console.log(JSON.parse(atob(tokens[1])));
}