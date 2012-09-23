var cameraweb = {};

cameraweb = {
	allconfigs: undefined,
	camerasummary: undefined,
	cameraabilities: undefined,
	storageinfo: undefined,
    listConfigs: function () {

        $('#content').empty();
		
		if(cameraweb.allconfigs){
			cameraweb.processList(cameraweb.allconfigs, '/getconfig');
		}
		else{

			$.get('/listconfig', function (data) {		
				
				if(data && data.hasOwnProperty('error'))
				{
					 jQuery.each(data, function (i, v) {
						$('#content').append('<div>' + v + '</div>');
					});
				}
				else
				{	
					cameraweb.allconfigs = data; // cache this locally as it will never change
					cameraweb.processList(data, '/getconfig');				
				}		
				
			});
		}
    },
	
	processList: function (data, process_url){
		// Split the data on the carriage return so we can iterate over it
		var processedData = data.replace(/[\n\r]/g, ',').split(',');		
		
		processedData.map(function(item){
			$('#content').append('<div><a href="#' + item.replace('\/','') + '">' + item + '</a></div>');
		});
		
		$('#content div').click(function () {
									var thisid = this.id
									var config = $(this).text();

									$.ajax({
										url: process_url,
										contentType: 'application/json',
										data: { configkey: config },
										dataType: 'text',
										success: function (data) {
											alert(data);
										},
										type: 'GET'
									});

								});
		
		
	},

    listSummary: function () {
        $('#content').empty();		
		
		if(cameraweb.camerasummary)
		{
			cameraweb.processData(cameraweb.camerasummary);			
		}
		else
		{			
			$.get('/listsummary', function (data) {
				if(data != "Camera not found"){
					cameraweb.camerasummary = data; // cache this locally as it will never change
				}
				cameraweb.processData(data);
			});
		}
		
    },

    captureImage: function () {
		$('#content').empty();
        $.get('/captureimage', function(data){
			if(data != "false")
				{
					$('#content').append('<img id="image" />');
					
					var newimg = new Image();
					$(newimg).load(function(){
						$('#image').attr('src', this.src);
					}).attr('src', '/static/' + data);
				}			
		});
    },

    resetCameraConnection: function () {
        $.get('/resetconnection', function (data) {
            alert(data);
        });
    },

    listAbilities: function () {
        $('#content').empty();
		
		if(cameraweb.cameraabilities)
		{
			cameraweb.processData(cameraweb.cameraabilities);
		}
		else
		{		
			$.get('/listabilities', function (data) {
				if(data != "Camera not found")
				{
					cameraweb.cameraabilities = data; // cache this locally as it will never change
				}
			   cameraweb.processData(data);
			});
		}
    },
	
	processData: function(data){
		$('#content').html(data.replace(/[\n\r]/g, '<br/>'));
	},
	
	getStorageInfo: function(){
		$('#content').empty();
		
		if(cameraweb.storageinfo)
		{
			cameraweb.processData(cameraweb.storageinfo)
		}
		else
		{
		
			$.get('/storageinfo', function(data){
				cameraweb.storageinfo = data;
				cameraweb.processData(data);
			});
		}
	},
	
	capturePreview: function(){
		$('#content').empty();
		
		$.get('/capturepreview', function(data){
			if(data != "false")
				{
					$('#content').append('<img id="image" />');
					
					var newimg = new Image();
					$(newimg).load(function(){
						$('#image').attr('src', this.src);
					}).attr('src', '/static/' + data);
				}
		});
	}

}