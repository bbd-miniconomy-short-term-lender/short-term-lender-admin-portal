import { LOGIN_PATH } from './config.js';

function validateSession() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = hashParams.get('id_token');
    const accessToken = hashParams.get('access_token');

    if (idToken && accessToken) {
        sessionStorage.setItem('idToken', idToken);
        sessionStorage.setItem('accessToken', accessToken);

        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
    } else {
        const storedIdToken = sessionStorage.getItem('idToken');
        const storedAccessToken = sessionStorage.getItem('accessToken');

        return (storedIdToken && storedAccessToken);
    }
}

const clearSessionAndLogout = () => {
    sessionStorage.clear();
    window.location.href = LOGIN_PATH;
}

export { validateSession, clearSessionAndLogout }