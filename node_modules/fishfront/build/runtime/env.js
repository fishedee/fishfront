'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	isInBrowser: function isInBrowser() {
		return typeof window != 'undefined' && typeof window.location != 'undefined';
	},
	isInNode: function isInNode() {
		return !this.isInBrowser();
	},
	exportGlobal: function exportGlobal(name, value) {
		if (typeof window != 'undefined') window[name] = value;else global[name] = value;
	}
};