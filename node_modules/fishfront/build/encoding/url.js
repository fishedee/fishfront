'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
function splitInfo(str) {
	var search = str.split('&');
	var result = [];
	for (var i = 0; i != search.length; ++i) {
		if (search[i] == '') continue;

		var index = search[i].split('=');
		if (index.length != 2) {
			result[search[i]] = null;
		} else {
			result[index[0]] = decodeURIComponent(index[1]);
		}
	}
	return result;
}
function splitPathInfo(str) {
	var search = str.split('/');
	var result = [];
	for (var i = 0; i != search.length; ++i) {
		if (search[i] == '') continue;

		result.push(search[i]);
	}
	return result;
}
function combileInfo(array) {
	var result = [];
	for (var i in array) {
		if (array[i] == null) result.push(array[i]);else result.push(i + '=' + encodeURIComponent(array[i]));
	}
	return result.join('&');
}
function combinePathInfo(array) {
	return array.join('/');
}
exports.default = {
	buildQueryUrl: function buildQueryUrl(url, urlArgv) {
		for (var i in urlArgv) {
			if (url.indexOf('?') == -1) url += '?';else url += '&';
			url += i + '=' + encodeURIComponent(urlArgv[i]);
		}
		return encodeURI(url);
	},
	toInfo: function toInfo(url) {
		if (typeof url != 'string') {
			console.error('$.url.toInfo not string!!');
			console.error(url);
			return {
				protocol: '',
				hostname: '',
				port: '',
				pathname: [],
				originpathname: '/',
				search: {},
				originsearch: '',
				hash: {},
				originhash: ''
			};
		}
		//正则提取
		url = decodeURI(url);
		var regex = /^(?:([a-zA-Z]+):\/\/)?([^?#\/:]*)?(?::([0-9]+))?(?:(\/[^?#]*))?(\?[^#]*)?(#.*)?$/;
		var regexInfo = regex.exec(url);

		if (!regexInfo) {
			return {
				protocol: '',
				hostname: '',
				port: '',
				pathname: [],
				originpathname: '/',
				search: {},
				originsearch: '',
				hash: {},
				originhash: ''
			};
		}

		//分析各部分数据
		var info = {
			protocol: regexInfo[1],
			hostname: regexInfo[2],
			port: regexInfo[3],
			pathname: regexInfo[4],
			search: regexInfo[5],
			hash: regexInfo[6]
		};

		if (!info.protocol) {
			info.protocol = '';
		}

		if (!info.hostname) {
			info.hostname = '';
		}

		if (!info.port) {
			info.port = '';
		}

		if (info.pathname) {
			info.pathname = splitPathInfo(info.pathname);
			info.originpathname = '/' + combinePathInfo(info.pathname);
		} else {
			info.pathname = [];
			info.originpathname = '/';
		}

		if (info.search) {
			info.search = splitInfo(info.search.substr(1));
			info.originsearch = '?' + combileInfo(info.search);
		} else {
			info.search = {};
			info.originsearch = '';
		}

		if (info.hash) {
			info.hash = splitInfo(info.hash.substr(1));
			info.originhash = '#' + combileInfo(info.hash);
		} else {
			info.hash = {};
			info.originhash = '';
		}
		return info;
	},
	fromInfo: function fromInfo(info) {
		var url = '';

		if (info.protocol && info.hostname) {
			url += info.protocol + '://' + info.hostname;
		}

		if (info.port) {
			url += ':' + info.port;
		}

		if (info.pathname.length != 0) {
			url += '/' + combinePathInfo(info.pathname);
		}

		if (info.search) {
			url += '?' + combileInfo(info.search);
		}

		if (info.hash) {
			url += '#' + combileInfo(info.hash);
		}
		return url;
	}
};