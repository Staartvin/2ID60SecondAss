/*
This file will check every minute whether the current session of this browser is logged in.
If it is not, it will remove cookies and session storage data.
*/

$(document).ready(function () {

	checkSession();

	// Call it every minute
	window.setInterval(checkSession, 1000 * 60);
});

// Check with the server if the stored session data points to a live user session on the server.
// Returns true if user authenticated, false otherwise.
function isAuthenticated(callbackSuccess, callbackFail) {

	// Check session storage first
	if (sessionStorage.getItem("userID") == undefined || sessionStorage.getItem("name") == undefined) {
		callbackFail();
	}

	// Do request to /user/authenticated to see if a user is still authenticated
	$.post("/user/authenticated", {
			userID: sessionStorage.userID
		})
		.done(function (data) {

			var message = data.message;
			var errorCode = data.error;

			// Handle errors.
			if (errorCode == 306) {
				// User is still authenticated
				return callbackSuccess();
			} else {
				// User is not authenticated or an error occured.
				return callbackFail();
			}
		});
}

function checkSession() {

	var lastDate = getCookie("lastSessionCheck");

	if (lastDate) {
		if ((Date.now() - lastDate) / 60000 < 1) {
			return false;
		}
	}



	setCookie("lastSessionCheck", Date.now(), 2);

	// If not authenticated, delete session data, otherwise return true.

	isAuthenticated(function () {
		return true;
	}, function () {
		sessionStorage.removeItem("userID");
		sessionStorage.removeItem("name");
		return false;
	});
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}