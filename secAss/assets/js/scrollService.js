/*
This service will save the last scroll destination from the top and set its when a page is reloaded, so a user can keep scrolling.
*/

// When scrolling, determine latest scroll position
$(document).ready(function () {
	$(window).scroll(function () {

		saveScroll();
	});
});

// Scroll to latest known position
function scrollToOldPos() {
	var oldPos = getCookie("oldPos");

	$('html,body').animate({
		scrollTop: oldPos
	});
}

// Load position, called when page loads.
function loadScroll() {
	scrollToOldPos();
}

// Save position of scroll when reloading a page.
function saveScroll() {
	setCookie("oldPos", $(window).scrollTop(), 2);
}