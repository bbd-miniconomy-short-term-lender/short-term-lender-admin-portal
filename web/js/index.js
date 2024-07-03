import { validateSession, clearSessionAndLogout, getUsername } from './auth.js';
import { apiFetchWithAuth } from './api.js';


// ========================================================
//                       CONSTANTS
// ========================================================

const ID_LOGOUT_BUTTON = 'logoutButtonHeader';
const ID_REPAYMENT_DIAL = 'repaymentDial';
const ID_INTEREST_RATE_METRIC = 'interestRateMetric';
const ID_LOAN_TABLE = 'loanTableBody';
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
const initIndex = () => {
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
    updateDialPercent(ID_REPAYMENT_DIAL, 0);
    updateSimpleMetric(ID_INTEREST_RATE_METRIC, 0);

    // const loanRecords = await apiFetchWithAuth('/loans/info');
    const loanRecords = [
        {
            loanId: 1,
            personaId: '1',
            loanAmount: '100',
            status: 'Active',
        },
        {
            loanId: 2,
            personaId: '2',
            loanAmount: '200',
            status: 'Paid Off',
        },
        {
            loanId: 3,
            personaId: '3',
            loanAmount: '300',
            status: 'Active',
        },
    ];
    populateLoanTable(loanRecords);

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

// Wait for the document to load
document.addEventListener("DOMContentLoaded", function() {
    // Get the element that displays the status
    var statusElement = document.getElementById("statusValue");

    // Initial status text
    var statusText = "Loading...";

    // Function to update the status text and its color
    function updateStatus(status) {
        statusElement.textContent = status; // Update the text content

        // Update the color based on the status
        if (status === "Active") {
            statusElement.style.color = "orange";
        } else if (status === "Complete") {
            statusElement.style.color = "green";
        } else if (status === "Cancelled") {
            statusElement.style.color = "red";
        } else {
            statusElement.style.color = "black"; // Default color
        }
    }

    // Example of updating the status (replace this with your actual dynamic update logic)
    // For example, after fetching data or based on user interaction
    // Assuming you have a way to retrieve or set the status, update it like this:
    updateStatus("Active"); // Replace "Active" with your actual status value
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
const populateLoanTable = (records) => {
    const tableBody = document.getElementById(ID_LOAN_TABLE);
    records.forEach((record) => {
        const newRow = document.createElement('tr');
        const { loanId, personaId, loanAmount, status } = record;

        // Create loanId cell
        const loanIdCell = document.createElement('td');
        loanIdCell.textContent = loanId;
        newRow.appendChild(loanIdCell);

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

const showPersonalDashboard = (clickEvent, fromButton, loanId = 0) => {
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

    const dashboardContainer = document.getElementById('dashboardContainer');
    const personalDashboard = document.getElementById('personalDashboard');

    // Hide the dashboardContainer
    dashboardContainer.style.display = 'none';

    // Show the personalDashboard
    personalDashboard.style.display = 'flex';
    document.getElementById(ID_PP_HEADING).textContent = `Loan ${loanId} Breakdown`;
    // Fetch data based on clientId (replace this with your actual data fetching logic)
    console.log("Fetching data for loan:", loanId);
    fetchData(loanId)
        .then(data => {
            // Update interest rate metric
            const interestRateMetric = document.querySelector('#personalDashboard .interest-rate-metric');
            interestRateMetric.setAttribute('data-percent', data.interestRate);
            interestRateMetric.querySelector('.pannelDescription').textContent = `Current Interest Rate`;

            const monthlyRepayments = document.querySelector('#personalDashboard .monthly-repayments');
            monthlyRepayments.setAttribute('data-percent', `${data.monthlyRepayment}`);
            monthlyRepayments.querySelector('.pannelDescription').textContent = `Monthly Repayment (Rands)`;

            // Update radial dial
            const dialPersonal = document.getElementById('dial-personal');
            dialPersonal.setAttribute('data-percent', data.repaymentProgressPercent);
            dialPersonal.style.setProperty('--percent', data.repaymentProgressPercent + '%');

            document.getElementById(ID_PP_PERSONAID).textContent = loanId;
            document.getElementById(ID_PP_PAYTOT).textContent = data.paidAmount;
            document.getElementById(ID_PP_OUTSTANDING).textContent = data.loanAmount + data.interestAdded - data.paidAmount;
            document.getElementById(ID_PP_STATUS).textContent = data.status;
            document.getElementById(ID_PP_LOAN_AMOUNT).textContent = data.loanAmount;
            document.getElementById(ID_PP_LOAN_TERM).textContent = data.loanTerm;
            document.getElementById(ID_PP_LOAN_INTEREST).textContent = data.interestAdded;

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Example function to fetch data (replace with your actual data fetching mechanism)
const fetchData = (loanId) => {
    // Simulating fetching data from API or elsewhere
    return new Promise((resolve, reject) => {
        // Replace with actual API call or data retrieval logic
        setTimeout(() => {
            // Example data (replace with actual fetched data structure)
            const data = {
                interestRate: 12,
                loanAmount: 10000,
                paidAmount: 2500,
                loanTerm: 10,
                monthlyRepayment: 9500,
                status: 'Active',
                interestAdded: 3250
                // Add more fields as needed
            };

            // Calculate repayment progress percentage
            const repaymentProgressPercent = (data.paidAmount / data.loanAmount) * 100;
            data.repaymentProgressPercent = parseFloat(repaymentProgressPercent.toFixed(2));

            resolve(data);
        }, 500); // Simulating delay for fetching data
    });
}

function showDashboard() {
    const statusValue = document.getElementById(ID_PP_STATUS);

    isEditing = true;
    handleStatusEdit();
    statusValue.style.display = 'block';

    const dashboardContainer = document.getElementById('dashboardContainer');
    const personalDashboard = document.getElementById('personalDashboard');

    // Show the dashboardContainer
    dashboardContainer.style.display = 'flex';

    // Hide the personalDashboard
    personalDashboard.style.display = 'none';

    clearPersonalMetrics();
}

function clearPersonalMetrics() {
    const loadingText = 'Loading...';
    const interestRateMetric = document.querySelector('#personalDashboard .interest-rate-metric');
    interestRateMetric.setAttribute('data-percent', loadingText);
    interestRateMetric.querySelector('.pannelDescription').textContent = `Current Interest Rate`;

    const monthlyRepayments = document.querySelector('#personalDashboard .monthly-repayments');
    monthlyRepayments.setAttribute('data-percent', loadingText);
    monthlyRepayments.querySelector('.pannelDescription').textContent = `Monthly Repayment (Rands)`;

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

async function handleStatusEdit() {
    const editButton = document.getElementById(EDIT_BUTTON);
    const statusValue = document.getElementById(STATUS_VALUE);
    const statusSelect = document.getElementById(STATUS_SELECT);

    if (isEditing) {
        // Save changes
        let newStatus = statusSelect.value;
        if(newStatus === '') {
            newStatus = statusCache
        }
        editButton.textContent = 'Edit Status';
        isEditing = false;
        statusSelect.style.display = 'none';
        statusValue.style.display = 'block';
        statusValue.textContent = newStatus;
        await saveStatus(newStatus); // Assume saveStatus is a function to save the status
        
        // Update status color based on selected status
        updateStatusColor(newStatus);

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

// Function to save status (mock async function)
async function saveStatus(newStatus) {
    // Mock async operation (replace with actual save logic)
    console.log('Saving status:', newStatus);
}


async function postStatusUpdate(loanId, newStatus) {
    const options = {
        method: 'POST',
        body: {
            loanId: loanId,
            newStatus: newStatus
        }
    }
    // await apiFetchWithAuth('loans/status', options);
    console.log(`Updating loan ${loanId} status with: ${newStatus}.`);
}

function sanitizeInput(input) {
    let sanitizedInput = input.slice(0, 10);

    sanitizedInput = sanitizedInput.replace(/[^a-zA-Z0-9 ]/g, '');

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('drop')) {
        sanitizedInput = "I'll drop your table";
    }

    return sanitizedInput;
}

function handleLoadClick() {
    const loanId = document.getElementById(ID_ID_INPUT).value ?? -1;

    if (loanId != -1) {
        showPersonalDashboard(null, true, loanId)
    }
}

// ========================================================