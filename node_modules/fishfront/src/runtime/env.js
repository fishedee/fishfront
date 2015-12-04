export default {
	isInBrowser(){
		return typeof window != 'undefined' && typeof window.location != 'undefined';
	},
	isInNode(){
		return !this.isInBrowser();
	},
	exportGlobal(name,value){
		if( typeof window != 'undefined' )
			window[name] = value;
		else
			global[name] = value;
	}
};