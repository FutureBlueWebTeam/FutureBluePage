$(document).ready(function() {
	// Someone please fix this terrible sticky footer
	$(window).resize(function() {
		var newSize = $(window).height() - $('.footer').outerHeight() - $('.wrapper').outerHeight();

		if (newSize > 0) {
			$('.main').attr('style', 'margin-bottom: ' + newSize + 'px !important');
		}
	});

	$(window).resize();

	$('#upload-btn').click(function(e) {
      e.preventDefault();
      var file = $('#browse-photo')[0].files[0];
      var formData = new FormData();
      formData.append("file", file);

      $.ajax({
          url: '/dashboard/profile/upload_profile_picture',
          type: 'POST',
          xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            return myXhr;
          },
          success: function(data) {
            $('#profile-picture').attr('src', data.src);
            $('a.ibm-remove-link')[0].click();
          },
          error: function(err) {
            console.log(err);
          },
          data: formData,
          cache: false,
          contentType: false,
          processData: false
      });
  	});
});