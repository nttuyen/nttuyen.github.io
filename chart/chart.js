NUMBER_FORMAT = '0,0.00';
google.load("visualization", "1", {packages:["corechart"]});
googleChart = false;

var Chart = function() {
	//Private method
	function getNumberColumnType() {
		return {
			type: 'numeric',
			allowInvalid: false,
			format: NUMBER_FORMAT
		};
	}
	function getChartTypeColumnType() {
		return {
			type: 'dropdown',
			source: ['bar', 'line']
		};
	}
	function getTextColumnType() {
		return {
			type: 'text'
		};
	}
	function getCheckboxColumnType() {
		return {
			type: 'checkbox'
		};
	}
	
	function createNewColumn() {
		return {
			title: 'Colum name',
			type: 'bar',
			isShowLabel: true,
			color: '',
			axis: 0,
		};
	}
	
	this.isDrawed = false;
	
	//Properties
	this.columnHeaders = ['Tên cột', 'Loại biểu đồ', 'Hiển thị nhãn', 'Màu biểu đồ', 'Cột tọa độ'];
	this.columnHeaderDefs = [getTextColumnType(), getChartTypeColumnType(), getCheckboxColumnType(), getTextColumnType(), getChartTypeColumnType()];
	this.columnHeaderDefs[0].data = 'title';
	this.columnHeaderDefs[1].data = 'type';
	this.columnHeaderDefs[2].data = 'isShowLabel';
	this.columnHeaderDefs[3].data = 'color';
	this.columnHeaderDefs[4].data = 'axis';
	this.columnHeaderDefs[4].source = ['0', '1'];
	
	this.columns = [];
	this.columns.push(createNewColumn());
	
	this.dataHeaders = false;
	this.dataColmnDef = false;
	this.data = false;
	
	this.headerTable = false;
	this.dataTable = false;
	
	this.init = function() {
		var $this = this;
		
		var d = [];
		var h = [];
		var temp = [];
		var colDef = [];
		
		h.push('');
		temp.push('');
		colDef.push({type:'text'});
		
		for(var i = 0; i < this.columns.length; i++) {
			var col = this.columns[i];
			h.push(col.title);
			temp.push('0');
			colDef.push(getNumberColumnType());
			h.push('[LABEL]' + col.title);
			temp.push('');
			colDef.push(getTextColumnType());
		}
		d.push(temp);
		$this.dataHeaders = h;
		$this.data = d;
		$this.dataColmnDef = colDef;
	};
	
	this.drawTable = function () {
		var $this = this;
		
		//. Header table
		if(!$this.headerTable) {
			var columnTabelContainer = document.getElementById('chart_columns');
			$this.headerTable = new Handsontable(columnTabelContainer, {
				colHeaders: $this.columnHeaders,
				data: $this.columns,
				observeChanges: true,
				columns: $this.columnHeaderDefs,
				afterChange: function(changes, source) {
					if(!changes) {
						return;
					}
					for(var i = 0; i < changes.length; i++) {
						var change = changes[i];
						var row = change[0];
						var field = change[1];
						var oldValue = change[2];
						var newValue = change[3];
						
						//. Find column index
						var columnIndex = 1;
						for(var j = 0; j < row; j++) {
							columnIndex++;
							if($this.columns[j].isShowLabel) {
								columnIndex++;
							}
						}
						
						var isUpdated = false;
						var col = $this.columns[row];
						if(field == 'title') {
							$this.dataHeaders[columnIndex] = newValue;
							if(col.isShowLabel) {
								$this.dataHeaders[columnIndex + 1] = '[LABEL]' + newValue;
							}
							isUpdated = true;
						}
						
						if(isUpdated && $this.dataTable) {
							$this.dataTable.updateSettings({
								colHeaders: $this.dataHeaders
							});
						}
						
						if($this.isDrawed) {
							$this.draw();
						}
					}
				}
			});
		} else {
			$this.headerTable.render();
		}
		
		//. Data table
		if(!$this.dataTable) {
			var container = document.getElementById('table_data');
			$this.dataTable = new Handsontable(container, {
				colHeaders: $this.dataHeaders,
				data: $this.data,
				columnSorting: true,
				observeChanges: true,
				columns: $this.dataColmnDef,
				afterChange: function(changes, source) {
					if($this.isDrawed) {
						$this.draw();
					}
				}
			});
		} else {
			$this.dataTable.render();
		}
	};
	
	this.addColumn = function(column) {
		var $this = this;
		var col = jQuery.extend({}, createNewColumn(), column);
		
		//
		$this.columns.push(col);
		//$this.columnData.push([col.title, col.type, col.isShowLabel, col.color]);
		
		//. Update columnDef
		$this.dataColmnDef.push(getNumberColumnType());
		if(col.isShowLabel) {
			this.dataColmnDef.push(getTextColumnType());
		}
		
		//. Update data
		var d = $this.data;
		
		//. Header
		$this.dataHeaders.push(col.title);
		if(col.isShowLabel) {
			$this.dataHeaders.push('[LABEL]' + col.title);
		}
		
		for(var i = 0; i < d.length; i++) {
			d[i].push(0);
			if(col.isShowLabel) {
				d[i].push('label');
			}
		}
		$this.data = d;
		$this.dataTable.updateSettings({columns: $this.dataColmnDef});
	}
	this.setColumn = function(index, column) {
		if(!column) return;
		if(index >= this.columns.length) {
			this.addColumn(column);
		} else {
			jQuery.extend(this.columns[index], column);
		}
	}
	this.addRow = function(row) {
		var $this = this;
		if(row && row.length > 0) {
			$this.data.push(row);
		} else {
			var r = [];
			r.push('');
			for(var i = 0; i < $this.columns.length; i++){
				r.push(0);
				r.push('?');
			}
			$this.data.push(r);
		}
	}
	this.setRow = function(index, row) {
		if(!row || row.length == 0) {
			return;
		}
		if(index >= this.data.length) {
			this.addRow(row);
		} else {
			this.data[index] = row;
		}
	}
	
	this.draw = function() {
		var $this = this;
		if(!googleChart) {
			alert('can not draw because google chart is not loaded');
			return false;
		}
		//. Title
		var $title = jQuery('#chart_title').val();
		var $width = jQuery('#chart_width').val();
		var $height = jQuery('#chart_height').val();
		var $groupWidth = jQuery('#chart_group_width').val();
		var $isStacked = jQuery('#chart_is_stacked').is(':checked');
		var $orientation = jQuery('#chart_is_vertical').is(':checked') ? 'vertical' : 'horizontal';
		
		//. Build options
		var options = {
			title: $title,
			titleTextStyle: {
				fontName: 'Time new roman',
				fontSize: 28
			},
			seriesType: "bars",
			isStacked: $isStacked,
			orientation: $orientation,
			//series: {5: {type: "line"}}
			width: $width,
			height: $height,
			legend: {
				position: 'top', 
				textStyle: {
					//color: 'blue', 
					fontSize: 14
				}
			},
			series: {},
			vAxes:{
				0: {
					minValue: 0
				},
				1:{
					minValue: 0,
					textStyle:{
						//color: 'red'
					}
				}
			}
		};
		if($groupWidth > 0) {
			options.bar = {
				groupWidth: $groupWidth
			}
		}
		
		var d = [];
		var h = [];
		h.push('');
		for(var i = 0; i < $this.columns.length; i++) {
			var col = $this.columns[i];
			h.push(col.title);
			if(col.isShowLabel) {
				h.push({role: 'annotation'});
			}
			options.series[i] = {
				type: col.type,
				targetAxisIndex: col.axis
			}
			if(col.color && col.color != '') {
				options.series[i].color = col.color;
				
				if(col.axis == 1) {
					options.vAxes[1].textStyle.color = col.color;
				}
			}
		}
		d.push(h);
		for(var i = 0; i < $this.data.length; i++) {
			var s = JSON.parse(JSON.stringify($this.data[i]));
			var ns = [];
			ns.push(s[0]);
			var index = 1;
			for(var j = 0; j < $this.columns.length; j++) {
				var col = $this.columns[j];
				ns.push(s[index]);
				index++;
				if(col.isShowLabel) {
					ns.push(s[index]);
				}
				index++;
			}
			d.push(ns);
		}
		
		var gd = google.visualization.arrayToDataTable(d);
		googleChart.draw(gd, options);
		this.isDrawed = true;
	}

	this.reset = function() {
		//TODO: how to reset chart
	}
	
	this.loadData = function(data) {
		var $this = this;
		$this.reset();
		if(data.config) {
			jQuery('#chart_title').val(data.config.title);
			jQuery('#chart_width').val(data.config.width);
			jQuery('#chart_height').val(data.config.height);
			jQuery('#chart_group_width').val(data.config.groupWidth);
			jQuery('#chart_is_stacked').attr('checked', data.config.isStacked);
			jQuery('#chart_is_vertical').attr('checked', data.config.isVertical);
		}
		
		//. Process column
		if(data.columns && data.columns.length > 0) {
			for(var i = 0; i < data.columns.length; i++) {
				var title = data.columns[i];
				var col = {
					title: title,
					type: 'bar',
					isShowLabel: true,
					color: '',
					axis: 0,
				};
				col = jQuery.extend(col, data.columnConfigs[i]);
				
				$this.setColumn(i, col);
			}
		}
		
		// Process row
		if(data.data && data.data.length > 0) {
			for(var i = 0; i < data.data.length; i++) {
				var r = data.data[i];
				var row = [];
				row.push(r[0]);
				for(var j = 1; j < r.length; j++) {
					row.push(r[j]);
					row.push(r[j]);
				}
				$this.setRow(i, row);
			}			
			$this.draw();
		}
	}
	
	//TODO: init data here
	this.init();
	this.drawTable();
	
	//. How to know data is updated
}

//jQuery
jQuery.noConflict();
google.setOnLoadCallback(function() {
	googleChart = new google.visualization.ComboChart(document.getElementById('chart_div'));
	jQuery(document).ready(function($) {
		window.chart = new Chart();
		var index = 1;
		$('#btn_add_column').on('click', function() {
			chart.addColumn({title: 'Cột ' + index++});
		});
		$('#btn_add_row').on('click', function() {
			chart.addRow();
		});
		
		$('#btn_draw_chart').on('click', function() {
			chart.draw();
			return false;
		});
		
		$('#list_template_menu').on('click', 'a', function() {
			var $this = $(this);
			window.location.href += $this.attr('href');
			window.location.reload();
		});
		
		var listFile = [];
		var $ul = $('#list_template_menu');
		$.get('https://api.github.com/gists/b346dd60a98a3c686c80', function(response){
			var files = response.files;
			for(var filename in files) {
				var file = files[filename];
				//. Add more link
				var ele = '<li><a href="';
				ele += "#gists=" + file.raw_url;
				ele += '">';
				ele += filename;
				ele += "</a></li>"
				$ul.append(ele);
			}
		})
		
		var hash = window.location.hash;
		if(hash && hash != '') {
			hash = hash.substring(1, hash.length);
			if(hash.indexOf('gists=') != -1) {
				//TODO:
				var gitURL = hash.substring(6, hash.length);
				//. Use ajax to load data
				$.get(gitURL, function(response){
					var obj;
					eval('obj = {' + response + '}');
					window.chart.loadData(obj);
				});
			} else {
				var jsFile = 'data/' + hash + ".js";
				//. load js dynamic
				var fileref=document.createElement('script')
				fileref.setAttribute("type","text/javascript")
				fileref.setAttribute("src", jsFile);
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		}
	});
});