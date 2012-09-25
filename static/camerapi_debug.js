cameraPi.debug = {
	listStorage: function(){
		$('#content').empty();
		for(var i=0;i<localStorage.length;i++)
		{
			$('#content').append('<div>' + localStorage.getItem(localStorage.key(i)) + '</div>');
		}
	},
	
	syncCamera: function(){
		// Get all the config settings
		if(!cameraPi.allconfigs)
		{
			cameraPi.getAllConfigs(function(data){
				cameraPi.processSyncCamera(data);
			});
		}
		else
		{
			cameraPi.processSyncCamera(cameraPi.allconfigs);
		}
	},
	
	processSyncCamera: function(data){
		var allrawconfigs = data.replace(/[\n\r]/g, ',');
		var allconfigs = allrawconfigs.split(',');				
		
		
		// iterate through each config setting
		for(var i=0;i<allconfigs.length;i++)
		{						
			var configKey = allconfigs[i];
			cameraPi.getConfig(configKey, function(data, configKey){				
				window.localStorage.setItem(configKey, data);				
			});
		}
	},
	
    resetCameraConnection: function () {
        $.get('/resetconnection', function (data) {
            alert(data);
        });
    },
	
	getStorageInfo: function(){
		$('#content').empty();
		
		if(cameraPi.storageinfo)
		{
			cameraPi.processData(cameraPi.storageinfo)
		}
		else
		{
		
			$.get('/storageinfo', function(data){
				cameraPi.storageinfo = data;
				cameraPi.processData(data);
			});
		}
	}
}