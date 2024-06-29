import { validateSession, clearSessionAndLogout } from './auth.js';
import { apiGetWithAuth } from './api.js';


// ========================================================
//                       CONSTANTS
// ========================================================

const ID_LOGOUT_BUTTON = 'logoutButtonHeader';
const ID_REPAYMENT_DIAL = 'repaymentDial';
const ID_INTEREST_RATE_METRIC = 'interestRateMetric';
const ID_LOAN_TABLE = 'loanTableBody';

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

    // -== Subscribe Event Listeners ==-

    document.getElementById(ID_LOGOUT_BUTTON).addEventListener('click', clearSessionAndLogout);
    document.getElementById(ID_LOAN_TABLE).addEventListener('click', handleTableDrillDown);

    // -===============================-

    // -==      Init Data View       ==-

    updateDialPercent(ID_REPAYMENT_DIAL, 0);
    updateSimpleMetric(ID_INTEREST_RATE_METRIC, 0);
    loadTable();

    // -===============================-

}

document.addEventListener('DOMContentLoaded', initIndex);

// ========================================================

const loadTable = () => {
    const thing = [
        {
            clientId: '1',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: '2',
            clientName: 'x',
            loanAmount: 'x',
            interestRate: 'x',
            loanTerm: 'x',
            status: 'x',
        },
        {
            clientId: '3',
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

/**
 * Handler for the `click` event on a row in the loan
 * information table, to drill down.
 */
const handleTableDrillDown = async () => {
    let target = event.target;

    while (target && target.nodeName !== 'TR') {
        target = target.parentElement;
    }

    if (target) {
        const clientId = target.cells[0].textContent;
        alert('Client ID: ' + clientId);
    }
}

// ========================================================
//                    Auxillary Methods
// ========================================================

/**
 * Updates the dial percentage.
 * @param {string} dialId 
 * @param {number} newPercent 
 */
const updateDialPercent = (dialId, newPercent) => {
    const dial = document.getElementById(dialId);
    dial.setAttribute("data-percent", newPercent);
    dial.style.setProperty("--percent", newPercent + "%");
}

/**
 * Sets a the value of a metric.
 * @param {string} metricId 
 * @param {number} newValue 
 */
const updateSimpleMetric = (metricId, newValue) => {
    const metric = document.getElementById(metricId);
    metric.setAttribute("data-percent", newValue);
}

// ========================================================