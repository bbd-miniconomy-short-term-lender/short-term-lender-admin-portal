
// Function to navigate between sections
function navigateTo(sectionId) {
    // Hide all sections
    var sections = document.getElementsByTagName('section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }

    // Show the selected section
    var selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// Initial navigation to home section
navigateTo('home');

// Function to toggle loan input display
function toggleLoanInput() {
    var loanInput = document.getElementById("loanInput");
    if (loanInput.style.display === "block") {
        loanInput.style.display = "none";
    } else {
        loanInput.style.display = "block";
    }
}

// Function to increase loan amount by R1000
function increaseLoanAmount() {
    var input = document.getElementById("loanAmount");
    input.stepUp(1000);
}

// Function to decrease loan amount by R1000
function decreaseLoanAmount() {
    var input = document.getElementById("loanAmount");
    input.stepDown(1000);
}

// Function to submit loan request (you can customize this function as per your backend logic)
function submitLoanRequest() {
    var loanAmount = document.getElementById("loanAmount").value;
    alert("Loan requested: R" + loanAmount); // Example: alerting the loan amount, replace with actual submission logic
    // You can add additional logic here, such as submitting the form or handling further actions
}

// Function to toggle loan process display
function toggleLoanProcess() {
    var loanProcess = document.getElementById("loanProcess");
    var requestLoanBtn = document.querySelector(".request-loan-btn");

    if (loanProcess.style.display === "block") {
        loanProcess.style.display = "none";
        requestLoanBtn.textContent = "Request Loan";
        requestLoanBtn.classList.remove("cancel-btn");
    } else {
        loanProcess.style.display = "block";
        requestLoanBtn.textContent = "Cancel Process";
        requestLoanBtn.classList.add("cancel-btn");
    }
}

// Function to increase loan amount by R1000
function increaseLoanAmount() {
    var input = document.getElementById("loanAmount");
    input.stepUp(1000);
}

// Function to decrease loan amount by R1000
function decreaseLoanAmount() {
    var input = document.getElementById("loanAmount");
    input.stepDown(1000);
}

// Function to submit loan request (you can customize this function as per your backend logic)
function submitLoanRequest() {
    var loanAmount = document.getElementById("loanAmount").value;
    alert("Loan requested: R" + loanAmount); // Example: alerting the loan amount, replace with actual submission logic
    // You can add additional logic here, such as submitting the form or handling further actions
}

// Function to cancel loan process and revert to original state
function cancelLoanProcess() {
    var loanProcess = document.getElementById("loanProcess");
    var requestLoanBtn = document.querySelector(".request-loan-btn");

    loanProcess.style.display = "none";
    requestLoanBtn.textContent = "Request Loan";
    requestLoanBtn.classList.remove("cancel-btn");
}
