import Env from '../../runtime/env';
import Immutable from 'immutable';
import React from 'react';

function createClass(proto){
	if( proto.mixins ){
		for( var singleMixin of proto.mixins ){
			for( var methodName in singleMixin ){
				var methodResult = singleMixin[methodName];
				if( proto.hasOwnProperty(methodName))
					continue;
				proto[methodName] = methodResult;
			}
		}
	}
	proto.on = function(singleListener){
		this.__listener.add(singleListener);
	}
	proto.off = function(singleListener){
		this.__listener.devare(singleListener);
	}
	proto.getServerRequest = function(){
		return this.__serverRequest;
	}
	proto.setServerRequest = function(serverRequest){
		this.__serverRequest = serverRequest;
	}
	function StoreClass(){
		this.__serverRequest = null;
		this.__state = null;
		this.__listener = new Set();
		this.__defineSetter__('state',(state)=>{
			this.__state = state;
			if( this.__listener.size == 0 )
				return;
			for( var singleListener of this.__listener ){
				singleListener();
			}
		});
		this.__defineGetter__('state',()=>{
			return this.__state;
		});
		for( var methodName in this ){
			var methodResult = this[methodName];
			if( typeof methodResult != 'function' )
				continue;
			if( methodName.substr(0,1) == '_')
				continue;
			this[methodName] = methodResult.bind(this);
		}
		if( this.initialize ){
			this.initialize();
		}
	}
	StoreClass.prototype = proto;
	return StoreClass;
}

function Store(){
	this.initData = {};
	this.models = {};
	this.serverRequest = null;
	this.listener = null;
	this.create = function(modelClass){
		var name = modelClass.prototype.name;
		if( this.models.hasOwnProperty(name) ){
			return this.models[name];
		}
		var newModel = new modelClass();
		newModel.setServerRequest( this.getServerRequest() );
		if( this.initData.hasOwnProperty(name) ){
			var state = this.initData[name];
			if( typeof state == 'object'){
				state = Immutable.fromJS(state);
			}
			newModel.state = state;
		}
		if( this.listener != null )
			newModel.on(this.listener);
		this.models[name] = newModel;
		return newModel;
	}
	this.setServerRequest = function(serverRequest){
		this.serverRequest = serverRequest;
	}
	this.getServerRequest = function(){
		return this.serverRequest;
	}
	this.serialize = function(){
		var modelSerialize = {};
		for( var i in this.models ){
			var state = this.models[i].state;
			if( typeof state == 'object'){
				state = state.toJS();
			}
			modelSerialize[i] = state;
		}
		return JSON.stringify(modelSerialize);
	}
	this.deserialize = function(data){
		this.initData = data;
	}
	this.on = function(listener){
		this.listener = listener;
	}
	this.off = function(listener){
		this.listener = null;
	}
}

var ModelProvider = React.createClass({
	childContextTypes:{
        model: React.PropTypes.object.isRequired,
        serverHandler: React.PropTypes.array
    },
	getChildContext(){
		return {
			model:this.props.model,
			serverHandler:this.props.serverHandler
		}
	},
	whenModelChange(){
		this.setState({});
	},
	getInitialState(){
		if( Env.isInBrowser() ){
			this.props.model.on(this.whenModelChange);
		}
		return {}
	},
	componentWillUnmount(){
	},
	render(){
		return this.props.children;
	}
});

var Models = {
	createClass:createClass,
	Store:Store,
	Provider:ModelProvider,
};

Env.exportGlobal('Models',Models);
export default Models;