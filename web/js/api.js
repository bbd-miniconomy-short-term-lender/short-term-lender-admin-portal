import { clearSessionAndLogout, validateToken } from "./auth.js";
import { API_URL } from "./config.js";

const apiGetWithAuth = async (endpoint, options = {}) => {
    const token = sessionStorage.getItem('idToken');

    // validateToken(token);

    const headers = new Headers(options.headers || {});

    headers.set('Authorization', `Bearer ${token}`);

    const url = API_URL + endpoint;
    const result = await fetch(url, {
        ...options,
        headers,
    });

    if (result.status == 401) {
        clearSessionAndLogout();
    } else if (result.status == 200) {
        return result;
    }
}

export { apiGetWithAuth }