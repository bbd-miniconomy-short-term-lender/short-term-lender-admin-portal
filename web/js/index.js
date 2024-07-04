import { validateSession, clearSessionAndLogout, getUsername } from './auth.js';
import { apiFetchWithAuth } from './api.js';

// ========================================================
//                       CONSTANTS
// ========================================================

const ID_LOGOUT_BUTTON = 'logoutButtonHeader';
const ID_REPAYMENT_DIAL = 'repaymentDial';
const ID_INTEREST_RATE_METRIC = 'interestRateMetric';
const ID_LOAN_TABLE = 'loanTableBody';
const PAYMENT_HISTORY = 'paymentHistory'
const NAVIGATION_BACK_BUTTON = 'backButton'
const EDIT_BUTTON = 'EditButton'
const ID_LOGO_HEADER = 'logoHeader';
const ID_ID_INPUT = 'idInput';
const ID_ID_INPUT_BUTTON = 'loadInfoButton';
const ID_HEADER_USERNAME = 'userNameHeader';

const ID_PP_PERSONAID = 'personaIDValue';
const ID_PP_PAYTOT = 'payTotIDValue';
const ID_PP_OUTSTANDING = 'outstnadingAmtValue';
const ID_PP_STATUS = 'statusValue';
const ID_PP_LOAN_AMOUNT = 'loanAmount';
const ID_PP_LOAN_TERM = 'loanTerm';
const ID_PP_LOAN_INTEREST = 'interestAmtValue';
const ID_PP_HEADING = 'ppHeading';
const STATUS_VALUE = 'statusValue';
const STATUS_SELECT = 'statusSelect';

let currentLoanIdFocus = -1;

// ========================================================


// ========================================================
//                       VARIABLES
// ========================================================

let isEditing = false;
let statusCache = '';
let currentStatus = '';

// ========================================================


// ========================================================
//                         INIT
// ========================================================

/**
 * Called once when the page is loaded
 * to initialize the index / home page.
 */
const initIndex = async () => {
    if (!validateSession()) {
        clearSessionAndLogout();
    }

    document.getElementById(ID_HEADER_USERNAME).textContent = getUsername();

    // -== Subscribe Event Listeners ==-

    document.getElementById(ID_LOGOUT_BUTTON).addEventListener('click', clearSessionAndLogout);
    document.getElementById(ID_LOAN_TABLE).addEventListener('click', showPersonalDashboard);
    document.getElementById(NAVIGATION_BACK_BUTTON).addEventListener('click', () => { showDashboard() });
    document.getElementById(EDIT_BUTTON).addEventListener('click', handleStatusEdit);
    document.getElementById(ID_LOGO_HEADER).addEventListener('click', () => {
        window.location.href = '';
    });
    document.getElementById(ID_ID_INPUT_BUTTON).addEventListener('click', handleLoadClick);

    // -===============================-

    // -==      Init Data View       ==-

    // TODO : get data for metrics
    const intRate = 10;//await apiFetchWithAuth('/fe/lending-rate').lending ?? 10;
    updateDialPercent(ID_REPAYMENT_DIAL, 43.6);
    updateSimpleMetric(ID_INTEREST_RATE_METRIC, intRate);

    populateLoanTable();

    // -===============================-
}

document.addEventListener('DOMContentLoaded', () => {
    // Call initIndex
    initIndex();

    // Optionally, if you want to hide the personalDashboard section:
    const personalDashboardSection = document.getElementById("personalDashboard");
    if (personalDashboardSection) {
        personalDashboardSection.style.display = "none";
    }
});

// ========================================================

// ========================================================
//                 MAIN METHODS / FUNCTIONS
// ========================================================

/**
 * Takes an array of records used to populate
 * the rows of the dashboard table.
 * @param {Object} records 
 */
const populateLoanTable = async () => {
    const tableBody = document.getElementById(ID_LOAN_TABLE);

    try {
        const records = await fetchLoanRecords(); // Wait for the promise to resolve

        // Ensure records is an array before iterating
        if (!Array.isArray(records)) {
            console.error('Expected an array of loan records, got:', typeof records);
            return;
        }

        records.forEach((record) => {
            const newRow = document.createElement('tr');
            const { loan_id, persona_id, amount, loan_status } = record;

            // Create loanId cell
            const loanIdCell = document.createElement('td');
            loanIdCell.textContent = loan_id;
            newRow.appendChild(loanIdCell);

            // Create personaId cell
            const personaIdCell = document.createElement('td');
            personaIdCell.textContent = persona_id;
            newRow.appendChild(personaIdCell);

            // Create loanAmount cell
            const loanAmountCell = document.createElement('td');
            loanAmountCell.textContent = amount;
            newRow.appendChild(loanAmountCell);

            // Create status cell
            const statusCell = document.createElement('td');
            statusCell.textContent = loan_status;
            newRow.appendChild(statusCell);

            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error('Error populating loan table:', error);
        // Handle error as needed, e.g., display error message on UI
    }
};

const paymentHistory = async (loanId) => {
    const tableBody = document.getElementById(PAYMENT_HISTORY);

    try {
        const records = await paymentData(loanId); // Wait for the promise to resolve
        console.log(records)
        const data = await fetchData(loanId)
        let loanAmount = data.monthly_repayment * data.term_months

        // Ensure records is an array before iterating
        if (!Array.isArray(records)) {
            console.error('Expected an array of loan records, got:', typeof records);
            return;
        }

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const newRow = document.createElement('tr');
            const { repayment_id, loan_id, repayment_date, persona_id } = record;

            // Create loanId cell
            const loanIdCell = document.createElement('td');
            loanIdCell.textContent = repayment_id;
            newRow.appendChild(loanIdCell);

            // Create repayment date cell
            const repaymentDateCell = document.createElement('td');
            repaymentDateCell.textContent = repayment_date;
            newRow.appendChild(repaymentDateCell);

            // Create monthly repayment cell
            const monthlyRepaymentCell = document.createElement('td');
            monthlyRepaymentCell.textContent = data.monthly_repayment;
            newRow.appendChild(monthlyRepaymentCell);

            loanAmount = parseFloat((loanAmount - data.monthly_repayment).toFixed(2));

            // Create remaining balance cell
            const remainingBalanceCell = document.createElement('td');
            remainingBalanceCell.textContent = loanAmount;
            newRow.appendChild(remainingBalanceCell);

            tableBody.appendChild(newRow);
        }

    } catch (error) {
        console.error('Error populating loan table:', error);
        // Handle error as needed, e.g., display error message on UI
    }
};

const clearPaymentHistory = () => {
    const tableBody = document.getElementById(PAYMENT_HISTORY);

    // Remove all rows except the first (header) row
    while (tableBody.rows.length > 1) {
        tableBody.deleteRow(1); // Start deleting from index 1 (after header)
    }
};


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

const showPersonalDashboard = async (clickEvent, fromButton, loanId = 0) => {
    if (!fromButton) {
        let target = clickEvent.target;
        if (target.nodeName == 'TH' || target.parentElement.nodeName == 'THEAD') {
            return;
        }

        while (target && target.nodeName !== 'TR') {
            target = target.parentElement;
        }

        if (target) {
            loanId = target.cells[0].textContent;
        }
    }

    let data = await fetchData(loanId);
    if (data.length <= 0) {
        console.error('Fetch failed for this loan.');
        alert("Invalid loan ID.");
        return;
    }

    currentLoanIdFocus = loanId;
    const dashboardContainer = document.getElementById('dashboardContainer');
    const personalDashboard = document.getElementById('personalDashboard');

    // Hide the dashboardContainer
    dashboardContainer.style.display = 'none';

    // Show the personalDashboard
    personalDashboard.style.display = 'flex';
    document.getElementById(ID_PP_HEADING).textContent = `Loan ${loanId} Breakdown`;
    // Fetch data based on clientId (replace this with your actual data fetching logic)
    console.log("Fetching data for loan:", loanId);

    // Update interest rate metric
    const interestRateMetric = document.querySelector('#personalDashboard .interest-rate-metric');
    interestRateMetric.setAttribute('data-percent', parseFloat(data.interest_rate) * 100);
    interestRateMetric.querySelector('.pannelDescription').textContent = `Current Interest Rate`;

    const monthlyRepayments = document.querySelector('#personalDashboard .monthly-repayments');
    monthlyRepayments.setAttribute('data-percent', `${data.monthly_repayment}`);
    monthlyRepayments.querySelector('.pannelDescription').textContent = `Monthly Repayment (B)`;

    // Update radial dial
    const dialPersonal = document.getElementById('dial-personal');
    dialPersonal.setAttribute('data-percent', data.repaymentProgressPercent);
    dialPersonal.style.setProperty('--percent', data.repaymentProgressPercent + '%');

    document.getElementById(ID_PP_PERSONAID).textContent = loanId;
    document.getElementById(ID_PP_PAYTOT).textContent = data.total_paid_amount;
    document.getElementById(ID_PP_OUTSTANDING).textContent = parseFloat(((data.monthly_repayment * data.term_months) - data.total_paid_amount).toFixed(2));
    document.getElementById(ID_PP_STATUS).textContent = data.loan_status;
    updateStatusColor(data.loan_status)
    document.getElementById(ID_PP_LOAN_AMOUNT).textContent = data.amount;
    document.getElementById(ID_PP_LOAN_TERM).textContent = data.term_months;
    document.getElementById(ID_PP_LOAN_INTEREST).textContent = parseFloat((data.monthly_repayment - data.amount / data.term_months).toFixed(2));

    paymentHistory(loanId);

}


function showDashboard() {
    const statusValue = document.getElementById(ID_PP_STATUS);
    currentLoanIdFocus = -1;

    const editButton = document.getElementById(EDIT_BUTTON);
    const statusSelect = document.getElementById(STATUS_SELECT);

    editButton.textContent = 'Edit Status';
    isEditing = false;
    statusSelect.style.display = 'none';
    statusValue.style.display = 'flex';

    const dashboardContainer = document.getElementById('dashboardContainer');
    const personalDashboard = document.getElementById('personalDashboard');

    // Show the dashboardContainer
    dashboardContainer.style.display = 'flex';

    // Hide the personalDashboard
    personalDashboard.style.display = 'none';

    clearPersonalMetrics();
    clearPaymentHistory();
}

function clearPersonalMetrics() {
    const loadingText = 'Loading...';
    const interestRateMetric = document.querySelector('#personalDashboard .interest-rate-metric');
    interestRateMetric.setAttribute('data-percent', loadingText);
    interestRateMetric.querySelector('.pannelDescription').textContent = `Current Interest Rate`;

    const monthlyRepayments = document.querySelector('#personalDashboard .monthly-repayments');
    monthlyRepayments.setAttribute('data-percent', loadingText);
    monthlyRepayments.querySelector('.pannelDescription').textContent = `Monthly Repayment (B)`;

    const dialPersonal = document.getElementById('dial-personal');
    dialPersonal.setAttribute('data-percent', 0);
    dialPersonal.style.setProperty('--percent', "0%");

    document.getElementById(ID_PP_PERSONAID).textContent = loadingText;
    document.getElementById(ID_PP_PAYTOT).textContent = loadingText;
    document.getElementById(ID_PP_OUTSTANDING).textContent = loadingText;
    document.getElementById(ID_PP_STATUS).textContent = loadingText;
    document.getElementById(ID_PP_LOAN_AMOUNT).textContent = loadingText;
    document.getElementById(ID_PP_LOAN_TERM).textContent = loadingText;
    document.getElementById(ID_PP_LOAN_INTEREST).textContent = loadingText;
}

async function handleStatusEdit(fromCode = false) {
    const editButton = document.getElementById(EDIT_BUTTON);
    const statusValue = document.getElementById(STATUS_VALUE);
    const statusSelect = document.getElementById(STATUS_SELECT);

    if (isEditing) {
        // Save changes
        let newStatus = statusSelect.value;
        if (newStatus === '') {
            newStatus = statusCache
        }

        if (await saveStatus(currentLoanIdFocus, newStatus)) {
            editButton.textContent = 'Edit Status';
            isEditing = false;
            statusSelect.style.display = 'none';
            statusValue.style.display = 'flex';
            statusValue.textContent = newStatus;
            updateStatusColor(newStatus);
        } else {
            alert("Failed to update, please try again.");
        }


    } else {
        // Enter edit mode
        statusCache = statusValue.textContent;
        editButton.textContent = 'Save Changes';
        isEditing = true;
        statusSelect.style.display = 'inline-block';
        statusValue.style.display = 'none';
        statusSelect.value = currentStatus;
    }
}

// Function to update status color based on selected status
function updateStatusColor(status) {
    const statusValue = document.getElementById(STATUS_VALUE);
    if (status === 'Active') {
        statusValue.style.color = 'orange';
    } else if (status === 'Complete') {
        statusValue.style.color = 'green';
    } else if (status === 'Cancelled') {
        statusValue.style.color = 'red';
    } else {
        statusValue.style.color = 'black'; // Default color
    }
}

function handleLoadClick() {
    const loanId = document.getElementById(ID_ID_INPUT).value ?? -1;

    if (loanId != -1) {
        showPersonalDashboard(null, true, loanId)
    }
}

// ========================================================

const paymentData = async (loanId) => {
    try {
        const url = `fe/repayments/${loanId}`;
        const response = await apiFetchWithAuth(url)
        return await response.json(); // Assuming response.data is an array of loan records
    } catch (error) {
        console.error('Error fetching loan records:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const fetchData = async (loanId) => {
    try {
        const apiUrl = `fe/loan/info/${loanId}`;
        const response = await apiFetchWithAuth(apiUrl)
        const data = await response.json()
        const repaymentProgressPercent = (data.total_paid_amount / (data.monthly_repayment * data.term_months)) * 100;
        data.repaymentProgressPercent = parseFloat(repaymentProgressPercent.toFixed(2));
        console.log(data)
        return data
    } catch (error) {
        console.error('Error fetching loan records:', error);
        return []; // Return an empty array or handle the error as needed
    }
};

const fetchLoanRecords = async () => {
    try {
        const url = 'fe/loan/table';
        const response = await apiFetchWithAuth(url)
        return await response.json(); // Assuming response.data is an array of loan records
    } catch (error) {
        console.error('Error fetching loan records:', error);
        return []; // Return an empty array or handle the error as needed
    }
};
// Function to save status
const saveStatus = async (loanId, newStatus) => {
    try {
        const apiUrl = 'fe/loan/status'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loan_id: loanId,
                loan_status: newStatus
            })
        };
        await apiFetchWithAuth(apiUrl, options);
        return true;
    } catch (error) {
        console.error('Error fetching loan records:', error);
        return false;
    }
}

