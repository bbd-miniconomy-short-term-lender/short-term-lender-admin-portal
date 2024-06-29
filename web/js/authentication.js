function getPoolData(){
	return {
			UserPoolId: 'eu-west-1_1MLsU0Sws',
			ClientId: '5m671l5io0gcnnvlru34784ac2' 
		};
}

var userPool;

function getUserPool(){
	if (userPool===undefined){
		userPool = new AmazonCognitoIdentity.CognitoUserPool(getPoolData()); 
	};
	return userPool;
}

var cognitoUser;

function getUser(userName){
	if (cognitoUser===undefined){
	    var userData = {
	        Username : userName,
	        Pool : getUserPool()
	        };
    	cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	}
	return cognitoUser;
}


function signUpUser(userName, userEmail, userPassword, callback) {	 
	let dataName = {
        Name: 'given_name',
        Value: userEmail
    };
    let dataEmail = {
        Name: 'family_name',
        Value: userEmail
    };
	let attributeList = [ new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail),
						  new AmazonCognitoIdentity.CognitoUserAttribute(dataName) ];
	  
	let userPool = getUserPool();
	userPool.signUp(userName, userPassword, attributeList, null, function(err, result){
	    if (err) {
	    	callback(err, null);
	    }
	    else {
	    	cognitoUser = result.user;	    	
	    	callback(null, result);
	    }
	});
}

function confirmUser(userName, code, callback){
    getUser(userName).confirmRegistration(code, true, callback);
}


function wrapCallback(callback){
	return {
			onFailure: (err)=>{callback(err, null);},
			onSuccess: (result)=>{callback(null, result);}
		};
}


function signInUser(userName, password, callback){
    let authenticationData = {
        Username : userName,
        Password : password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    getUser(userName).authenticateUser(authenticationDetails, wrapCallback(callback));
}


function signOutUser(callback){
	if (cognitoUser){
		if (cognitoUser.signInUserSession){
			cognitoUser.signOut();
			callback(null, {});
			return;
		}
	}	
	callback({name: "Error", message: "User is not signed in"}, null);
}


function deleteUser(callback){	
	if (cognitoUser){
		cognitoUser.deleteUser((err, result) => {
			if (err){
				callback(err, null);
				return
			}
			cognitoUser = null;
			callback(null, result);
		});
		return;
	}
	callback({name: "Error", message: "User is not signed in"}, null);
}


function changeUserPassword(oldPassword, newPassword, callback){
	if (cognitoUser){
		cognitoUser.changePassword(oldPassword, newPassword, callback);
		return;
	}
	callback({name: "Error", message: "User is not signed in"}, null);	
}


function sendPasswordResetCode(userName, callback){
    getUser(userName).forgotPassword(wrapCallback(callback));	
}


function confirmPasswordReset(username, code, newPassword, callback){
    getUser(userName).confirmPassword(code, newPassword, wrapCallback(callback));		
}


function userAttributes(updateCallback){
	if (cognitoUser){
		cognitoUser.getUserAttributes((err, result)=>{
			if (err){
				updateCallback({});
				return;
			}
			else{
				let userInfo = {name: cognitoUser.username};
		        for (let k = 0; k < result.length; k++) {
            		userInfo[result[k].getName()] = result[k].getValue();
            	}
            	updateCallback(userInfo);
			}
		})
	}
	else {
		updateCallback({});
	}
}


function updateAttributes(attributes, callback){
    var attributeList = [];
    for (key in attributes){
    	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute( {
    		Name: key,
    		Value: attributes[key]
    	}));
    }

    cognitoUser.updateAttributes(attributeList, callback);	
}