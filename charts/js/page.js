jQuery.noConflict();
google.load("visualization", "1.1", {packages:["corechart", "bar"], language: 'vi'});
google.setOnLoadCallback(function() {
jQuery(document).ready(function($) {
    var GOOGLE_CHART_DOM_ID = 'google_chart';
    var MONGO_API_KEY_FIELD = "mongoDBAPIKEY";
    
    var table = new TableWrapper('data_table', 'config_table');
    var googleChart = new google.visualization.ComboChart(document.getElementById(GOOGLE_CHART_DOM_ID));
    var chart = new ChartWrapper();
    var mongodb = new MongoDB();
    var currentChartID = false;
    
    table.init();
    chart.setGoogleChart(googleChart);
    table.setOnDataChange(function(changes, source){
        if(chart.isDrawed) {
            var data = table.getData();
            chart.draw(data);
        }
    });
    
    var loadMongoData = function(key) {
        mongodb.setApiKey(key);
        mongodb.getList(function(data){
            var $chartTemplate = $('#chartItemTemplate');
            var $chartList = $('#chartListGroup');
            var template = $chartTemplate.html().trim();
            for(var i = 0; i < data.length; i++) {
                var chart = data[i];
                var id = chart._id;
                if(id.$oid != undefined) {
                    id = id.$oid;
                }
                var item = template;
                item = item.replace('{chart_id}', id);
                item = item.replace('{chart_title}', "Chart: " + chart.options.title);
                $chartList.append($(item));
            }
        });
    }
    
    $('#initMongoDB').on('click', function(e) {
        var $mongoLabApiKey = $('#mongoLabApiKey');
        var key = $mongoLabApiKey.val();
        if(key != '') {
            localStorage.setItem(MONGO_API_KEY_FIELD, key);
            loadMongoData(key);
        }
    });
    
    $('#chartListGroup').on('click', 'a', function(e) {
        var $a = $(e.target).closest('a');
        var $li = $a.closest('li');
        var chartId = $li.attr('chart-id');
        
        if($a.hasClass('chartDelete')) {
            mongodb.deleteChart(chartId, function(data) {
                alert('chart is removed');
                window.location.reload();
            });
            
        } else {
            mongodb.getChart(chartId, function(c) {
                var data = c.data;
                var opts = c.options;
                currentChartID = c._id;
                table.setData(data);
                chart.extraOptions(opts);
                chart.draw(table.getData());
            });
        }
    });
    
    
    $('#draw_chart').on('click', function(e){
        var data = table.getData();
        chart.draw(data);
        return false;
    });
    
    $('#save_chart').on('click', function(e){
        var data = table.getData();
        var options = chart.getOptions();
        var sc = {data: data, options: options};
        if(currentChartID && currentChartID != '') {
            sc._id = currentChartID;
        }
        mongodb.save(sc, function(data) {
            currentChartID = data._id;
            alert('save chart success fully');
        });
    });
    $('#save_as_new_chart').on('click', function(e){
        var data = table.getData();
        var options = chart.getOptions();
        var sc = {data: data, options: options};
        mongodb.save(sc, function(data) {
            currentChartID = data._id;
            alert('save chart success fully');
        });
    });
    
    $('#chartConfigModal').on('shown.bs.modal', function () {
        var $modal = $(this);
        var opts = chart.getOptions();

        var chartType;
        if(googleChart instanceof google.visualization.ComboChart) {
            chartType = 'combo';
        } else if(googleChart instanceof google.visualization.PieChart) {
            chartType = 'pie';
        } else if(googleChart instanceof google.charts.Bar) {
            chartType = 'column';
        }
        
        $modal.find('#chartType').val(chartType);
        $modal.find('#chartTitle').val(opts.title);
        $modal.find('#chartWidth').val(opts.width);
        $modal.find('#chartGroupWidth').val(opts.bar.groupWidth);
        $modal.find('#chartHeight').val(opts.height);
        $modal.find('#chartIsStacked').attr("checked", opts.isStacked);
        $modal.find('#chartIsVertical').attr("checked", opts.orientation == 'vertical');
    });
    
    $('#chartConfigSave').on('click', function(e) {
        var $modal = $('#chartConfigModal');
        var chartType = $modal.find('#chartType').val();
        var container = document.getElementById(GOOGLE_CHART_DOM_ID);
        if(chartType == 'combo') {
            googleChart = new google.visualization.ComboChart(container);
        } else if(chartType == 'column') {
            googleChart = new google.charts.Bar(container);
        } else if(chartType == 'pie') {
            googleChart = new google.visualization.PieChart(container);
        } else {
            googleChart = false;
        }
        chart.setGoogleChart(googleChart);
        chart.setTitle($modal.find('#chartTitle').val());
        chart.setWidth(parseInt($modal.find('#chartWidth').val()));
        var groupWidth = parseInt($modal.find('#chartGroupWidth').val());
        if(groupWidth > 0) {
            chart.setGroupWidth(groupWidth);
        }
        chart.setHeight(parseInt($modal.find('#chartHeight').val()));
        chart.setIsStacked($modal.find('#chartIsStacked').is(":checked"));
        chart.setOrientation($modal.find('#chartIsVertical').is(":checked") ? 'vertical' : 'horizontal');
        
        //$modal.modal('toggle');
        
        //console.log(chart.getOptions());
        if(chart.isDrawed) {
            var data = table.getData();
            chart.draw(data);
        }
    });
    
    var apiKey = localStorage.getItem(MONGO_API_KEY_FIELD);
    if(apiKey != undefined && apiKey != '') {
        $('#mongoLabApiKey').val(apiKey);
        $('#initMongoDB').click();
    }
});
});
