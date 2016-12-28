/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// Get the top images
	getTop: function (req, res) {
		Image
			.find()
			.populateAll()
			.exec(function (error, images) {
				//TODO: HANDLE ERRORS PROPERLY
				handleError(error, res);

				findCommentUsers(res, images, function (users) {
					var formattedImages = getFormattedImages(images, users);
					res.send(sortTopImages(formattedImages));
				});
			});
	},

	// Get the newest images
	getNew: function (req, res) {
		Image
			.find()
			.populateAll()
			.exec(function (error, images) {
				//TODO: HANDLE ERRORS PROPERLY
				handleError(error, res);

				findCommentUsers(res, images, function (users) {
					var formattedImages = getFormattedImages(images, users);
					res.send(sortNewImages(formattedImages));
				});
			});
	},

	favoriteImage: function (req, res) {

		var userID = req.param('userID');
		var imageID = req.param("imageID");

		// Check if user is logged in and trying to favorite an image to their own user object.
		if (!AuthenticationService.doesSessionMatchId(req, userID)) {
			return res.json({
				error: 305,
				message: "Session is not valid"
			});
		}
		// Get user object and update it
		FavoritedImage.create({
			user: userID,
			image: imageID
		}, function created(err, newFavorite) {
			if (err) {

				//console.log("err: ", err);
				//console.log("err.invalidAttributes: ", err.invalidAttributes)

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

			console.log(newFavorite);

			// Send back the id of the new user
			return res.json({
				message: "User created.",
				id: newUser.id,
				name: newUser.name
			}).status(200);
		});



	},
};

// Get all the ids of the users that made comments
function getCommentUsersIDs(images) {
	var commentUsers = [];
	var temp = {};
	//iterate images
	images.forEach(function (image) {
		//iterate comments
		image.comments.forEach(function (comment) {
			temp[comment.author] = true;
		});
	});

	for (key in temp) {
		commentUsers.push(key);
	}
	return commentUsers;
}

// Find the users that made a comment on an image
function findCommentUsers(res, images, callback) {
	var commentUserIDs = getCommentUsersIDs(images);
	User.find({
		id: commentUserIDs
	}).exec(function (error, users) {
		//TODO: HANDLE ERRORS PROPERLY
		handleError(error, res);
		callback(users);
	});
}

// Match user id with user name and replace the author by an id and a name
function getFormattedImages(images, users) {
	//Append name of the user to comments
	var userMapping = {};
	users.forEach(function (user) {
		userMapping[user.id] = user;
	});

	images.forEach(function (image) {
		//iterate comments
		image.comments.forEach(function (comment) {
			var user = userMapping[comment.author];
			comment.author = {
				id: user.id,
				name: user.name
			};
		});
	});

	//format the response nicely
	/*var result = [];
		for (key in images) {
			var responses = images[key].responses;
			result.push({
				id: thoughts[key].id,
				title: thoughts[key].title,
				content: thoughts[key].content,
				responses: getResponsesCount(responses),
				comments: thoughts[key].comments,
				category: thoughts[key].category,
				madeBy: thoughts[key].madeBy,
				createdAt: thoughts[key].createdAt
			});
		}
		return result;*/

	return images;
}

//TODO: HANDLE ERRORS PROPERLY 
function handleError(error, res) {
	if (error) {
		res.send({
			message: 'There was an error',
			error: error
		});
	}
}

// This function sorts the images to return the best thoughts first.
function sortTopImages(images) {
	images.sort(function (a, b) {
		// Sort on number of comments
		return b.comments.length - a.comments.length;
	});

	return images;
}

// This function sorts the images to return the most recently posted thoughts first.
function sortNewImages(images) {
	images.sort(function (a, b) {

		var dateA = new Date(a.createdAt);
		var dateB = new Date(b.createdAt);

		return dateB >= dateA;
	});

	return images;
}