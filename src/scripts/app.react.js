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

    var createTable = function createTable (origTable) {
      if (this.isMounted()) {
        var table = origTable.slice(this.state.rowsToDisplay.toHideAbove);
        if (this.state.rowsToDisplay.toHideBelow) {
          table = table.slice(0,-this.state.rowsToDisplay.toHideBelow);
        }
        var paddingTop = this.state.rowsToDisplay.toHideAbove * this.props.options.rowHeight;
        var paddingBottom = this.state.rowsToDisplay.toHideBelow * this.props.options.rowHeight;
        var tableElement = this.refs.table.getDOMNode();
        tableElement.style.paddingTop = paddingTop +'px';
        tableElement.style.paddingBottom = paddingBottom +'px'
      } else {
        var table = origTable.map(function () {
          return {}
        });
      }
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
  },
  componentDidMount: function(elem) {
    this.decideRowsToDisplay();
    window.addEventListener('scroll', function() {
      // TODO: add rate limit
      this.decideRowsToDisplay();
    }.bind(this));
  },
  componentDidUnmount: function(elem) {
    window.removeEventListener('scroll');
  }
});

React.render(<ReactDataTable data={data} options={options} />, document.getElementById('app'));
