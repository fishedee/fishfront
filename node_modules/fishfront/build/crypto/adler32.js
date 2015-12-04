'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (input) {
	var result = _adler2.default.str(input);
	return parseInt(result, 10).toString(16);
};

var _adler = require('adler-32');

var _adler2 = _interopRequireDefault(_adler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }