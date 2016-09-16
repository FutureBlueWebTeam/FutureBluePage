$(document).ready(function() {
	// Someone please fix this terrible sticky footer
	$(window).resize(function() {
		var newSize = $(window).height() - $('.footer').outerHeight() - $('.wrapper').outerHeight();

		if (newSize > 0) {
			$('.main').attr('style', 'margin-bottom: ' + newSize + 'px !important');
		}
	});

    $(window).resize();
});