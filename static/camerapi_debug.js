cameraweb.debug = {
	listStorage: function(){
		$('#content').empty();
		for(var i=0;i<localStorage.length;i++)
		{
			$('#content').append('<div>' + localStorage.getItem(localStorage.key(i)) + '</div>');
		}
	}
}