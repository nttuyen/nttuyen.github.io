var TableWrapper = function(dataTable, configTable) {
    this.dataTableID = dataTable;
    this.configTableID = configTable;
    this.onDataChange = false;
    this.dataTable = false;
    this.data = [
        ["Is Label column"],
        ["Show label"],
        ["Colors"],
        ["Axis"],
        ["Chart type"],
        ["Column name"]
    ];
    this.config = [
        ["Chart type"],
        ["title"],
        ["Width"],
        ["Height"],
        ["Group width"]
    ];
    
    var headerRenderer = function (instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.backgroundColor = '#ffc7ce'; //'#c6efce';
      td.style.color = '#9c0006'; //'#006100';
      td.style.fontWeight = 'bold';
    };
    
    this.init = function() {
        var $this = this;
        var dataTabelContainer = document.getElementById($this.dataTableID);
        this.dataTable = new Handsontable(dataTabelContainer, {
          data: $this.data,
          startRows: 5,
          startCols: 5,
          rowHeaders: true,
          colHeaders: true,
          minSpareCols: 1,
          minSpareRows: 1,
          contextMenu: true,
          manualColumnResize: true,
          observeChanges: true,
          cells: function (row, col, prop) {
            var cellProperties = {}
            if(row <= 5 && col === 0) {
              cellProperties.readOnly = true;
            }
            if(row == 5 && col > 0) {
                this.renderer = headerRenderer;
            }
            return cellProperties;
          },
          afterChange: function(changes, source) {
            if(source == 'loadData') {
                return;
            }
            if($this.onDataChange && jQuery.isFunction($this.onDataChange)) {
                $this.onDataChange(changes, source);
            }
          }
        });
    }
    this.setData = function(d) {
        this.data = d;
        if(this.dataTable) {
            this.dataTable.loadData(this.data);
            //this.data = this.dataTable.getData();
        }
    }
    this.getData = function() {
        return JSON.parse(JSON.stringify(this.data));
    }
    this.setOnDataChange = function(func) {
        this.onDataChange = func;
    }
}
