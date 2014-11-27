var React = require('react');
var data  = require('./data.full.js');

var ReactDataTable = React.createClass({
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
    return <td key={key}>{value}</td>;
  },
  createRow: function createRow (row) {
    return (
      <tr key={row[this.props.options.rowIdProperty]}>{
        Object.keys(row).map(function(key) {
          return this.createCell(key, row[key]);
        }.bind(this))
      }</tr>
    );
  },
  createHeaderCell: function createHeaderCell (key) {
    return <th key={key}>{key}</th>;
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
    var tableElement              = this.getDOMNode();
    var scrollOffsetFromTableTop  = -tableElement.getBoundingClientRect().top;
    var viewportHeight            = window.innerHeight;
    var numRows                   = this.props.data.length;
    var renderTop                 = Math.max(scrollOffsetFromTableTop - viewportHeight, 0);
    var rowRenderOffset           = Math.floor(renderTop / this.props.options.rowHeight);
    var maxRowsToRender           = Math.ceil(viewportHeight * 3 / this.props.options.rowHeight);
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
      return <div style={{height: this.state.tableHeight}} />
    }

    var table                 = this.filterRowsToBeRendered(this.props.data);
    var offsetForRenderedRows = this.state.rowsToDisplay.toHideAbove * this.props.options.rowHeight;

    // var tableStyle = {
    //   transform: 'translate(0, ' + offsetForRenderedRows + 'px)',
    //   OTransform: 'translate(0, ' + offsetForRenderedRows + 'px)',
    //   msTransform: 'translate(0, ' + offsetForRenderedRows + 'px)',
    //   MozTransform: 'translate(0, ' + offsetForRenderedRows + 'px)',
    //   WebkitTransform: 'translate(0, ' + offsetForRenderedRows + 'px)'
    // };

    var tableStyle = {
      position: 'relative',
      top: offsetForRenderedRows
    }

    return (
      <div style={{height: this.state.tableHeight}}>
        <table ref="table" style={tableStyle}>
          <thead>{
            Object.keys(table[0]).map(this.createHeaderCell)
          }</thead>
          <tbody>
            {table.map(this.createRow)}
          </tbody>
        </table>
      </div>
    );
  }
});

React.render(<ReactDataTable data={data} />, document.getElementById('app'));
