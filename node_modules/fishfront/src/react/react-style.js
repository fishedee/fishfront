import Env from '../runtime/env';
import Adler32 from '../crypto/adler32';

var localStyleSheet = {};
var styleSheetClass = {};
var prefixes = ["-ms-", "-moz-", "-webkit-", "-o-"];
var prefixesProperties = {
	'userSelect':'',
	'transform':'',
	'transition':'',
	'transformOrigin':'',
	'transformStyle':'',
	'transitionProperty':'',
	'transitionDuration':'',
	'transitionTimingFunction':'',
	'transitionDelay':'',
	'borderImage':'',
	'borderImageSlice':'',
	'boxShadow':'',
	'backgroundClip':'',
	'backfaceVisibility':'',
	'perspective':'',
	'perspectiveOrigin':'',
	'animation':'',
	'animationDuration':'',
	'animationName':'',
	'animationDelay':'',
	'animationDirection':'',
	'animationIterationCount':'',
	'animationTimingFunction':'',
	'animationPlayState':'',
	'animationFillMode':'',
	'appearance':'',
	'overflowScrolling':''
}

function transformSingleObjectToCss(value,originKey){
	var result = '';
	var key = originKey.replace(/[A-Z]+/g,function(word){
		return '-'+word.toLowerCase();
	});
	var prefixes = [""];
	if( prefixesProperties.hasOwnProperty(originKey) ){
		prefixes = prefixes.concat(prefixes);
	}
	for( var i in prefixes ){
		for( var j in value ){
			result += prefixes[i] + key + ':' + value[j] + ';';
		}
	}
	return result;
}
function transformObjectToCss(obj,namespace){
	var currentResult = '';
	var childrenResult = '';
	currentResult += namespace+'{';
	for( var i in obj ){
		if( typeof obj[i] == 'object'){
			if( obj[i].constructor != Array ){
				childrenResult += transformObjectToCss(obj[i],namespace+i);
			}else{
				currentResult += transformSingleObjectToCss(obj[i],i);
			}
		}else{
			currentResult += transformSingleObjectToCss([obj[i]],i);
		}	
	}
	currentResult += '}';
	return currentResult+childrenResult;
}
function addCssToHead(str_css){
	try { 
		//IE下可行
		var style = document.createStyleSheet();
		style.cssText = str_css;
	}catch (e) { 
		//Firefox,Opera,Safari,Chrome下可行
		var style = document.createElement("style");
		style.type = "text/css";
		style.textContent = str_css;
		document.getElementsByTagName("HEAD").item(0).appendChild(style);
	}
}
function addCssToLocal(str_css,classNames){
	var result = {
		classNames:classNames,
		str_css:str_css
	};
	for( var i in classNames ){
		var singleClassName = classNames[i];
		localStyleSheet[singleClassName] = result;
	}
}
function addCss(styles){
	var str_css = '';
	var classNames = [];
	for( var i in styles ){
		var singleStyle = styles[i];
		if( !singleStyle.style )
			continue;
		str_css += singleStyle.style;
		classNames.push(singleStyle.className);
	}
	if( str_css == '' )
		return;
	if( Env.isInBrowser() ){
		addCssToHead(str_css);
	}else{
		addCssToLocal(str_css,classNames);
	}
}
function initStyle(){
	var styleTag = document.getElementsByTagName('style');
	if( !styleTag )
		return;
	for( var i = 0 ; i != styleTag.length ; ++i ){
		var singleStyleTag = styleTag[i];
		var allClass = singleStyleTag.getAttribute('class');
		if( !allClass ){
			continue;
		}
		allClass = allClass.split(" ");
		for( var j in allClass ){
			var singleClass = allClass[j].trim();
			if( singleClass == "" )
				continue;
			styleSheetClass[singleClass.substr(1)] = true;
		}
	}
}
function transformObjectToClass(obj){
	var stylesheetcode = 's' + Adler32(JSON.stringify(obj));
	if( styleSheetClass.hasOwnProperty(stylesheetcode) == false  ){
		//没有这个css
		var targetStyle = transformObjectToCss(obj,'.'+stylesheetcode);
		styleSheetClass[stylesheetcode] = true;
		return {
			className:stylesheetcode,
			style:targetStyle,
		};
	}else{
		//已有这个css
		return {
			className:stylesheetcode
		};
	}
}
function transformClassToString(classNames){
	var styleString = '';
	while( classNames.size != 0 ){
		for( var singleClassName of classNames ){
			if( !styleSheetClass.hasOwnProperty(singleClassName) ){
				classNames.delete(singleClassName);
			}else{
				var singleStyleString = localStyleSheet[singleClassName];
				var str_css = singleStyleString.str_css;
				var oldClassNames = singleStyleString.classNames;
				var newClassNames = "";
				for( var i in oldClassNames ){
					classNames.delete(oldClassNames[i]);
					newClassNames += ' t'+oldClassNames[i];
				}
				styleString += '<style class="'+newClassNames+'">'+str_css+'</style>';
				break;
			}
		}
	}
	return styleString;
}
function getAllClassNameFromHtml(html){
	var allClassName = new Set();
	var pattern = new RegExp('class="([^"]+)"',"g");
	var result = null;
	while( result = pattern.exec(html) ){
		var classNames = result[1].split(" ");
		for( var i in classNames ){
			var singleClassName = classNames[i].trim();
			if( singleClassName == "" )
				continue;
			allClassName.add(singleClassName);
		}
	};
	return allClassName;
}
function extendDeep(leftObj,rightObj){
	for( var i in rightObj ){
		if( leftObj.hasOwnProperty(i) ){
			if( typeof leftObj[i] == 'object' && typeof rightObj[i] == 'object')
				leftObj[i] = extendDeep(leftObj[i],rightObj[i]);
			else
				leftObj[i] = rightObj[i];
		}else{
			leftObj[i] = rightObj[i];
		}
	}
	return leftObj;
}
var StyleSheet = {
	create:function(){
		var obj = {};
		for( var i = 0 ; i != arguments.length ; ++i ){
			obj = extendDeep(obj,arguments[i]);
		}
		var result = {};
		var resultStyle = [];
		for( var i in obj ){
			var single = transformObjectToClass(obj[i]);
			result[i] = single.className;
			resultStyle.push(single);
		}
		addCss(resultStyle);
		return result;
	},
	renderToString:function(html){
		var classNames = getAllClassNameFromHtml(html);
		var renderString = transformClassToString(classNames);
		return renderString;
	}
};
if( Env.isInBrowser() ){
	initStyle();
}
export default StyleSheet;
Env.exportGlobal('StyleSheet',StyleSheet);
