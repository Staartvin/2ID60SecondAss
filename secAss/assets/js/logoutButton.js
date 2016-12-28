$(document).ready(function () {

	$("#logoutButton").on("click", function () {

		$.post("/logout", {})
			.done(function (data) {

				// Successfully logged in.
				sessionStorage.setItem("userID", null);
				sessionStorage.setItem("name", null);

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

				toastr["success"]("", "You are now logged out.", {
					onHidden: function () {
						location.reload();
					}
				});
			});

	});
});