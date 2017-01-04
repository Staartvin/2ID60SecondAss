$(document).ready(function () {
	// When double clicking on an image.
	$(".groups").on("dblclick", "img",
		function (event) {
			var groupParent = $(this).closest(".group");

			favoriteImage(groupParent);
		});

	// When clicking on the heart icon in the comments section
	$(".groups").on("click", "i.favoriteIcon",
		function (event) {
			var groupParent = $(this).closest(".group");

			favoriteImage(groupParent);
		});
});

function favoriteImage(groupParent) {
	var imageID = groupParent.data("imageid");
	var imageTitle = groupParent.find(".image-title").text();
	var imageAuthor = groupParent.find(".image-author").text().replace("posted by", "").trim();

	$.post("/image/favorite", {
			userID: sessionStorage.userID,
			imageID: imageID
		})
		.done(function (data) {

			var message = data.message;
			var errorCode = data.error;

			// Handle errors.
			if (errorCode == 305) {
				toastr["error"]("You need to be logged in to favorite an image.");
				return;
			} else if (errorCode == 200) {

				if (message.includes("Unfavorited image")) {
					toastr["info"]("You unfavorited this image.");

					// Change favorite icon to a full heart if favorited, or an empty heart if unfavorite.
					groupParent.find(".favoriteIcon").addClass("fa-heart-o").removeClass("fa-heart");

				} else {
					toastr["info"]("You favorited '" + imageTitle + "' by " + imageAuthor);
					groupParent.find(".favoriteIcon").removeClass("fa-heart-o").addClass("fa-heart");
				}

			} else {
				toastr["error"]("An unknown error occured.");
				return;
			}
		});
}