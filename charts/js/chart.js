var ChartWrapper = function() {
    var NO_HEADER_ROW = 5;
    this.googleChart = false;
    this.isDrawed = false;
    this.options = {
		title: "",
		titleTextStyle: {
			fontSize: 20,
			fontName: 'Open Sans'
		},
		chart: {
			title: "",
			subtitle: "",
		},
		width: 1000,
		height: 500,
		
		seriesType: "bars",
		isStacked: false,
		pointSize: 10,
		pointShape: 'diamond',
		orientation: 'horizontal',
		bars: 'vertical',
		legend: {
			position: 'top', 
			textStyle: {
				fontSize: 14
			}
		},
		series: {},
		bar: {},
		vAxes:{
			0: {
				minValue: 0
			},
			1:{
				minValue: 0,
				textStyle:{
				}
			}
		}
	};
    
    this.setTitle = function(title) {
        this.options.title = title;
        this.options.chart.title = title;
    }
    this.setWidth = function(width) {this.options.width = width;}
    this.setGroupWidth = function(gwidth) {this.options.bar.groupWidth = gwidth;}
    this.setHeight = function(height) {this.options.height = height;}
    this.setIsStacked = function(isStacked) {this.options.isStacked = isStacked;}
    this.setOrientation = function(orientation) {
        this.options.orientation = orientation
        this.options.bars = orientation == 'horizontal' ? 'vertical' : 'horizontal';
    }
    
    this.extraOptions = function(extra) {
        jQuery.extend(this.options, extra);
    }
    
    this.setGoogleChart = function(googleChart) {this.googleChart = googleChart;}
    
    this.extractChartData = function(data) {
        var maxI = data.length;
        var maxJ = data[0].length;
        var eData = [];
        var hData = [];
        var targetI = 0;
        var targetJ = 0;
        for(var i = 0; i < maxI; i++) {
            for(var j = 0; j< maxJ; j++) {
                if(data[i][j] && data[i][j] != '') {
                    targetI = i;
                    targetJ = j;
                }
            }
        }
        for(var i = 0; i <= targetI; i++) {
            var row = [];
            for(var j = 0; j <= targetJ; j++) {
                row.push(data[i][j]);
            }
            if(i < NO_HEADER_ROW) {
                hData.push(row);
            } else {
                eData.push(row);
            }
        }
        
        return {meta: hData, data: eData};
    }
    
    this.buildGoogleHeaderData = function(header, meta, options) {
        var gHeader = [''];
        var lastLabelCol = -1;
        for(var i = 1; i < header.length; i++) {
            //. Check valid data
            var isLabelCol = (meta[0][i] === '1');
            if(isLabelCol) {
                continue;
            }
            
            var isShowLabel = (meta[1][i] !== '0');
            var color = meta[2][i];
            var axis = parseInt(meta[3][i]);
            var chartType = (meta[4][i] === 'line' ? 'line' : 'bar');
            
            gHeader.push(header[i]);
            
            //. Label
            if(isShowLabel) {
                gHeader.push({role: 'annotation'});
            }
            
            //. Axis
            options.series[i] = {
				type: chartType,
				targetAxisIndex: axis
			}
            
            //. Process color
            if(color && color != '') {
                options.series[i-1].color = color;
                if(axis == 1) {
                    options.vAxes[1].textStyle.color = col.color;
		        }
		        if(this.googleChart instanceof google.visualization.PieChart) {
		            var cs = col.color.split(' ');
		            var cs = [];
				    for(var c = 0; c < colors.length; c++) {
				        if(colors[c] && colors[c].trim() != '') {
				          cs.push(colors[c]);
				        }
				    }
				    if(cs.length > 0) {
				        options.colors = cs;
				    }
		        }
            }
        }
        return gHeader;
    }
    this.buildGoogleDataData = function(data, meta) {
        var gData = [];
        for(var i = 1; i < data.length; i++) {
            var row = [];
            row.push(data[i][0]);
            var lastLabelCol = -1;
            for(var j = 1; j < data[i].length; j++) {
                var isLabelCol = (meta[0][j] === '1');
                var isShowLabel = (meta[1][j] !== '0');
                var nextColIsLabel = (j < data[i].length - 1 && meta[0][j+1] === '1');
                
                if(isLabelCol) {
                    if(lastLabelCol != j - 1) {
                        row.push(data[i][j]);
                    }
                    lastLabelCol = j;
                } else {
                    var val = parseFloat(data[i][j]);
                    row.push(val);
                    if(isShowLabel && !nextColIsLabel) {
                        row.push(val.toLocaleString('vi'));
                    }
                }
            }
            gData.push(row);
        }
        return gData;
    }
    
    this.buildGoogleData = function(d, options) {
        var meta = d.meta;
        var data = d.data;
        var gHeaderData = this.buildGoogleHeaderData(data[0], meta, options);
        var gData = this.buildGoogleDataData(data, meta);
        var builtData = [];
        builtData.push(gHeaderData);
        for(var i = 0; i < gData.length; i++) {
            builtData.push(gData[i]);
        }
        return builtData;
    }
    this.draw = function(data) {
        var eData = this.extractChartData(data);
        var gData = this.buildGoogleData(eData, this.options);
        if(this.googleChart) {
            var dataTable = google.visualization.arrayToDataTable(gData);
            var opts = JSON.parse(JSON.stringify(this.options));
            if(this.googleChart instanceof google.charts.Bar) {
                opts = google.charts.Bar.convertOptions(opts);
            }  else if(this.googleChart instanceof google.visualization.PieChart) {
			    opts.legend.position = 'right';
		    }
		    this.googleChart.draw(dataTable, opts);
		    this.isDrawed = true;
        } else {
            alert('can not draw chart');
        }
    }
    
    this.getOptions = function() {
        return JSON.parse(JSON.stringify(this.options));
    }
}

