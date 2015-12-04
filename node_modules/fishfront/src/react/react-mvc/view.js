import ImmutableRenderMixin from '../react-immutable-render-mixin';
import Immutable from 'immutable';
import React from 'react';
import Env from '../../runtime/env';

function createClass(proto){
	if( !proto.mixins ){
		proto.mixins = [];
	}
	proto.mixins.push(ImmutableRenderMixin);
	proto.contextTypes = {
        history: React.PropTypes.object.isRequired,
    }
	proto.go = function(url){
		this.context.history.pushState(null,url);
	}
	proto.back = function(){
		this.context.history.goBack();
	}
	proto.replace = function(url){
		this.context.history.replaceState(null,url);
	}
	return React.createClass(proto);
}

var Views = {
	createClass:createClass
};

Env.exportGlobal('Views',Views);
Env.exportGlobal('React',React);
Env.exportGlobal('Immutable',Immutable);
export default Views;