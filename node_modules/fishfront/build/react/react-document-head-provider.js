'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _env = require('../runtime/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = _react2.default.createClass({
	displayName: 'Provider',

	childContextTypes: {
		documentHead: _react2.default.PropTypes.object
	},
	getChildContext: function getChildContext() {
		return {
			documentHead: this.props.documentHead
		};
	},
	render: function render() {
		return this.props.children;
	}
});

var DocumentHead = (function () {
	function DocumentHead() {
		_classCallCheck(this, DocumentHead);

		this.header = {
			title: '',
			base: null,
			meta: [],
			link: [],
			script: []
		};
	}

	_createClass(DocumentHead, [{
		key: 'setHeader',
		value: function setHeader(header) {
			if (header.title) {
				this.header.title = header.title;
			}
			if (header.base) {
				this.header.base = header.base;
			}
			if (header.meta) {
				this.header.meta = this.header.meta.concat(header.meta);
			}
			if (header.link) {
				this.header.link = this.header.link.concat(header.link);
			}
			if (header.script) {
				this.header.script = this.header.script.concat(header.script);
			}
		}
	}, {
		key: '_renderObject',
		value: function _renderObject(target) {
			var result = [];
			for (var i in target) {
				result.push(i + '="' + target[i] + '"');
			}
			return result.join(" ");
		}
	}, {
		key: '_renderArray',
		value: function _renderArray(target, tag) {
			var meta = [];
			for (var i in target) {
				var singleMeta = '<' + tag + ' ' + this._renderObject(target[i]) + '></' + tag + '>';
				meta.push(singleMeta);
			}
			return meta.join("\n");
		}
	}, {
		key: 'renderTitleString',
		value: function renderTitleString() {
			var title = '';
			if (this.header.title) {
				title = this.header.title;
			}

			return '<title>' + title + '</title>';
		}
	}, {
		key: 'renderBaseString',
		value: function renderBaseString() {
			var base = '';
			if (this.header.base) {
				base = '<base ' + this._renderObject(this.header.base) + '/>';
			}
			return base;
		}
	}, {
		key: 'renderMetaString',
		value: function renderMetaString() {
			return this._renderArray(this.header.meta, 'meta');
		}
	}, {
		key: 'renderLinkString',
		value: function renderLinkString() {
			return this._renderArray(this.header.link, 'link');
		}
	}, {
		key: 'renderScriptString',
		value: function renderScriptString() {
			return this._renderArray(this.header.script, 'script');
		}
	}]);

	return DocumentHead;
})();

exports.default = {
	Provider: Provider,
	DocumentHead: DocumentHead
};