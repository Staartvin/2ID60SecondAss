// Load new posts by default
var imageURL = "/image/new";

// Set default toastr options.
toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": false,
	"positionClass": "toast-bottom-right",
	"preventDuplicates": false,
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "4000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "show",
	"hideMethod": "hide"
}

$(document).ready(function () {

	$("#topButton").on("click", function () {

		imageURL = "/image/top";
		removeOldImages();
		loadImages();
	});

	$("#trendingButton").on("click", function () {

		imageURL = "/image/new";
		removeOldImages();
		loadImages();
	});

	$("#favoritesButton").on("click", function () {

		imageURL = "/image/favorites";
		removeOldImages();
		loadImages(true);
	});

	$("#myUploadsButton").on("click", function () {

		imageURL = "/user/posts";
		removeOldImages();
		loadImages(true);
	});

	// When clicking on the load more comments button
	$(".groups").on("click", ".loadMoreCommentsButton",
		function (event) {
			var groupParent = $(this).closest(".group");

			loadAllComments(groupParent);
		});

	removeOldImages();
	loadImages();
});

// Load new images into website
function loadImages(loadFavorites) {

	// If loadFavorites is true, we should first send data to the server (namely the userID).

	var reqData = {};

	// We should add req data
	if (loadFavorites) {
		reqData = {
			userID: sessionStorage.getItem("userID")
		}
	}

	// Load a few images.
	$.get(imageURL, reqData)
		.done(function (data) {

			if (data.length == 0) {

				if ($("#noPostsText").length == 0) {
					$(".groups").append("<h1 id='noPostsText'> There are no posts to show! </h1>");
				}

				$("#noPostsText").removeClass("hidden");

				return;
			} else {
				$("#noPostsText").addClass("hidden");
			}

			for (key in data) {
				var image = data[key];

				var clone = $(".group:first").clone();

				// Unhide class
				clone.toggleClass("hidden");

				// Set title of image
				clone.find(".image-title").text(image.title);

				// Set image description
				clone.find(".image-description").text(image.description);

				// Set image author
				clone.find(".image-author").text("posted by " + image.author['name']);

				// Set image source
				clone.find(".image").attr("src", image.url);

				// Set image id as data tag
				clone.attr("data-imageID", image.id);

				// Load comments of post
				var comments = image.comments;

				var commentSection = clone.find(".commentSection");

				if (comments.length > 0) {

					for (key in comments) {

						// Don't load more than 3 comments.
						if (key > 2) {

							// Let's show the 'show more comments' button because we have more than 3 comments. 
							clone.find(".loadMoreCommentsButton").removeClass("hidden");
							break;
						}

						var comment = comments[key];

						var author = comment.author['name'];
						var desc = comment.description;

						// Create a clone of the first comment
						var commentClone = commentSection.find(".comment:first").clone();

						commentClone.find(".description").text(desc);
						commentClone.find(".author").text("by " + author);

						commentClone.toggleClass("hidden");

						commentClone.appendTo(commentSection);
					}
				} else {
					// Don't show post if there are none.
					commentSection.toggleClass("hidden");
				}

				// Show if user favorited image
				var favorites = image.favoritedBy;

				for (key in favorites) {
					var favorite = favorites[key];

					if (favorite.user == sessionStorage.userID) {
						clone.find(".favoriteIcon").removeClass("fa-heart-o").addClass("fa-heart");
					}
				}


				clone.appendTo($(".groups"));
			}
		});
}

// Remove current images to make room for next set of images
function removeOldImages() {
	var posts = $(".groups").children(".group");

	// Don't remove anything if there is only one child.
	if (posts.length <= 1) return;

	posts.each(function (index) {
		var post = $(this);

		// Don't remove hidden template div.
		if (post.hasClass("hidden")) {
			return;
		}

		// Remove div
		post.remove();

		//console.log("POST: " + post);
		//console.log("POST: " + $(post).data("imageid"));
	});
}

// Load all images of the given post
function loadAllComments(group) {

	var imageID = group.data("imageid");

	// Get data from this image
	$.get("/image/" + imageID)
		.done(function (image) {

			// Load comments of post
			var comments = image[0].comments;

			var commentSection = group.find(".commentSection");

			// First remove all comments that are currently there
			var currentComments = commentSection.children(".comment");

			currentComments.each(function (index) {
				var currentComment = $(this);

				// Don't remove hidden template div.
				if (currentComment.hasClass("hidden")) {
					return;
				}

				// Remove div
				currentComment.remove();
			});

			// Now start adding all the comments back
			for (key in comments) {

				var comment = comments[key];

				var author = comment.author['name'];
				var desc = comment.description;

				// Create a clone of the first comment
				var commentClone = commentSection.find(".comment:first").clone();

				commentClone.find(".description").text(desc);
				commentClone.find(".author").text("by " + author);

				commentClone.toggleClass("hidden");

				commentClone.appendTo(commentSection);
			}

			// Now hide load more comments button
			group.find(".loadMoreCommentsButton").addClass("hidden");

		});

}