$(document).ready(function () {

	$("nav").on("click", "#logoutButton", function () {

		console.log("LALA");

		$.post("/logout", {})
			.done(function (data) {

				// Successfully logged in.
				sessionStorage.removeItem("userID");
				sessionStorage.removeItem("name");

				toastr["success"]("Hang on, reloading your page!", "You are being logged out.", {
					onHidden: function () {
						location.reload();
					}
				});
			});

	});
});