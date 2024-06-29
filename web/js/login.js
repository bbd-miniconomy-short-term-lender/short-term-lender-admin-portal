import { LOGIN_URL } from './config.js';

console.log(LOGIN_URL)
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginButton').addEventListener('click', function () {
        window.location.href = LOGIN_URL;
    });
});
