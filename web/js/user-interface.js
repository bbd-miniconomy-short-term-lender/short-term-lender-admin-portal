var user = {
	name: "",
	email: "",
	email_verified: "false",
	status: "",
	update: function (userInfo) {
		for (key in userInfo){
			if (this[key] != undefined){
				this[key] = userInfo[key];
			}
		}		
	}
};

function inputCredentials() {
	if ((localStorage["aws-congnito-user-pool-id"] !== undefined) &&
		(localStorage["aws-congnito-app-id"] !== undefined)) {
			$("#cognitoUserPoolId").val(localStorage["aws-congnito-user-pool-id"]);
			$("#applicationId").val(localStorage["aws-congnito-app-id"]);
		}
	$("#credentialsModal").modal();
}

function saveCredentials() {
	let userPoolId =  'eu-west-1_1MLsU0Sws'
	localStorage.setItem("aws-congnito-user-pool-id", userPoolId);
	let appId =  '5m671l5io0gcnnvlru34784ac2' 
	localStorage.setItem("aws-congnito-app-id", appId);
}

function clearCredentials(){
	localStorage.removeItem("aws-congnito-user-pool-id");
	localStorage.removeItem("aws-congnito-app-id");
	$("#cognitoUserPoolId").val("");
	$("#applicationId").val("");	
}


function visibility(divElementId, show=false){
    let divElement = document.getElementById(divElementId);
    if (divElement) {
        if (show){
            divElement.style.display = "block";
        } else {
            divElement.style.display = "none";
        }
    } else {
        console.error(`Element with id '${divElementId}' not found.`);
    }
}

function showAlertMessage(alertType, message){
	$("#operationAlert span").remove();
	$("#operationAlert").attr('class', "alert alert-" + alertType);
	$("#operationAlert button").after('<span>' + message +'</span>');
	$("#operationAlert").fadeIn('slow');
	$("#operationAlert").show();
}

function closeAlertMessage(){
	$("#operationAlert span").remove();
	$("#operationAlert").hide();
}

function createCallback(successMessage, userName="", email="", confirmed="", status=""){
	return (err, result)=>{
		if (err){
			message = "<strong>" + err.name + "</strong>: " + err.message;
			showAlertMessage('danger', message);
		}
		else
		{
			user.update({name: userName,
						email: email,
						email_verified: confirmed,
						status: status});
			message = "<strong>Success</strong>: " + successMessage;
			showAlertMessage('success', message);
			userAttributes(updateTable);
		}
	};
}


function modalFormEnter(){
	let buttonText = $("#modalFormButton").text(); 
	let username = $("#userName").val();
	let email =  $("#userEmail").val();
	let code =  $("#userConfirmationCode").val();
	let password =  $("#userPassword").val();
	let newPassword = $("#newUserPassword").val();
	
	let callback;
	let message;
	switch (buttonText){
	case "Sign Up":
		message = `user <i>${username}</i> added to the user pool`;
		callback = createCallback(message, username, email, "No", "Created");	
		signUpUser(username, email, password, function(err, result) {
			if (err) {
				showAlertMessage('danger', err.message);
			} else {
				showAlertMessage('success', 'User signed up successfully. Please confirm your email.');
				updateModal(true, false, false, false, true, "Confirm", "Confirm a new user");
			}
		});
		break;
	
	case "Confirm":
		message = `user <i>${username}</i> confirmed email address ${email}`;
		callback = createCallback(message, username, user.email, "true", "Confirmed");		
		confirmUser(username, code, callback); 
		break;
	
	case "Sign In":
		message = `user <i>${username}</i> signed in`;
		callback = createCallback(message, username, "", "true", "Signed In");			
		signInUser(username, password, callback);
		break;
	
	case "Change":
		message = `password for user <i>${user.name}</i> has been changed`;
		callback = createCallback(message, user.name, 
		                          user.email, user.email_verified, "Updated password");

		changeUserPassword(password, newPassword, callback);
		break;
	
	case "Request":
		message = `confirmation code for password reset has been sent to <i>${user.name}</i>`;
		callback = createCallback(message, username, 
		                          "", "", "Code sent");

		sendPasswordResetCode(username, callback);

		updateModal(true, false, false, true, true, "Reset", 
					"Reset Password - confirm and reset")
		return ; // keep the modal visible

	case "Reset":
		message = `user <i>${user.name}</i> reset the password`;
		callback = createCallback(message, user.name, 
		                          "", "true", "New password");

		confirmPasswordReset(username, code, newPassword, callback);
		break	
	}
	// Clear fields after action
    $("#userName").val("");
    $("#userEmail").val("");
    $("#userConfirmationCode").val("");
    $("#userPassword").val("");
    $("#newUserPassword").val("");
	$("#addUserModal").modal('hide');
}


function updateModal(showName, showEmail, showPassword, showNewPassword, showConfirm, buttonText, title){
	visibility("userNameDiv", showName);
	visibility("userEmailDiv", showEmail);
	if (showNewPassword){
		visibility("userNewPasswordDiv", true);
		$("#passwordLabel").text("Current Password"); 
	}
	else{
		visibility("userNewPasswordDiv", false);
		$("#passwordLabel").text("Password"); 
	}
	visibility("userPasswordDiv", showPassword);
	visibility("confirmationCode", showConfirm);
	$("#modalFormButton").text(buttonText);
	$("#addUserModalLabel").text(title);
	$("#addUserModal").modal();
}

function toggleShowPassword(checkBoxId, inputId){
	if ($("#" + checkBoxId).is(":checked")) {
		$("#" + inputId).prop("type", "text");
	}
	else{
		$("#" + inputId).prop("type", "password");
	}
}

function actionAddUser(){
	updateModal(true, true, true, false, false, "Sign Up", "Add a new user to the pool");
}

function actionConfirmUser() {
	updateModal(true, false, false, false, true, "Confirm", "Confirm a new user");
}

function actionSignInUser() {
	updateModal(true, false, true, false, false, "Sign In", "Authenticate user");
}

function actionChangePassword(){
	updateModal(false, false, true, true, false, "Change", "Change Password");	
}

function actionSignOutUser() {
	let message = `user <i>${user.name}</i> signed out`
	let callback = createCallback(message, user.name, 
		                          user.email, user.email_verified, "Signed Out");
	signOutUser(callback);
}



function actionForgotPassword(){
	updateModal(true, false, false, false, false, "Request", "Reset Password - request confirmation code");		
}

function actionDeleteUser(){
	let message = `user <i>${user.name}</i> deleted from the user pool`
	let callback = createCallback(message, "", "", "", "");

	deleteUser(callback);
}
