$(document).ready(function() {
	$('.internshipStart').pickadate({
		format : 'yyyy-mm-dd'
	});
	
	$('.internshipEnd').pickadate({
		format : 'yyyy-mm-dd'
	});

	$('.ui.form').form({
		fields: {
			firstName: {
				identifier : 'firstName',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your first name'
				}]
			},
			lastName: {
				identifier : 'lastName',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your last name'
				}]
			},
			email: {
				identifier : 'email',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your e-mail'
				},
				{
					type   : 'email',
					prompt : 'Please enter a valid e-mail'
				}]
			},
			password: {
				identifier : 'password',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your password'
				},
				{
					type   : 'length[6]',
					prompt : 'Your password must be at least 6 characters'
				}]
			}
		}
	});
});