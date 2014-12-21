window.chart.loadData({
	////////////////////////////////////
	//// Sửa từ đây
	///////////////////////////////////
	
	config: {
		title: "Sửa tên biểu đồ ở đây",
		width: 900, // Độ rộng biểu đồ
		height: 400, // Chiều cao biểu đồ
		groupWidth: 0, // Dộ rộng cột của biểu đồ
		isStacked: false,
		isVertical: false,
	},
	columns: ['Cột 1', 'Cột 2', 'Cột 3'],
	//Dữ liệu biểu đồ ở đây
	data: [
		['2014', 10, 12, 2],
		['2013', 9, 17, 8],
		['2017', 11, 20, 9]
	],
	
	//. Có thể bỏ qua phần này
	columnConfigs: {
		1: {
			type: 'bar',
			isShowLabel: true,
			color: '#00FFEE',
			axis: 1,
		}
	}
	
	/////////////////////////////////////////////////////
});