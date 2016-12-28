$(document).ready(function () {

	// If user clicks the signup text
	$("#signup-button").on("click", function () {

		// Hide login form
		$("#loginModal").modal('hide');

		// Open signup form
		$("#signupModal").modal('show');
	});
});

$(document).ready(function () {
	// When user submits a signup form
	$(".omb_signupForm").submit(function (e) {
		e.preventDefault();

		var email = $('#signupForm').find('input[name="email"]').val();
		var username = $('#signupForm').find('input[name="username"]').val().trim();
		var password = $('#signupForm').find('input[name="password"]').val();
		var passwordConfirm = $('#signupForm').find('input[name="passwordConfirm"]').val();

		var emailHint = $('#signupForm').find("#emailMessage");
		var passwordHint = $('#signupForm').find("#passwordMessage");
		var userNameHint = $('#signupForm').find("#userNameMessage");
		var passwordConfirmHint = $('#signupForm').find("#passwordConfirmMessage");

		userNameHint.text("");
		emailHint.text("");
		passwordHint.text("");
		passwordConfirmHint.text("");


		// Check username field
		if (username.length < 5) {
			userNameHint.text("Your username should have at least 5 characters.");
			return;
		}

		// Check if email is valid
		if (!validateEmail(email) || email.length < 4 || !email.includes("@")) {
			emailHint.text("Your email address is not valid!");
			return;
		}

		// Check if password has appropriate length
		if (password.length < 5) {
			passwordHint.text("Your password must have at least 5 characters.");
			return;
		}

		// Check if confirmation is correct.
		if (password != passwordConfirm) {
			passwordConfirmHint.text("Your passwords do not match");
			return;
		}


		$.post("/signup", {
				email: email.toLowerCase(),
				password: password,
				name: username
			})
			.done(function (data) {

				var message = data.message;
				var errorCode = data.error;

				// Handle errors.
				if (errorCode == 303) {
					emailHint.text(message);
				} else if (errorCode == 304) {
					userNameHint.text(message);
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

					toastr["info"]("", "Welcome to WebGram, " + data.name + ".", {
						onHidden: function () {
							location.reload();
						}
					});

					$('#signupModal').modal('hide');

				}

			});
	});
});

function validateEmail($email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailReg.test($email);
}