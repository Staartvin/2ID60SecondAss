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
						"showMethod": "fadeIn",
						"hideMethod": "fadeOut"
					}

					toastr["success"]("Welcome back " + data.name + "!")

					$('#loginModal').modal('hide');

				}

			});
	});
});