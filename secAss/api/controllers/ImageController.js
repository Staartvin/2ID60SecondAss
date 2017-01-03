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

		// Try to find image.
		FavoritedImage.findOne({
			user: userID,
			image: imageID
		}).exec(function (err, image) {
			if (err || !image) {
				// Image is not found, now favorite it.

				// Favorite image
				FavoritedImage.create({
					user: userID,
					image: imageID
				}).exec(function (err, newFavorite) {
					if (err || !newFavorite) {

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

						// Otherwise, send back something reasonable as our error response.
						return res.serverError(err);
					}

					// Send back the id of the new user
					return res.json({
						error: 200,
						message: "Favorited image"
					});
				});
			} else {
				// Already favorited image, so unfavorite image
				FavoritedImage.destroy({
					user: userID,
					image: imageID
				}).exec(function (err) {
					if (err) {
						return res.negotiate(err);
					}

					// Send back the id of the new user
					return res.json({
						error: 200,
						message: "Unfavorited image"
					});
				});
			}
		});


	},

	uploadImage: function (req, res) {
		// Try to find image.
		Image.findOrCreate({
			url: req.param("url"),
			author: req.param("userID")
		}, {
			title: req.param("title"),
			description: req.param("description"),
			author: req.param("userID"),
			url: req.param("url")
		}).exec(function (err, image) {
			if (err || !image) {
				// Image is not found, now favorite it.


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

				// Otherwise, send back something reasonable as our error response.
				return res.serverError(err);
			} else {

				// Send back the id of the new user
				return res.json({
					error: 200,
					message: "Image uploaded."
				});
			}
		});

	},

	// Get all the favorites of a user
	getFavorites: function (req, res) {

		var userID = req.param('userID');

		// Check if user is logged in and trying to get favorites of their own user object.
		if (!AuthenticationService.doesSessionMatchId(req, userID)) {
			return res.json({
				error: 305,
				message: "Session is not valid"
			});
		}


		// Get all images that this user favorited.
		FavoritedImage.find({
			user: userID
		}).populate('image').exec(function (err, images) {
			if (err) {
				return res.serverError(err);
			}

			// Save an array of favorited images
			var favorites = [];

			// Store all the ids of the images we favorited.
			var imageIDs = [];

			for (key in images) {
				//console.log("Favorite " + key + ": " + JSON.stringify(images[key]));

				var favorite = images[key];

				var favoritedImage = favorite['image'];

				// Check if the array already has this author id
				if (imageIDs.indexOf(favoritedImage.id) < 0) {
					imageIDs.push(favoritedImage.id);
				}

				// Add favoritedImage to array
				favorites.push(favoritedImage);
			}

			// Find all the images by the ids
			Image.find({
				id: imageIDs
			}).populateAll().exec(function (err, images) {

				// Add author name and id to the comment users
				findCommentUsers(res, images, function (users) {
					var formattedImages = getFormattedImages(images, users);
					res.json(sortNewImages(formattedImages));
				});
			});

		});

	},

	// Get the newest images
	showImageData: function (req, res) {
		Image
			.find({
				id: req.param("id")
			})
			.populateAll()
			.exec(function (error, images) {
				//TODO: HANDLE ERRORS PROPERLY
				handleError(error, res);

				findCommentUsers(res, images, function (users) {
					var formattedImages = getFormattedImages(images, users);
					res.send(formattedImages);
				});
			});
	},

	// Get all the uploads of a user
	getUploads: function (req, res) {

		var userID = req.param('userID');

		// Check if user is logged in and trying to get favorites of their own user object.
		if (!AuthenticationService.doesSessionMatchId(req, userID)) {
			return res.json({
				error: 305,
				message: "Session is not valid"
			});
		}


		// Get all images that this user favorited.
		Image.find({
			author: userID
		}).populateAll().exec(function (err, images) {
			if (err) {
				return res.serverError(err);
			}

			// Add author name and id to the comment users
			findCommentUsers(res, images, function (users) {
				var formattedImages = getFormattedImages(images, users);
				res.json(sortNewImages(formattedImages));
			});


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