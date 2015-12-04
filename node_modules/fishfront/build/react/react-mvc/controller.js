'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _env = require('../../runtime/env');

var _env2 = _interopRequireDefault(_env);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createClass(proto) {
	proto.getInitialState = function () {
		if (this.initialize) {
			this.initialize();
		}
		if (this.context.serverHandler) {
			this.context.serverHandler.push({
				onServerCreate: this.onServerCreate,
				onServerDestroy: this.onServerDestroy
			});
		}
		return {};
	};
	proto.loadModel = function (modelClass) {
		var modelInstanse = this.context.model.create(modelClass);
		this[modelInstanse.name] = modelInstanse;
	};
	proto.loadView = function (viewClass) {
		this.__viewClass = viewClass;
	};
	proto.getLocation = function (index) {
		var location = this.props.location;
		return location.pathname + location.search;
	};
	proto.componentDidMount = function () {
		if (this.onCreate) this.onCreate();
	};
	proto.componentWillUnmount = function () {
		if (this.onDestroy) this.onDestroy();
	};
	proto.renderProps = proto.render;
	proto.render = function () {
		var ViewClass = this.__viewClass;
		var data = this.renderProps();
		data.children = this.props.children;
		return React.createElement(ViewClass, data);
	};
	proto.contextTypes = {
		model: React.PropTypes.object.isRequired,
		serverHandler: React.PropTypes.array
	};
	return React.createClass(proto);
}

var Controllers = {
	createClass: createClass
};

_env2.default.exportGlobal('Controllers', Controllers);
exports.default = Controllers;