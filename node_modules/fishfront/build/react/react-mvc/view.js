'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reactImmutableRenderMixin = require('../react-immutable-render-mixin');

var _reactImmutableRenderMixin2 = _interopRequireDefault(_reactImmutableRenderMixin);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _env = require('../../runtime/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createClass(proto) {
	if (!proto.mixins) {
		proto.mixins = [];
	}
	proto.mixins.push(_reactImmutableRenderMixin2.default);
	proto.contextTypes = {
		history: _react2.default.PropTypes.object.isRequired
	};
	proto.go = function (url) {
		this.context.history.pushState(null, url);
	};
	proto.back = function () {
		this.context.history.goBack();
	};
	proto.replace = function (url) {
		this.context.history.replaceState(null, url);
	};
	return _react2.default.createClass(proto);
}

var Views = {
	createClass: createClass
};

_env2.default.exportGlobal('Views', Views);
_env2.default.exportGlobal('React', _react2.default);
_env2.default.exportGlobal('Immutable', _immutable2.default);
exports.default = Views;