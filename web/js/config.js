// -== configuration file - loaded in during deployment ==-
// for local dev, this is what is used
// when deployed, it will be overridden by the prod values

const LOGIN_PATH = 'http://localhost:5500/login.html';
// const API_URL = 'https://api.loans.projects.bbdgrad.com:5000'
const API_URL = 'http://localhost:5000'

export { LOGIN_PATH, API_URL }