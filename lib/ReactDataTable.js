var React = require('react/addons');

var ReactDataTable = React.createClass({displayName: 'ReactDataTable',
  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    options: React.PropTypes.shape({
      rowHeight: React.PropTypes.number,
      fixedColumnWidth: React.PropTypes.number,
      viewportVerticalRenderBuffer: React.PropTypes.number,
      rowIdProperty: React.PropTypes.string
    }).isRequired
  },
  getDefaultProps: function() {
    return {
      options: {
        rowHeight: 60,
        viewportVerticalRenderBuffer: 1,
        rowIdProperty: '_id'
      }
    };
  },
  getInitialState: function() {
    return {
      tableHeight: this.calculateTableHeight(),
      rowsToDisplay: {
        toHideAbove: 0,
        toRender: 0,
        toHideBelow: 0
      }
    };
  },
  componentDidMount: function(elem) {
    this.decideRowsToDisplay();
    window.addEventListener('scroll', this.decideRowsToDisplay);
  },
  componentDidUnmount: function(elem) {
    window.removeEventListener('scroll', this.decideRowsToDisplay);
  },
  createCell: function createCell (key, value) {
    return React.createElement("td", {key: key}, value);
  },
  createRow: function createRow (row) {
    return (
      React.createElement("tr", {key: row[this.props.options.rowIdProperty], style: {height: this.props.options.rowHeight}}, 
        Object.keys(row).map(function(key) {
          return this.createCell(key, row[key]);
        }.bind(this))
      )
    );
  },
  createHeaderCell: function createHeaderCell (key) {
    return React.createElement("th", {key: key}, key);
  },
  filterRowsToBeRendered: function filterRowsToBeRendered (table) {
    table = this.props.data.slice(this.state.rowsToDisplay.toHideAbove);

    if (this.state.rowsToDisplay.toHideBelow) {
      table = table.slice(0,-this.state.rowsToDisplay.toHideBelow);
    }
    
    return table;
  },
  calculateTableHeight: function () {
    return this.props.data.length * this.props.options.rowHeight;
  },
  decideRowsToDisplay: function () {
    if (!this.isMounted()) {
      return;
    }
    
    var tableElement              = this.getDOMNode();
    var scrollOffsetFromTableTop  = -tableElement.getBoundingClientRect().top;
    var viewportHeight            = window.innerHeight;
    var numRows                   = this.props.data.length;
    var renderTop                 = Math.max(scrollOffsetFromTableTop - viewportHeight, 0);
    var rowRenderOffset           = Math.floor(renderTop / this.props.options.rowHeight);
    // Repeat buffer at top and bottom (* 2) and add 1 for area within the viewport
    var viewportHeightMultiplier  = (this.props.options.viewportVerticalRenderBuffer * 2) + 1;
    var maxRowsToRender           = Math.ceil(viewportHeight * viewportHeightMultiplier / this.props.options.rowHeight);
    var numRowsToRender           = Math.min(numRows - rowRenderOffset, maxRowsToRender);

    this.setState({
      rowsToDisplay: {
        toHideAbove: rowRenderOffset,
        toRender: numRowsToRender,
        toHideBelow: numRows - numRowsToRender - rowRenderOffset
      }
    })
  },
  render: function() {
    if (!this.isMounted()) {
      return React.createElement("div", {style: {height: this.state.tableHeight}})
    }

    var table                 = this.filterRowsToBeRendered(this.props.data);
    var offsetForRenderedRows = this.state.rowsToDisplay.toHideAbove * this.props.options.rowHeight;

    var tableStyle = {
      position: 'relative',
      top: offsetForRenderedRows
    }

    if(!table.length) {
      table.push({});
    }

    return (
      React.createElement("div", {style: {height: this.state.tableHeight}}, 
        React.createElement("table", {ref: "table", style: tableStyle}, 
          React.createElement("thead", null, 
            Object.keys(table[0]).map(this.createHeaderCell)
          ), 
          React.createElement("tbody", null, 
            table.map(this.createRow)
          )
        )
      )
    );
  }
});

module.exports = ReactDataTable;