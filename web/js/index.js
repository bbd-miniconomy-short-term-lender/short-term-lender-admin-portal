import { validateSession, clearSessionAndLogout } from './auth.js';
import { apiGetWithAuth } from './api.js';


// ========================================================
//                       CONSTANTS
// ========================================================

const ID_LOGOUT_BUTTON = 'logoutButtonHeader';
let isEditing = false;

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

    // Load the table
    loadTable();
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
const loadTable = () => {
    const thing = [
        {
            clientId: '001',
            clientName: 'John Doe',
            loanAmount: '$10,000',
            interestRate: '5%',
            loanTerm: '2 years',
            status: 'Active',
        },
        {
            clientId: '002',
            clientName: 'Jane Smith',
            loanAmount: '$15,000',
            interestRate: '6%',
            loanTerm: '3 years',
            status: 'Pending',
        },
        {
            clientId: '003',
            clientName: 'Bob Johnson',
            loanAmount: '$8,500',
            interestRate: '4.5%',
            loanTerm: '1 year',
            status: 'Paid Off',
        },
        {
            clientId: '004',
            clientName: 'Alice Brown',
            loanAmount: '$20,000',
            interestRate: '7%',
            loanTerm: '5 years',
            status: 'Active',
        },
        {
            clientId: '005',
            clientName: 'Michael Lee',
            loanAmount: '$12,500',
            interestRate: '5.5%',
            loanTerm: '2 years',
            status: 'Pending',
        },
        {
            clientId: '006',
            clientName: 'Emily Davis',
            loanAmount: '$18,000',
            interestRate: '6.2%',
            loanTerm: '4 years',
            status: 'Active',
        },
        {
            clientId: '007',
            clientName: 'David Wilson',
            loanAmount: '$9,000',
            interestRate: '4%',
            loanTerm: '1.5 years',
            status: 'Pending',
        },
        {
            clientId: '008',
            clientName: 'Sophia Martinez',
            loanAmount: '$14,200',
            interestRate: '5.8%',
            loanTerm: '3 years',
            status: 'Active',
        },
        {
            clientId: '009',
            clientName: 'James Moore',
            loanAmount: '$22,000',
            interestRate: '7.2%',
            loanTerm: '5 years',
            status: 'Active',
        },
        {
            clientId: '010',
            clientName: 'Olivia Taylor',
            loanAmount: '$16,500',
            interestRate: '6%',
            loanTerm: '3.5 years',
            status: 'Pending',
        },
        {
            clientId: '011',
            clientName: 'Ethan Anderson',
            loanAmount: '$11,800',
            interestRate: '5.3%',
            loanTerm: '2.5 years',
            status: 'Active',
        },
        {
            clientId: '012',
            clientName: 'Ava Garcia',
            loanAmount: '$19,500',
            interestRate: '6.5%',
            loanTerm: '4 years',
            status: 'Active',
        },
        {
            clientId: '013',
            clientName: 'Noah Wilson',
            loanAmount: '$7,500',
            interestRate: '3.8%',
            loanTerm: '1 year',
            status: 'Paid Off',
        },
        {
            clientId: '014',
            clientName: 'Isabella Thompson',
            loanAmount: '$13,700',
            interestRate: '5.7%',
            loanTerm: '2.8 years',
            status: 'Pending',
        },
        {
            clientId: '015',
            clientName: 'Mason Hernandez',
            loanAmount: '$17,300',
            interestRate: '6.1%',
            loanTerm: '3.8 years',
            status: 'Active',
        },
    ];

    thing.forEach(item => {
        addNewRow(item.clientId, item.clientName, item.loanAmount, item.interestRate, item.loanTerm, item.status);
    });
}


const addNewRow = (clientId, clientName, loanAmount, interestRate, loanTerm, status) => {
    const tableBody = document.getElementById('loanTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td class="client-id">${clientId}</td>
        <td>${clientName}</td>
        <td>${loanAmount}</td>
        <td>${interestRate}</td>
        <td>${loanTerm}</td>
        <td>${status}</td>
    `;

    // Add event listener to clientID cell
    const clientIdCell = newRow.querySelector('.client-id');
    clientIdCell.addEventListener('click', () => {
        showPersonalDashboard(clientId);
    });

    tableBody.appendChild(newRow);
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

document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        showDashboard();
    });
});

function showDashboard() {
    const dashboardContainer = document.getElementById('dashboardContainer');
    const personalDashboard = document.getElementById('personalDashboard');

    // Show the dashboardContainer
    dashboardContainer.style.display = 'flex';

    // Hide the personalDashboard
    personalDashboard.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('EditButton');
    const monthlyRepaymentValue = document.getElementById('monthlyRepaymentValue');
  
    editButton.addEventListener('click', () => {
      if (isEditing) {
        editButton.textContent = 'Edit Status'; // Change button text back
        isEditing = false;
      } else {
        // Enter edit mode
        editButton.textContent = 'Save Changes'; // Change button text
        isEditing = true;
      }
    });
});
  