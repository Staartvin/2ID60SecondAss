var isPictureValid = false;

$(document).ready(function () {
	// When a user submits a login form
	$(".omb_postCreateForm").submit(function (e) {
		e.preventDefault();

		var title = $('#postCreateForm').find('input[name="title"]').val().trim();
		var description = $('#postCreateForm').find('textarea[name="description"]').val().trim();
		var url = $('#postCreateForm').find('input[name="url"]').val();

		$("#titleMessage").text("");
		$("#urlMessage").text("");
		$("#descMessage").text("");


		if (title == "") {
			$("#titleMessage").text("Please provide a title for your post.");
			return;
		}

		if (description == "Put a nice description in here for your post.") {
			$("#descMessage").text("Please provide a description for your post.");
			return;
		}

		if (url == "") {
			$("#urlMessage").text("Please provide an URL for your image.");
			return;
		}

		if (!isPictureValid) {
			$("#urlMessage").text("It seems your picture is not valid. Try providing a direct URL or a different picture.");
			return;
		}


		if (description == "") {
			description = " "; // Make it just a space.
		}

		// Set spinner to show
		$(".loadingSpinner").removeClass("hidden");


		// Do post request to server to add image
		$.post("/image/upload", {
				url: url,
				userID: sessionStorage.getItem("userID"),
				title: title,
				description: description
			})
			.done(function (data) {

				var message = data.message;
				var errorCode = data.error;

				// Handle errors.
				console.log("MESSAGE: " + message);
				console.log("ERROR: " + errorCode);

				toastr.options = {
					"closeButton": false,
					"debug": false,
					"newestOnTop": false,
					"progressBar": false,
					"positionClass": "toast-bottom-right",
					"preventDuplicates": true,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "2000",
					"extendedTimeOut": "1000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "show",
					"hideMethod": "hide"
				}

				$('#postModal').modal('hide');

				toastr["success"]("Refreshing page to show the changes!", "Successfully created your post!", {
					onHidden: function () {
						location.reload();
					}
				});


			});


	});

	// When entering an URL
	$('#urlInput').on('input', function (e) {
		var imageURL = $('#postCreateForm').find('input[name="url"]').val();

		$.get(imageURL, {})
			.done(function (data) {
				console.log("DATA DONE");
				isPictureValid = true;
			}).fail(function (data) {

				if (data.readyState == 0 && data.status == 0) {
					isPictureValid = true;
				}

			});



		$("#previewImage").attr("src", imageURL);

		var src = $("#previewImage").attr("src");
	});

	$("#createPostButton").on('click', function () {

		$('.navbar-toggle').click()
	});


	$("#postDescArea").focus(function () {

		var defaultMessage = "Put a nice description in here for your post.";

		if ($(this).text() == defaultMessage) {
			$(this).val("");
		}
	});
});

function errorIncorrectImage() {
	isPictureValid = false;
}