$(document).ready(function() {
  $('#upload-form').submit(function(e) {
      e.preventDefault();
      var formData = new FormData($('#upload-form')[0]);
      $.ajax({
          url: 'dashboard/blog/create-post/upload_featured_image',
          type: 'POST',
          xhr: function() {
              var myXhr = $.ajaxSettings.xhr();
              return myXhr;
          },
          success: function(data) {
            $('#featured-img').attr('src', data.src);
            featuredImage = data.src;
            $('a.ibm-remove-link').click();
          },
          error: function(data) {
            console.log(data);
          },
          data: formData,
          cache: false,
          contentType: false,
          processData: false
      });
  });

  $('#add-tag-btn').click(function() {
    var tag = $("#post-tags").val().trim();

    if (tag.length === 0) {
      return;
    }

    $("#post-tags").val("");

    $('#tag-list').append("<div class=\"ui post-tag basic large label\"><span>" + tag + "</span><i class=\"delete icon\"></i></div>");
  });

  $(document).on('click', '.post-tag .delete', function() {
    $(this).parent().remove();
  });

  $('#preview-btn').click(function() {
    var header = "<h1 class=\"ui header\">Post Preview</h1><div class=\"ui divider\"></div>";

    $('#preview').html(header + CKEDITOR.instances.editor.getData()).promise().done(function() {
      $('html, body').stop().animate({
        scrollTo: $('.preview-row').offset().top - $("#nav-bar").height()
      }, 1000, 'easeInOutExpo');

      return false;
    });
  });
});