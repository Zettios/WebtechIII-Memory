document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.login-button').addEventListener('click', btn => {
        btn.preventDefault();
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;

        if (username === "" || password === "") handleEmptyLogin();

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
                console.log(json);
                if (json.hasOwnProperty('code')) {
                    console.log("Login failed! Status code: " + json.code);
                    handleFailedLogin();
                } else {
                    console.log("Login success!");
                    handleSuccessLogin(json);
                }
            } )
            // .then ( json =>  )
            // .then( e => showJWT() )
    })
});

function handleEmptyLogin() {
    console.log("TODO: handle empty login data.");
}

function handleFailedLogin() {

}

function handleSuccessLogin(json) {
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