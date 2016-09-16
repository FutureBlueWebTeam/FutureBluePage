$(document).ready(function() {
	// $(window).on('scroll resize', function() {
	// 	// Only show nav when user scrolls past the masthead, and when the width of the screen is greater than 700px
	// 	if ($(window).scrollTop() > ($('.masthead').offset().top + $('.masthead').outerHeight()) - 2 && $(window).width() >= 700) {
	// 		$('.fixed.menu').fadeIn();
	// 	} else {
	// 		$('.fixed.menu').fadeOut();
	// 	}
	// });

	$('a.page-scroll').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
					scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
	});

});
