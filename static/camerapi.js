var cameraPi = {};

cameraPi = {
	debug: {},
	allconfigs: undefined,
	camerasummary: undefined,
	cameraabilities: undefined,
	storageinfo: undefined,
	configKeyPrefix: function(){ return 'C|';},
	shotKeyPrefix: function(){ return 'S|';},
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
					cameraPi.allconfigs = data; // cache this locally as it will never change
					callback(data);								
				}		
				
			});
	},
	
    listConfigs: function () {

        $('#content').empty();
		
		if(cameraPi.allconfigs){
			cameraPi.processList(cameraPi.allconfigs, '/getconfig');
		}
		else{
			cameraPi.getAllConfigs(function(data){
				cameraPi.processList(data, '/getconfig');
			});			
		}
    },
	
	processList: function (data, process_url){
		// Split the data on the carriage return so we can iterate over it
		var processedData = data.replace(/[\n\r]/g, ',').split(',');		
		
		processedData.map(function(item){
			// check if this key is in local storage
			var storedConfigKey = cameraPi.configKeyPrefix + item.replace(/\//g,'');
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
									
									cameraPi.getConfig(config, function(data){
										cameraPi.displaySetConfig(data);
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
		var configValue = window.localStorage.getItem(cameraPi.configKeyPrefix + config);
		
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
		
		if(cameraPi.camerasummary)
		{
			cameraPi.processData(cameraPi.camerasummary);			
		}
		else
		{			
			$.get('/listsummary', function (data) {
				if(data != "Camera not found"){
					cameraPi.camerasummary = data; // cache this locally as it will never change
				}
				cameraPi.processData(data);
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


    listAbilities: function () {
        $('#content').empty();
		
		if(cameraPi.cameraabilities)
		{
			cameraPi.processData(cameraPi.cameraabilities);
		}
		else
		{		
			$.get('/listabilities', function (data) {
				if(data != "Camera not found")
				{
					cameraPi.cameraabilities = data; // cache this locally as it will never change
				}
			   cameraPi.processData(data);
			});
		}
    },
	
	processData: function(data){
		$('#content').html(data.replace(/[\n\r]/g, '<br/>'));
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