import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
var CellMeasurer = function (_PureComponent) {
  _inherits(CellMeasurer, _PureComponent);

  function CellMeasurer(props, context) {
    _classCallCheck(this, CellMeasurer);

    var _this = _possibleConstructorReturn(this, (CellMeasurer.__proto__ || _Object$getPrototypeOf(CellMeasurer)).call(this, props, context));

    _this._measure = _this._measure.bind(_this);
    return _this;
  }

  _createClass(CellMeasurer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._maybeMeasureCell();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this._maybeMeasureCell();
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;


      return typeof children === 'function' ? children({ measure: this._measure }) : children;
    }
  }, {
    key: '_maybeMeasureCell',
    value: function _maybeMeasureCell() {
      var _props = this.props,
          cache = _props.cache,
          _props$columnIndex = _props.columnIndex,
          columnIndex = _props$columnIndex === undefined ? 0 : _props$columnIndex,
          parent = _props.parent,
          _props$rowIndex = _props.rowIndex,
          rowIndex = _props$rowIndex === undefined ? this.props.index : _props$rowIndex;


      if (!cache.has(rowIndex, columnIndex)) {
        var node = findDOMNode(this);

        // TODO Check for a bad combination of fixedWidth and missing numeric width or vice versa with height

        // Even if we are measuring initially- if we're inside of a MultiGrid component,
        // Explicitly clear width/height before measuring to avoid being tainted by another Grid.
        // eg top/left Grid renders before bottom/right Grid
        // Since the CellMeasurerCache is shared between them this taints derived cell size values.
        if (!cache.hasFixedWidth()) {
          node.style.width = 'auto';
        }
        if (!cache.hasFixedHeight()) {
          node.style.height = 'auto';
        }

        var height = Math.ceil(node.offsetHeight);
        var width = Math.ceil(node.offsetWidth);

        cache.set(rowIndex, columnIndex, width, height);

        // If size has changed, let Grid know to re-render.
        if (parent && typeof parent.invalidateCellSizeAfterRender === 'function') {
          parent.invalidateCellSizeAfterRender({
            columnIndex: columnIndex,
            rowIndex: rowIndex
          });
        }
      }
    }
  }, {
    key: '_measure',
    value: function _measure() {
      var _props2 = this.props,
          cache = _props2.cache,
          _props2$columnIndex = _props2.columnIndex,
          columnIndex = _props2$columnIndex === undefined ? 0 : _props2$columnIndex,
          parent = _props2.parent,
          _props2$rowIndex = _props2.rowIndex,
          rowIndex = _props2$rowIndex === undefined ? this.props.index : _props2$rowIndex;


      var node = findDOMNode(this);

      // If we are re-measuring a cell that has already been measured,
      // It will have a hard-coded width/height from the previous measurement.
      // The fact that we are measuring indicates this measurement is probably stale,
      // So explicitly clear it out (eg set to "auto") so we can recalculate.
      // See issue #593 for more info.
      if (!cache.hasFixedWidth()) {
        node.style.width = 'auto';
      }
      if (!cache.hasFixedHeight()) {
        node.style.height = 'auto';
      }

      var height = Math.ceil(node.offsetHeight);
      var width = Math.ceil(node.offsetWidth);

      if (height !== cache.getHeight(rowIndex, columnIndex) || width !== cache.getWidth(rowIndex, columnIndex)) {
        cache.set(rowIndex, columnIndex, width, height);

        if (parent && typeof parent.recomputeGridSize === 'function') {
          parent.recomputeGridSize({
            columnIndex: columnIndex,
            rowIndex: rowIndex
          });
        }
      }
    }
  }]);

  return CellMeasurer;
}(PureComponent);

// Used for DEV mode warning check


export default CellMeasurer;
if (process.env.NODE_ENV !== 'production') {
  CellMeasurer.__internalCellMeasurerFlag = true;
}