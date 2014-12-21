window.chart.loadData({
	////////////////////////////////////
	//// Sửa từ đây
	///////////////////////////////////
	
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
	
	/////////////////////////////////////////////////////
});
