/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * Check the provided email address and password, and if they
	 * match a real user in the database.
	 */
	login: function (req, res) {

		// Try to look up user using the provided email address
		User.findOne({
			email: req.param('email')
		}, function foundUser(err, user) {
			if (err) {
				return res.negotiate(err);
			}
			if (!user) {
				return res.json({
					error: 301,
					message: "No user with this email address was found."
				});
			}

			// Compare password attempt from the form params to the encrypted password
			// from the database (`user.password`)
			require('machinepack-passwords').checkPassword({
				passwordAttempt: req.param('password'),
				encryptedPassword: user.password
			}).exec({

				error: function (err) {
					return res.negotiate(err);
				},

				// If the password from the form params doesn't checkout w/ the encrypted
				// password from the database...
				incorrect: function () {
					return res.json({
						error: 302,
						message: "This password is not correct for the given email address."
					});
				},

				success: function () {

					AuthenticationService.authenticateUser(req, user);

					// All done- let the client know that everything worked.
					return res.json({
						message: "Logged in",
						id: user.id,
						name: user.name
					}).status(200);
				}
			});
		});

	},

	/**
	 * Sign up for a user account.
	 */
	signup: function (req, res) {

		var Passwords = require('machinepack-passwords');

		// Encrypt a string using the BCrypt algorithm.
		Passwords.encryptPassword({
			password: req.param('password'),
			difficulty: 10,
		}).exec({
			// An unexpected error occurred.
			error: function (err) {
				return res.negotiate(err);
			},
			// OK.
			success: function (encryptedPassword) {
				// Create a User with the params sent from
				User.create({
					name: req.param('name'),
					email: req.param('email'),
					password: encryptedPassword,
				}, function userCreated(err, newUser) {
					if (err) {
						var message = err.message;

						var strip = "SQLITE_CONSTRAINT:";

						var strippedMessage = message.substring(message.indexOf(strip) + strip.length).trim();

						// Email address already in use.
						if (strippedMessage.includes("UNIQUE") && strippedMessage.includes("user.email")) {
							return res.json({
								error: 303,
								message: "This email address is already being used."
							});
						}

						// Name already in use.
						if (strippedMessage.includes("UNIQUE") && strippedMessage.includes("user.name")) {
							return res.json({
								error: 304,
								message: "This name is already being used."
							});
						}

						// If this is a uniqueness error about the email attribute,
						// send back an easily parseable status code.
						if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
							return res.json({
								error: 303,
								message: "This email address is already being used."
							});
						}

						// If this is a uniqueness error about the email attribute,
						// send back an easily parseable status code.
						if (err.invalidAttributes && err.invalidAttributes.name && err.invalidAttributes.name[0] && err.invalidAttributes.name[0].rule === 'string') {
							return res.json({
								error: 304,
								message: "Please provide a valid name."
							});
						}

						// Otherwise, send back something reasonable as our error response.
						return res.negotiate(err);
					}

					// Log user in
					AuthenticationService.authenticateUser(req, newUser);

					// Send back the id of the new user
					return res.json({
						message: "User created.",
						id: newUser.id,
						name: newUser.name
					}).status(200);
				});
			}
		});
	},

	/**
	 * Log out.
	 */
	logout: function (req, res) {

		if (!AuthenticationService.isAuthenticated(req)) {
			return;
		}

		// Look up the user record from the database which is
		// referenced by the id in the user session (req.session.me)
		User.findOne(req.session.user.id, function foundUser(err, user) {
			if (err) return res.negotiate(err);

			// If session refers to a user who no longer exists, still allow logout.
			if (!user) {
				return;
			}

			AuthenticationService.deAuthenticateUser(req);

			return res.ok();
		});
	},

	/**
	 * Check if user is still authenticated
	 */
	checkAuthentication: function (req, res) {

		var userID = req.param("userID");

		// Check if user is logged in
		if (!AuthenticationService.doesSessionMatchId(req, userID)) {
			return res.json({
				error: 305,
				message: "User is not authenticated"
			});
		}

		// Return that user is authenticated
		return res.json({
			error: 306,
			message: "User is authenticated"
		});

	},

};