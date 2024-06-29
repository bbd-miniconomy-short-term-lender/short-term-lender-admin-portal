import { validateSession, clearSessionAndLogout } from './auth.js';
import { apiGetWithAuth } from './api.js';


// ========================================================
//                       CONSTANTS
// ========================================================

const ID_LOGOUT_BUTTON = 'logoutButtonHeader';

// ========================================================

// ========================================================
//                         INIT
// ========================================================

/**
 * Called once when the page is loaded
 * to initialize the index / home page.
 */
const initIndex = () => {
    if (!validateSession()) {
        clearSessionAndLogout();
    }

    document.getElementById(ID_LOGOUT_BUTTON).addEventListener('click', clearSessionAndLogout);

    const dial = document.getElementById("dial");
    const percent = dial.getAttribute("data-percent");
    dial.style.setProperty("--percent", percent + "%");

    loadTable();
}

document.addEventListener('DOMContentLoaded', initIndex);

// ========================================================

const loadTable = () => {
    const thing = [
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: 'x',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
    ];

    thing.forEach((tin) => {
        addNewRow(tin.clientId, tin.clientName, tin.loanAmount, tin.interestRate, tin.loanTerm, tin.status);
    });
}

const addNewRow = (clientId, clientName, loanAmount, interestRate, loanTerm, status) => {
    const tableBody = document.getElementById('loanTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${clientId}</td>
        <td>${clientName}</td>
        <td>${loanAmount}</td>
        <td>${interestRate}</td>
        <td>${loanTerm}</td>
        <td>${status}</td>
    `;

    tableBody.appendChild(newRow);
}