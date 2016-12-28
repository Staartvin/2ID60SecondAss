$(document).ready(function () {

	// Load a few images.
	$.get("/image/top", {})
		.done(function (data) {

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

				var comments = image.comments;

				var commentSection = clone.find(".commentSection");

				if (comments.length > 0) {

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
				} else {
					commentSection.toggleClass("hidden");
				}


				clone.appendTo($(".groups"));

				console.log(image);
			}
		});


});