window.chart.loadData({
  config: {
    title: "Biểu đồ nhập khẩu ô tô từ 2009-2014",
    width: 900, // Độ rộng biểu đồ
    height: 400, // Chiều cao biểu đồ
    groupWidth: 0, // Dộ rộng cột của biểu đồ
    isStacked: false
  },
  columns: ['Chiếc', 'Giá trị (triệu USD)'],
  data: [
    ['2009', 76300, 1170],
    ['2010', 53100, 960],
    ['2011', 55000, 1020],
    ['2012', 27000, 605],
    ['2013', 35213, 726],
    ['2014', 72000, 157],
  ],
  columnConfigs: {
  }
});
