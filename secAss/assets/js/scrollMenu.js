$(document).ready(function () {

	// Detect a click outside the menu and try to close it.
	$(document).click(function (event) {
		checkNavbar(event.target);
	});

	window.setTimeout(function () { // Detect a scroll outside the menu and try to close it.
		$(document).scroll(function (event) {
			checkNavbar(event.target);
		});
	}, 1000);

});


function checkNavbar(target) {
	if ($(target).hasClass("navbar-toggle")) {
		return;
	}

	var closed = $(".navbar-header button").hasClass("collapsed");

	if (!closed) {
		$('.navbar-toggle').click();
	}
}