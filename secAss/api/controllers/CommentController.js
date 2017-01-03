/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	createComment: function (req, res) {
		var userID = req.param('userID');
		var imageID = req.param("imageID");
		var message = req.param("message");

		// Check if user is logged in and trying to post a comment on their account
		if (!AuthenticationService.doesSessionMatchId(req, userID)) {
			return res.json({
				error: 305,
				message: "Session is not valid"
			});
		}


		// Check if we already have a comment with the exact same text by the same user and on the same image.
		Comment.find({
			author: userID,
			commentedOn: imageID,
			description: message
		}).exec(function (err, comment) {
			if (err) {
				return res.serverError(err);
			}

			// If comment exists, give error.
			if (comment && comment.length > 0) {
				return res.json({
					error: 306,
					message: "There already exists a comment with that message."
				});
			}

			// Go ahead and create a new one.

			Comment.create({
				author: userID,
				commentedOn: imageID,
				description: message
			}).exec(function (err, newComment) {
				if (err) {
					return res.serverError(err);
				}

				// If comment exists, return success.
				if (newComment) {
					return res.json({
						error: 200,
						message: "Comment created."
					});
				}
			});
		});
	},
};