$(document).ready(function () {
	// When a user submits a login form
	$(".omb_loginForm").submit(function (e) {
		e.preventDefault();

		var email = $('#loginForm').find('input[name="email"]').val();

		var password = $('#loginForm').find('input[name="password"]').val();

		var emailHint = $('#loginForm').find("#emailMessage");
		var passwordHint = $('#loginForm').find("#passwordMessage");

		emailHint.text("");
		passwordHint.text("");

		// Check if email is valid
		if (!validateEmail(email) || email.length < 4 || !email.includes("@")) {
			emailHint.text("Please provide a valid email address.");
			return;
		}

		$.post("/login", {
				email: email.toLowerCase(),
				password: password
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