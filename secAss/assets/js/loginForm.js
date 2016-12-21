$(document).ready(function () {
	$(".omb_loginForm").submit(function (e) {
		e.preventDefault();

		var email = $('#loginForm').find('input[name="email"]').val();

		var password = $('#loginForm').find('input[name="password"]').val();

		console.log("Email: " + email);
		console.log("Password: " + password);

		var emailHint = $("#emailMessage");
		var passwordHint = $("#passwordMessage");

		emailHint.text("");
		passwordHint.text("");


		$.post("/login", {
				email: email,
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

				}

			});
	});
});