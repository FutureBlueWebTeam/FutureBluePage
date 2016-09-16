$(document).ready(function() {
	$('.ibm-previous-link').click(function(e) {
		// Get the currentpage
		var page = getParam('page');

		// Check if the page was defined
		if (page === undefined) {
			// If the user wants to go to the next page, go to page two. If they want to go Previous, go to page 1
			$('input[name=\'page\']').val(1);
		} else {
			// Check if the page is less than or equal to 1. If it is, stay on page 1. If not, go to the previous page
			$('input[name=\'page\']').val(parseInt(page) <= 1 ? 1 : parseInt(page) - 1);
		}

		// Get how many posts to show from the url
		var show = getParam('show');

		// If the user didn't specify a value, or specified an invalid value, show 10. Else, show the number they wanted
		$('input[name=\'show\']').val(show === undefined || parseInt(show) < 1 ? 10 : parseInt(show));

		// Get what category to search
		var category = getParam('category');

		// If they didn't specify, show all. If they did, only show posts from that category
		$('input[name=\'category\']').val(category === undefined ? 'All' : category);

		// Submit the pagination form
		$('#pagination-form').submit();

		// Submit the form
		return true;
	});

	$('.ibm-next-link').click(function(e) {
		// Get the currentpage
		var page = getParam('page');

		// Check if the page was defined
		if (page === undefined) {
			// If the user wants to go to the next page, go to page two. If they want to go Previous, go to page 1
			$('input[name=\'page\']').val(2);
		} else {
			// Go to the next page
			$('input[name=\'page\']').val(parseInt(page) + 1);
		}

		// Get how many posts to show from the url
		var show = getParam('show');

		// If the user didn't specify a value, or specified an invalid value, show 10. Else, show the number they wanted
		$('input[name=\'show\']').val(show === undefined || parseInt(show) < 1 ? 10 : parseInt(show));

		// Get what category to search
		var category = getParam('category');

		// If they didn't specify, show all. If they did, only show posts from that category
		$('input[name=\'category\']').val(category === undefined ? 'All' : category);

		// Submit the pagination form
		$('#pagination-form').submit();

		// Submit the form
		return true;
	});
});

/* Gets the specified parameter from the url
----------------------------------------------- */
var getParam = function getParam(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};