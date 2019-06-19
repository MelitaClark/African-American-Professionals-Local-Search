


function watchLoginForm() {
    $('body').on('submit', '.signin-form', event => {
        console.log('clicked');
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        fetch('/api/auth/login', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                localStorage.authToken = data.authToken
                window.location = 'submitPage.html'
            })
    });
}

function watchRegisterForm() {
    $('.register-form').submit(event => {
        event.preventDefault();
        const username = $('#userName').val();
        const password = $('#password').val();
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        fetch('/api/users', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                fetch('/api/auth/login', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    localStorage.authToken = data.authToken
                    window.location = 'submitPage.html'
                })
            })
    })
}
function handleApp() {
    watchRegisterForm();
    watchLoginForm();
}
$(handleApp);