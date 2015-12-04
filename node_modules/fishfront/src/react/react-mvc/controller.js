import Env from '../../runtime/env';
import Model from './model';

function createClass(proto){
	proto.getInitialState = function(){
		if( this.initialize ){
			this.initialize();
		}
		if( this.context.serverHandler ){
			this.context.serverHandler.push({
				onServerCreate:this.onServerCreate,
				onServerDestroy:this.onServerDestroy,
			});
		}
		return {};
	}
	proto.loadModel = function(modelClass){
		var modelInstanse = this.context.model.create(modelClass);
		this[modelInstanse.name] = modelInstanse;
	}
	proto.loadView = function(viewClass){
		this.__viewClass = viewClass;
	}
	proto.getLocation = function(index){
		var location = this.props.location;
		return location.pathname + location.search;
	}
	proto.componentDidMount = function(){
		if( this.onCreate )
			this.onCreate();
	}
	proto.componentWillUnmount = function(){
		if( this.onDestroy )
			this.onDestroy();
	}
	proto.renderProps = proto.render;
	proto.render = function(){
		var ViewClass = this.__viewClass;
		var data = this.renderProps();
		data.children = this.props.children;
		return (<ViewClass {...data}/>);
	}
	proto.contextTypes = {
        model: React.PropTypes.object.isRequired,
        serverHandler: React.PropTypes.array,
    }
	return React.createClass(proto);
}

var Controllers = {
	createClass:createClass
};

Env.exportGlobal('Controllers',Controllers);
export default Controllers;