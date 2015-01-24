var MongoDB = function(apiKey) {
    var DOC_TYPE = 'google_chart_data';
    var BASE_URL = 'https://api.mongolab.com/api/1';
    var COLLECTION_BASE_URI = '/databases/nttuyen_chart/collections/';
    this.apiKey = apiKey;
    this.database = 'nttuyen_charts';
    
    this.isValid = function() {
        return (this.apiKey && this.apiKey != '');
    }
    
    this.buildURL = function(uri, queryParam) {
        var url =  BASE_URL + uri + '?apiKey=' + this.apiKey;
        if(queryParam && queryParam != '') {
            url += '&' + queryParam;
        }
        return url;
    }
    
    this.setApiKey = function(key) {
        this.apiKey = key;        
    }
    this.setDatabase = function(db) {
        this.database = db;
    }
    
    this.getList = function(callback) {
        var url = this.buildURL(COLLECTION_BASE_URI + this.database, 'q={docType:"'+DOC_TYPE+'"}');
        jQuery.ajax({
            url: url,
            data: {},
            dataType: 'json',
            success: function(response) {
                if(jQuery.isFunction(callback)) {
                    callback(response);
                }
            }
        });
    }
    
    this.getChart = function(id, callback) {
        var url = this.buildURL(COLLECTION_BASE_URI + this.database + "/" + id);
        jQuery.ajax({
            url: url,
            data: {},
            dataType: 'json',
            success: function(response) {
                if(jQuery.isFunction(callback)) {
                    callback(response);
                }
            }
        });
    }
    
    this.save = function(data, callback) {
        if(!data) {
            return;
        }
        data.docType = DOC_TYPE;
        
        var url = this.buildURL(COLLECTION_BASE_URI + this.database);
        $.ajax({ 
            url: url,
		    data: JSON.stringify(data),
		    type: "POST",
		    contentType: "application/json",
		    success: function(response) {
                if(jQuery.isFunction(callback)) {
                    callback(response);
                }
		    }
		});
    }
    this.deleteChart = function(id, callback) {
        var url = this.buildURL(COLLECTION_BASE_URI + this.database + "/" + id);
        $.ajax( { url: url,
		  type: "DELETE",
		  async: true,
		  timeout: 300000,
		  success: function (data) { 
		    if(jQuery.isFunction(callback)) {
		        callback(data);
		    }
		  },
		  error: function (xhr, status, err) { 
		    alert('delete not successfully');
		  }
		});
    }
}
