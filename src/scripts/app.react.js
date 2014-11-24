var React = require('react');
var data  = require('./data.full.js');
var options = {
  rowHeight: 40
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
        <table>

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
    }

    return createTable(this.props.data);
  }
});

React.render(<ReactDataTable data={data} options={options} />, document.getElementById('app'));
