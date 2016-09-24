$(document).ready(function() {
	var page = 0;

	$('#gallery').on('click', '.gallery-image', function(e) {
		//
		// Show the modal with the photo, as well as any other associated information
		//

		// Get the JSON from the div
		var data = $(this).data('gallery');

		// Insert the image
		$('.overlay-image').html('<img src="' + data.path + '" class="ibm-resize" width="auto" height="100%" />');

		if (data.title && data.title.trim()) {
			// Insert the title
			$('.image-title').html(data.title);

			if (data.description && data.description.trim()) {
				// Insert the title
				$('.image-description').html(data.description);
			}

			// Show the modal
			IBMCore.common.widget.overlay.show('overlay-alt');
		} else {
			// Show the modal
			IBMCore.common.widget.overlay.show('overlay');
		}

		return false;
	});

	$('#show-more').click(function(e) {
		$.ajax({
			url: '/gallery',
			type: 'POST',
			success: function(data) {
				for (var i = 0; i < data.photos.length; i++) {
					var photo = data.photos[i];
					var photoString = JSON.stringify(photo);

					var card = $('<div/>', {
						'class' : 'ibm-col-4-1'
					}).appendTo('#gallery');

					$('<div/>', {
						'class' : 'gallery-image',
						style : "background-image:url('" + photo.path + "');",
						'data-gallery' : photoString
					}).appendTo(card);
				}

				if ($('#gallery > div.ibm-col-4-1').length >= data.totalNumPhotos) {
					$('#show-more').attr('disabled', '');
				}
				$('#num-shown').html($('#gallery > div.ibm-col-4-1').length);
				$('#total-photos').html(data.totalNumPhotos);
			},
			error: function(data) {
				// console.log(data);
			},
			data: {
				page : ++page
			}
      });
	});
});