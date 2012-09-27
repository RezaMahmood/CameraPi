var cameraPi = {};

cameraPi = {
	debug: {},
	allconfigs: undefined,
	camerasummary: undefined,
	cameraabilities: undefined,
	storageinfo: undefined,
	configKeyPrefix: 'C|',
	shotKeyPrefix: 'S|',
	allshots: [],
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
	},
	
	getAllShotsFromLocalStorage: function(){
		for(var i=0;i<localStorage.length;i++)
			{
				var shotId = localStorage.key(i);
				
				if(shotId.substr(0, cameraPi.shotKeyPrefix.length) == cameraPi.shotKeyPrefix)
				{
					var shot = {'Id': shotId, 'Shot': JSON.parse(localStorage.getItem(shotId))}
					cameraPi.allshots.push(shot);
				}
			}
	},
	
	listShots: function(){		
	
		/* Test data structure:
			var data = JSON.stringify({	"Name":"4th Shot", 
										"Configs":[		{"Key":"1st Key", 
														"Value": "1st Value", 
														"Label": "Label1"}, 
														{"Key":"2nd Key", 
														"Value": "2nd Value", 
														"Label":"Label 2"}]})
			localStorage.setItem('S|4', data)
		*/

		if(localStorage.length > 0)
		{
			// filter out all shots
			if(cameraPi.allshots.length == 0)
			{
				cameraPi.getAllShotsFromLocalStorage();
			}
			
			if(cameraPi.allshots.length > 0)
			{
				$('#content').empty().append('<ul></ul>');
				for(var i=0; i<cameraPi.allshots.length;i++)
				{
					var shotItem = cameraPi.allshots[i];
					
					$('#content ul').append('<li id="' + shotItem.Id + '"><a href="#' + shotItem.Id + '">' + shotItem.Shot.Name + '</li>');
				}
				
				$('li[id^="' + cameraPi.shotKeyPrefix + '"]').click(function(){
					cameraPi.editShot($(this).attr('id'));
				});
			}
			else
			{
				alert('You have no shots stored locally');
			}
		}
		else
		{
			alert('You have no shots stored locally');
		}
		
	},
	
	editShot: function(shotId){
		
		var shotItem = cameraPi.getShotById(shotId); 
		console.log(shotItem);
		
		if(shotItem != '')
		{
			$('#shotName').val(shotItem.Shot.Name);
			$('#shotId').val(shotId);
			var allConfigs = shotItem.Shot.Configs;
			for(var i=0;i<allConfigs.length;i++)
			{
				var configItem = allConfigs[i];
				$('#shotConfigs').append('<li>Config Key: ' + configItem.Key + ' | Value: ' + configItem.Value + ' | Label: ' + configItem.Label + '</li>');
			}
			
			$('#content').empty().hide();			
			$('#shots').show();
		
		}
		else
		{
			alert('Could not find shot with id: ' + shotId);
		}
	},
	
	getShotById: function(shotId){
		if(cameraPi.allshots.length > 0)
		{
			for(var i=0;i<cameraPi.allshots.length;i++)
			{
				var shot = cameraPi.allshots[i];
				if(shot.Id == shotId){
					return shot;
				}
			}
		}
		
		return '';
	},
	
	addConfigToShot: function(shotId, config, shotName){
		// check whether shot already exists
		var shot = cameraPi.getShotById(shotId);
		if(shot){
			// add the new config to the array of configs
			shot.Configs.push(config);			
		}
		else{
			// create the shot
			shot = {
					"Name" : shotName,
					"Configs": [config]
			};
		}
		// add the shot to the local shot array
		var shotItemKey = (cameraPi.shotKeyPrefix +shotId);
		var shotItem = { shotItemKey : JSON.stringify(shot)};
		cameraPi.allshots.push(shotItem);
		// persist to local storage
		localStorage.setItem((cameraPi.shotKeyPrefix + shotId), JSON.stringify(shot));
	},
	
	// Gets a unique shot id
	getNewShotId: function(){
		var date = new Date();
		var id = Date.UTC(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
		return id;
	}
	

}