var React = require('react');
var data  = require('./data.full.js');
var options = {
  rowHeight: 76
};

var ReactDataTable = React.createClass({
  getInitialState: function() {
    return {
      rowsToDisplay: {
        toHideAbove: 0,
        toRender: 0,
        toHideBelow: 0
      }
    };
  },
  render: function() {
    var createCell = function createCell (key, value) {
      return <td key={key}>{value}</td>;
    };

    var createRow = function createRow (row) {
      return (
        <tr key={row._id}>{
          Object.keys(row).map( function(key) {
            return createCell(key, row[key]);
          })
        }</tr>
      );
    };

    var createHeaderCell = function createHeaderCell (key) {
      return <th key={key}>{key}</th>;
    };

    var createTable = function createTable (table) {
      return (
        <table ref="table">

          <thead>{
            Object.keys(table[0]).map(function (key) {
              return createHeaderCell(key);
            })
          }</thead>
          <tbody>
            {table.map(createRow)}
          </tbody>
        </table>
      );
    }.bind(this);

    return createTable(this.props.data);
  },
  decideRowsToDisplay: function () {
    var scrollTop = window.pageYOffset;
    var viewportHeight = window.innerHeight;
    var numRows = this.props.data.length;
    // TODO: don't assume that the component is the only element in the page
    var renderTop = Math.max(scrollTop - viewportHeight, 0);
    var rowRenderOffset = Math.floor(renderTop / this.props.options.rowHeight);
    var maxRowsToRender = Math.ceil(viewportHeight * 3 / this.props.options.rowHeight);
    var numRowsToRender = Math.min(numRows - rowRenderOffset, maxRowsToRender);

    this.setState({
      rowsToDisplay: {
        toHideAbove: rowRenderOffset,
        toRender: numRowsToRender,
        toHideBelow: numRows - numRowsToRender - rowRenderOffset
      }
    })
  }
});

React.render(<ReactDataTable data={data} options={options} />, document.getElementById('app'));
