var cameraweb = {};

cameraweb = {
	debug: {},
	allconfigs: undefined,
	camerasummary: undefined,
	cameraabilities: undefined,
	storageinfo: undefined,
	processing: function(){return false;},
	getAllConfigs: function(callback){
		$.get('/listconfig', function (data) {		
				
				if(data && data.hasOwnProperty('error'))
				{
					$('#content').empty();
					 jQuery.each(data, function (i, v) {
						$('#content').append('<div>' + v + '</div>');
					});
				}
				else
				{	
					cameraweb.allconfigs = data; // cache this locally as it will never change
					callback(data);								
				}		
				
			});
	},
	
    listConfigs: function () {

        $('#content').empty();
		
		if(cameraweb.allconfigs){
			cameraweb.processList(cameraweb.allconfigs, '/getconfig');
		}
		else{
			cameraweb.getAllConfigs(function(data){
				cameraweb.processList(data, '/getconfig');
			});			
		}
    },
	
	processList: function (data, process_url){
		// Split the data on the carriage return so we can iterate over it
		var processedData = data.replace(/[\n\r]/g, ',').split(',');		
		
		processedData.map(function(item){
			// check if this key is in local storage
			var storedConfigKey = item.replace(/\//g,'');
			var storedConfigValue = localStorage.getItem(item);
			if(!storedConfigValue)
			{				
				localStorage.setItem(storedConfigKey, ''); // Store the config key with no value
			}
			
			$('#content').append('<div><a href="#' + item + '">' + item + '</a></div>');			
		});
		
		$('#content div').click(function () {
									var thisid = this.id
									var config = $(this).text();
									
									cameraweb.getConfig(config, function(data){
										cameraweb.displaySetConfig(data);
									});							

								});
		
		
	},
	
	displaySetConfig: function(data){
		var $dialog = $('<div></div>').dialog({autoOpen:false, title:'Config', 'position': 'top'});		
		$dialog.html(data.replace(/[\n\r]/g, '<br/>')).dialog('open');
		return false;
	},
	
	getConfig: function(config, callback){
	
		// check whether the config value is stored locally first		
		var configValue = window.localStorage.getItem(config);
		
		if(configValue)
		{
			callback(configValue, config);
		}
		else
		{		
			$.ajax({
					url: '/getconfig',
					contentType: 'application/json',
					data: { configkey: config },
					dataType: 'text',
					success: function (data) {	
						if(callback){
							// put the config value into local storage to keep UI in sync							
							localStorage.setItem(config, data);
							callback(data, config);
						}					
					},
					type: 'GET'
				});
		}
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
	},
	
	syncCamera: function(){
		// Get all the config settings
		if(!cameraweb.allconfigs)
		{
			cameraweb.getAllConfigs(function(data){
				cameraweb.processSyncCamera(data);
			});
		}
		else
		{
			cameraweb.processSyncCamera(cameraweb.allconfigs);
		}
	},
	
	processSyncCamera: function(data){
		var allrawconfigs = data.replace(/[\n\r]/g, ',');
		var allconfigs = allrawconfigs.split(',');				
		
		
		// iterate through each config setting
		for(var i=0;i<allconfigs.length;i++)
		{						
			var configKey = allconfigs[i];
			cameraweb.getConfig(configKey, function(data, configKey){				
				window.localStorage.setItem(configKey, data);				
			});
		}		
	}

}