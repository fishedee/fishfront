'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _env = require('../../runtime/env');

var _env2 = _interopRequireDefault(_env);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function createClass(proto) {
	if (proto.mixins) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = proto.mixins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var singleMixin = _step.value;

				for (var methodName in singleMixin) {
					var methodResult = singleMixin[methodName];
					if (proto.hasOwnProperty(methodName)) continue;
					proto[methodName] = methodResult;
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}
	proto.on = function (singleListener) {
		this.__listener.add(singleListener);
	};
	proto.off = function (singleListener) {
		this.__listener.devare(singleListener);
	};
	proto.getServerRequest = function () {
		return this.__serverRequest;
	};
	proto.setServerRequest = function (serverRequest) {
		this.__serverRequest = serverRequest;
	};
	function StoreClass() {
		var _this = this;

		this.__serverRequest = null;
		this.__state = null;
		this.__listener = new Set();
		this.__defineSetter__('state', function (state) {
			_this.__state = state;
			if (_this.__listener.size == 0) return;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = _this.__listener[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var singleListener = _step2.value;

					singleListener();
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		});
		this.__defineGetter__('state', function () {
			return _this.__state;
		});
		for (var methodName in this) {
			var methodResult = this[methodName];
			if (typeof methodResult != 'function') continue;
			if (methodName.substr(0, 1) == '_') continue;
			this[methodName] = methodResult.bind(this);
		}
		if (this.initialize) {
			this.initialize();
		}
	}
	StoreClass.prototype = proto;
	return StoreClass;
}

function Store() {
	this.initData = {};
	this.models = {};
	this.serverRequest = null;
	this.listener = null;
	this.create = function (modelClass) {
		var name = modelClass.prototype.name;
		if (this.models.hasOwnProperty(name)) {
			return this.models[name];
		}
		var newModel = new modelClass();
		newModel.setServerRequest(this.getServerRequest());
		if (this.initData.hasOwnProperty(name)) {
			var state = this.initData[name];
			if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) == 'object') {
				state = _immutable2.default.fromJS(state);
			}
			newModel.state = state;
		}
		if (this.listener != null) newModel.on(this.listener);
		this.models[name] = newModel;
		return newModel;
	};
	this.setServerRequest = function (serverRequest) {
		this.serverRequest = serverRequest;
	};
	this.getServerRequest = function () {
		return this.serverRequest;
	};
	this.serialize = function () {
		var modelSerialize = {};
		for (var i in this.models) {
			var state = this.models[i].state;
			if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) == 'object') {
				state = state.toJS();
			}
			modelSerialize[i] = state;
		}
		return JSON.stringify(modelSerialize);
	};
	this.deserialize = function (data) {
		this.initData = data;
	};
	this.on = function (listener) {
		this.listener = listener;
	};
	this.off = function (listener) {
		this.listener = null;
	};
}

var ModelProvider = _react2.default.createClass({
	displayName: 'ModelProvider',

	childContextTypes: {
		model: _react2.default.PropTypes.object.isRequired,
		serverHandler: _react2.default.PropTypes.array
	},
	getChildContext: function getChildContext() {
		return {
			model: this.props.model,
			serverHandler: this.props.serverHandler
		};
	},
	whenModelChange: function whenModelChange() {
		this.setState({});
	},
	getInitialState: function getInitialState() {
		if (_env2.default.isInBrowser()) {
			this.props.model.on(this.whenModelChange);
		}
		return {};
	},
	componentWillUnmount: function componentWillUnmount() {},
	render: function render() {
		return this.props.children;
	}
});

var Models = {
	createClass: createClass,
	Store: Store,
	Provider: ModelProvider
};

_env2.default.exportGlobal('Models', Models);
exports.default = Models;