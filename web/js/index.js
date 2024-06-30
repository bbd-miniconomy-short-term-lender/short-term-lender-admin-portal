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

    const dummyLoanRecords = [
        {
            personaId: '1',
            loanAmount: '100',
            status: 'Active',
        },
        {
            personaId: '2',
            loanAmount: '200',
            status: 'Paid Off',
        },
        {
            personaId: '3',
            loanAmount: '300',
            status: 'Active',
        },
    ];
    populateLoanTable(dummyLoanRecords);

    // -===============================-

}

document.addEventListener('DOMContentLoaded', initIndex);

// ========================================================

// ========================================================
//                 MAIN METHODS / FUNCTIONS
// ========================================================

/**
 * Takes an array of records used to populate
 * the rows of the dashboard table.
 * @param {Object} records 
 */
const populateLoanTable = (records) => {
    const tableBody = document.getElementById(ID_LOAN_TABLE);
    records.forEach((record) => {
        const newRow = document.createElement('tr');
        const { personaId, loanAmount, status } = record;

        // Create personaId cell
        const personaIdCell = document.createElement('td');
        personaIdCell.textContent = personaId;
        newRow.appendChild(personaIdCell);

        // Create loanAmount cell
        const loanAmountCell = document.createElement('td');
        loanAmountCell.textContent = loanAmount;
        newRow.appendChild(loanAmountCell);

        // Create status cell
        const statusCell = document.createElement('td');
        statusCell.textContent = status;
        newRow.appendChild(statusCell);

        tableBody.appendChild(newRow);
    });
}

/**
 * Handler for the `click` event on a row in the loan
 * information table, to drill down.
 */
const handleTableDrillDown = async () => {
    let target = event.target;

    if (target.nodeName === 'TH' || target.parentElement.nodeName === 'THEAD') {
        return;
    }

    while (target && target.nodeName !== 'TR') {
        target = target.parentElement;
    }

    if (target) {
        const personaId = target.cells[0].textContent;
        alert('Clicked Persona ID: ' + personaId);
        // here we will drill into this persona record @Rotenda
    }
}

// ========================================================

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