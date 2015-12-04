'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.IndexRoute = exports.Route = exports.Router = exports.Mvc = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactRouter = require('react-router');

var _createBrowserHistory = require('history/lib/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createHashHistory = require('history/lib/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _reactStyle = require('./react-style');

var _reactStyle2 = _interopRequireDefault(_reactStyle);

var _controller = require('./react-mvc/controller');

var _controller2 = _interopRequireDefault(_controller);

var _model = require('./react-mvc/model');

var _model2 = _interopRequireDefault(_model);

var _view = require('./react-mvc/view');

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mvc = (function () {
	function Mvc() {
		_classCallCheck(this, Mvc);

		this.route = null;
		this.history = 'browser';
	}

	_createClass(Mvc, [{
		key: 'setRoute',
		value: function setRoute(route) {
			this.route = route;
		}
	}, {
		key: 'setHistory',
		value: function setHistory(history) {
			this.history = history;
		}
	}, {
		key: 'renderInner',
		value: function renderInner() {
			var ModelProvider = _model2.default.Provider;

			//初始化model
			var model = new _model2.default.Store();
			model.deserialize(window.__INIT_STATE__);

			//创建history
			if (this.history == 'hash') var history = (0, _createHashHistory2.default)();else var history = (0, _createBrowserHistory2.default)();

			//渲染
			_reactDom2.default.render(_react2.default.createElement(
				ModelProvider,
				{ model: model },
				_react2.default.createElement(
					_reactRouter.Router,
					{ history: history },
					this.route
				)
			), document.getElementById('body'));
		}
	}, {
		key: 'render',
		value: function render(url) {
			var _this = this;

			(0, _reactRouter.match)({ routes: this.route, location: window.location.pathname }, function (error, redirection, renderProps) {
				_this.renderInner();
			});
		}
	}]);

	return Mvc;
})();

exports.Mvc = Mvc;
exports.Router = _reactRouter.Router;
exports.Route = _reactRouter.Route;
exports.IndexRoute = _reactRouter.IndexRoute;