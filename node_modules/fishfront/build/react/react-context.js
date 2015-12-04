'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _env = require('../runtime/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
	displayName: 'react-context',

	contextTypes: {
		documentHead: _react2.default.PropTypes.object.option
	},
	componentDidMount: function componentDidMount() {
		if (_env2.default.isInBrowser()) {
			this.updateTitle(this.props.title);
		} else {
			this.updateContext(this.props);
		}
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (_env2.default.isInBrowser()) {
			this.updateTitle(nextProps.title);
		} else {
			this.updateContext(nextProps);
		}
	},
	updateTitle: function updateTitle(title) {
		if (!title) return;
		document.title = title;
	},
	updateContext: function updateContext(nextProps) {
		this.context.documentHead.setHeader(nextProps);
	},
	render: function render() {
		return null;
	}
});