$(document).ready(function () {

	$("nav").on("click", "#logoutButton", function () {

		console.log("LALA");

		$.post("/logout", {})
			.done(function (data) {

				// Successfully logged in.
				sessionStorage.removeItem("userID");
				sessionStorage.removeItem("name");

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

				toastr["success"]("Hang on, reloading your page!", "You are being logged out.", {
					onHidden: function () {
						location.reload();
					}
				});
			});

	});
});