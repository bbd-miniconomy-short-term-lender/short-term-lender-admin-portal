import { validateSession, clearSessionAndLogout } from './auth.js';
import { apiFetchWithAuth } from './api.js';


// ========================================================
//                       CONSTANTS
// ========================================================

const ID_LOGOUT_BUTTON = 'logoutButtonHeader';
let isEditing = false;
const ID_REPAYMENT_DIAL = 'repaymentDial';
const ID_INTEREST_RATE_METRIC = 'interestRateMetric';
const ID_LOAN_TABLE = 'loanTableBody';
const NAVIGATION_BACK_BUTTON = 'backButton'
const EDIT_BUTTON = 'EditButton'
const editButton = document.getElementById(EDIT_BUTTON);

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
    document.getElementById(ID_LOAN_TABLE).addEventListener('click', showPersonalDashboard);
    document.getElementById(NAVIGATION_BACK_BUTTON).addEventListener('click', () => {showDashboard()});
    document.getElementById(EDIT_BUTTON).addEventListener('click', () => {
    
        if (isEditing) {
            editButton.textContent = 'Edit Status'; // Change button text back
            isEditing = false;
        } else {
            // Enter edit mode
            editButton.textContent = 'Save Changes'; // Change button text
            isEditing = true;
        }
    });

    // document.addEventListener('DOMContentLoaded', () => {
    //     const backButton = document.getElementById('backButton');
    //     backButton.addEventListener('click', () => {
    //         showDashboard();
    //     });
    // });

    // -===============================-

    // -==      Init Data View       ==-

    // TODO : get data for metrics
    updateDialPercent(ID_REPAYMENT_DIAL, 0);
    updateSimpleMetric(ID_INTEREST_RATE_METRIC, 0);

    // const loanRecords = await apiFetchWithAuth('/loans/info');
    const loanRecords = [
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

const showPersonalDashboard = (clientId) => {
    const dashboardContainer = document.getElementById('dashboardContainer');
    const personalDashboard = document.getElementById('personalDashboard');

    // Hide the dashboardContainer
    dashboardContainer.style.display = 'none';

    // Show the personalDashboard
    personalDashboard.style.display = 'block';

    // Fetch data based on clientId (replace this with your actual data fetching logic)
    fetchData(clientId)
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

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Example function to fetch data (replace with your actual data fetching mechanism)
const fetchData = (clientId) => {
    // Simulating fetching data from API or elsewhere
    return new Promise((resolve, reject) => {
        // Replace with actual API call or data retrieval logic
        setTimeout(() => {
            // Example data (replace with actual fetched data structure)
            const data = {
                interestRate: 12,
                loanAmount: 6000000,
                paidAmount: 350000,
                loanTerm: 10,
                monthlyRepayment: 9500,
                status: 'pending'
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
    const dashboardContainer = document.getElementById('dashboardContainer');
    const personalDashboard = document.getElementById('personalDashboard');

    // Show the dashboardContainer
    dashboardContainer.style.display = 'flex';

    // Hide the personalDashboard
    personalDashboard.style.display = 'none';
}

  

// ========================================================