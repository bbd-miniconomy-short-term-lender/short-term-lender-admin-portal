// -== configuration file - loaded in during deployment ==-
// for local dev, this is what is used
// when deployed, it will be overridden by the prod values

// const API_URL = 'https://api.loans.projects.bbdgrad.com:5000'
const API_URL = 'http://localhost:5000'
const LOGIN_URL = "https://bbdloans.auth.eu-west-1.amazoncognito.com/login?client_id=5m671l5io0gcnnvlru34784ac2&response_type=token&scope=email+openid+profile&redirect_uri=http://localhost:5500";
const LOGOUT_URL = "https://bbdloans.auth.eu-west-1.amazoncognito.com/logout?client_id=5m671l5io0gcnnvlru34784ac2&response_type=token&scope=email+openid+profile&redirect_uri=http://localhost:5500";

export { LOGIN_URL, API_URL, LOGOUT_URL }