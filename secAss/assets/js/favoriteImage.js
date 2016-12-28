$(document).ready(function () {
	$(".groups").on("dblclick", "img", function () {

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
			"timeOut": "2000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		}

		// Change favorite icon to a full heart if favorited, or an empty heart if unfavorite.
		$(".favoriteIcon").toggleClass("fa-heart-o").toggleClass("fa-heart");

		// Heart is empty
		if ($(".favoriteIcon").hasClass("fa-heart-o")) {
			toastr["info"]("You unfavorited this image.");
		} else {
			toastr["info"]("You favorited this image.");
		}

		$.post("/image/favorite", {
				userID: $sessionStorage.userID,
				imageID: // TODO, implement favoriting image
			})
			.done(function (data) {

				var message = data.message;
				var errorCode = data.error;

				// Handle errors.
				if (errorCode == 301) {
					emailHint.text(message);
				} else if (errorCode == 302) {
					passwordHint.text(message);
				} else {

					// Successfully logged in.
					sessionStorage.setItem("userID", data.id);
					sessionStorage.setItem("name", data.name);

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
						"timeOut": "2000",
						"extendedTimeOut": "1000",
						"showEasing": "swing",
						"hideEasing": "linear",
						"showMethod": "show",
						"hideMethod": "hide"
					}



					$('#loginModal').modal('hide');

					toastr["success"]("", "Welcome back " + data.name + "!", {
						onHidden: function () {
							location.reload();
						}
					});

					/*window.setTimeout(function () {
						location.reload();
					}, 2000);*/

				}

			});

	});
});