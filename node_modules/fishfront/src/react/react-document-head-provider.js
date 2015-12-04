import React from 'react';
import Env from '../runtime/env';

var Provider = React.createClass({
	childContextTypes:{
        documentHead: React.PropTypes.object
    },
	getChildContext(){
		return {
			documentHead:this.props.documentHead
		}
	},
	render(){
		return this.props.children;
	}
});

class DocumentHead{
	constructor(){
		this.header = {
			title:'',
			base:null,
			meta:[],
			link:[],
			script:[],
		};
	}
	setHeader(header){
		if( header.title ){
			this.header.title = header.title;
		}
		if( header.base ){
			this.header.base = header.base;
		}
		if( header.meta ){
			this.header.meta = this.header.meta.concat(header.meta);
		}
		if( header.link ){
			this.header.link = this.header.link.concat(header.link);
		}
		if( header.script ){
			this.header.script = this.header.script.concat(header.script);
		}
	}
	_renderObject(target){
		var result = [];
		for( var i in target ){
			result.push(i+'="'+target[i]+'"');
		}
		return result.join(" ");
	}
	_renderArray(target,tag){
		var meta = [];
		for( var i in target ){
			var singleMeta = '<'+tag+' '+this._renderObject(target[i])+'></'+tag+'>';
			meta.push(singleMeta);
		}
		return meta.join("\n");
	}
	renderTitleString(){
		var title = '';
		if( this.header.title ){
			title = this.header.title;
		}

		return '<title>'+title+'</title>';
	}
	renderBaseString(){
		var base = '';
		if( this.header.base ){
			base = '<base '+this._renderObject(this.header.base)+'/>';
		}
		return base;
	}
	renderMetaString(){
		return this._renderArray(this.header.meta,'meta');
	}
	renderLinkString(){
		return this._renderArray(this.header.link,'link');
	}
	renderScriptString(){
		return this._renderArray(this.header.script,'script');
	}
}

export default {
	Provider:Provider,
	DocumentHead:DocumentHead,
}