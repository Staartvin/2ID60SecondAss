module.exports = {

	/**
	 * Authorise a user and log it in.
	 */
	authenticateUser: function (req, user) {


		// Store user in the user session
		req.session.user = user;
		req.session.authenticated = true;

		console.log(req.session);
		return;
	},

	/*
	Is a request authenticated?
	*/
	isAuthenticated: function (req) {
		return req.session.authenticated == true && req.session.user != undefined;
	},


	deAuthenticateUser: function (req) {
		req.session.user = null;
		req.session.authenticated = false;
		return;
	}
}