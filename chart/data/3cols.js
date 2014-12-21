//////////////////////////////
/// Không sửa ở đây
/////////////////////////////
jQuery.noConflict();
jQuery(document).ready(function($){
	//////////////////////////////////////////////////
	//  SỬA Ở ĐÂY
	/////////////////////////////////////////////////
	var data = {
		config: {
			title: "Biểu đồ về cái gì đó",
			width: 900, // Độ rộng biểu đồ
			height: 400, // Chiều cao biểu đồ
			groupWidth: 0, // Dộ rộng cột của biểu đồ
			isStacked: false
		},
		columns: ['Cột 1', 'Cột 2', 'Cột 3'],
		data: [
			['2014', 10, 12, 2],
			['2013', 9, 17, 8],
			['2017', 11, 20, 9]
		],
		
		columnConfigs: {
			
		}
	};
	
	//////////////////////////////////////////////////////////////////////
	/// Không sửa từ đây xuống ///////
	//////////////////////////////////////////////////////////////////////
	$('#chart_title').val(data.config.title);
	$('#chart_width').val(data.config.width);
	$('#chart_height').val(data.config.height);
	$('#chart_group_width').val(data.config.groupWidth);
	$('#chart_is_stacked').attr('checked', data.config.isStacked);
	
	var chart = window.chart;
	if(!window.chart) {
		return;
	}
	//. Process column
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
		
		chart.setColumn(i, col);
	}
	
	// Process row
	for(var i = 0; i < data.data.length; i++) {
		var r = data.data[i];
		var row = [];
		row.push(r[0]);
		for(var j = 1; j < r.length; j++) {
			row.push(r[j]);
			row.push(r[j]);
		}
		chart.setRow(i, row);
	}
	
	chart.draw();
});

