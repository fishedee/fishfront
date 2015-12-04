import React from 'react';
import Env from '../runtime/env';

export default React.createClass({
	contextTypes:{
        documentHead:React.PropTypes.object.option,
    },
	componentDidMount(){
		if( Env.isInBrowser() ){
			this.updateTitle(this.props.title);
		}else{
			this.updateContext( this.props );
		}
	},
	componentWillReceiveProps(nextProps){
		if( Env.isInBrowser() ){
			this.updateTitle( nextProps.title );
		}else{
			this.updateContext( nextProps );
		}
	},
	updateTitle(title){
		if( !title )
			return;
		document.title = title;
	},
	updateContext(nextProps){
		this.context.documentHead.setHeader(nextProps);
	},
	render(){
		return null;
	}
});