$(document).ready(function () {
	// When a user submits a login form
	$(".omb_loginForm").submit(function (e) {
		e.preventDefault();

		var email = $('#loginForm').find('input[name="email"]').val().trim();

		var password = $('#loginForm').find('input[name="password"]').val().trim();

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

					$('#loginModal').modal('hide');

					toastr["success"]("Hang on, reloading your page!", "Welcome back " + data.name + "!", {
						onHidden: function () {
							location.reload();

							console.log("RELOAD PAGE");

							var scroll = $(window).scrollTop();
							// yada
							$("html").scrollTop(scroll);

						}
					});

					/*window.setTimeout(function () {
						location.reload();
					}, 2000);*/

				}

			});
	});
});