$(document).ready(function() {

	$('a.activities-button').on('click', function(){
		$('#activities-modal').modal('show');
	});

  $('a.cnd-button').on('click', function(){
    $('#cnd-modal').modal('show');
  });

  $('a.web-button').on('click', function(){
    $('#web-modal').modal('show');
  });

  $('a.blog-button').on('click', function(){
    $('#blog-modal').modal('show');
  });

});
