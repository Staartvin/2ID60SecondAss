$(document).ready(function () {

	// When a user submits a comment form
	$(".omb_commentCreateForm").submit(function (e) {
		e.preventDefault();

		var message = $('#commentCreateForm').find('textarea[name="message"]').val().trim();
		var imageID = $("#commentModal").data("imageid");

		$("#commentMessage").text("");

		if (message == "Comment text") {
			$("#commentMessage").text("An empty comment is generally useless. \nPlease provide a message for your comment.");
			return;
		}

		console.log("MESSAGE: " + message);
		console.log("Image id: " + imageID);

		// Set spinner to show
		$(".loadingSpinner").removeClass("hidden");


		// Do post request to server to add image
		$.post("/comment/create", {
				userID: sessionStorage.getItem("userID"),
				message: message,
				imageID: imageID
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

				if (errorCode == 305) {
					toastr['error']("You are not logged in!");
					return;
				} else if (errorCode == 306) {
					toastr['error']("You already commented with that exact message.");
					return;
				} else if (errorCode == 200) {

					$('#commentModal').modal('hide');

					toastr['success']("Reloading page for you.", "Successfully posted comment.", {
						onHidden: function () {
							location.reload();
						}
					});
					return;
				} else {
					toastr['error']("An unknown error occured. Please try again.");
					return;
				}
			});


	});

	// When clicking on the comment button
	$(".groups").on("click", "i.commentIcon",
		function (event) {

			// Check if we are still logged in
			if (sessionStorage.getItem("userID") == undefined) {
				toastr["error"]("You must be logged in to comment on a post.");
				return;
			} else {
				var groupParent = $(this).closest(".group");
				// Add image id to modal so we can read what image this modal belongs to.
				// Then we also know what image the user is trying to comment on.
				$("#commentModal").data("imageid", groupParent.data("imageid"));



				$("#commentModal").modal('show');



				console.log("MODAL ID: " + groupParent.data("imageid"));



			}


		});

	// When clicking on the comment message box
	$("#commentMessageArea").focus(function () {

		var defaultMessage = "Comment text";

		if ($(this).text() == defaultMessage) {
			$(this).val("");
		}
	});


});