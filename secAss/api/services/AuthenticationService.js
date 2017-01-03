module.exports = {

	/**
	 * Authorise a user and log it in.
	 */
	authenticateUser: function (req, user) {


		user.password = "";

		// Store user in the user session
		req.session.user = user;
		req.session.authenticated = true;

		return;
	},

	/*
	Is a request authenticated?
	*/
	isAuthenticated: function (req) {
		return req.session.authenticated == true && req.session.user != undefined;
	},

	// Does the session match the given user ID
	doesSessionMatchId: function (req, userID) {
		if (!AuthenticationService.isAuthenticated(req)) return false;

		if (req.session.user.id != userID) return false;

		return true;
	},

	deAuthenticateUser: function (req) {
		req.session.user = null;
		req.session.authenticated = false;
		return;
	}
}