// you can replace this -- jsut for testing

document.getElementById('loginButton').addEventListener('click', function () {
    sessionStorage.setItem('idToken', 'idToken');
    sessionStorage.setItem('accessToken', 'accessToken');
    window.location.href = 'http://localhost:5500/';
});

// ====================