import {Mvc,Router,Route,IndexRoute} from './react-mvc';
import Model from './react-mvc/model';
import ReactDOM from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import StyleSheet from './react-style';
import DocumentHead from './react-document-head-provider';

import Express from 'express';
import Compress from 'compression';
import Webpack from 'webpack';
import WebpackMiddleware from '../webpack/webpack-dev-middleware';
import RequireReload from '../runtime/reload';

function routerRender(router,url){
	return new Promise((resolve,reject)=>{
		match({routes:router,location:url},(error,redirectLocation,renderProps)=>{
			if( error ){
				resolve({status:500,msg:error.message});
			}else if( redirectLocation ){
				resolve({status:302,msg:redirectLocation.pathname + redirectLocation.search});
			}else if( renderProps ){
				resolve({status:200,msg:renderProps});
			}else{
				resolve({status:404,msg:'File not found'});
			}
		});
	});
}

class MvcServer extends Mvc{
	construcotr(){
		super.construcotr();
		this.routeInstance = null;
		this.webpackConfig = null;
		this.staticDir = null;
		this.development = true;
		this.port = 1616;
	}
	setWebPackConfig(webpackConfig){
		this.webpackConfig = webpackConfig;
	}
	setPort(port){
		this.port = port;
	}
	setDevelopment(development){
		this.development = development;
	}
	setStaticDir(staticDir){
		this.staticDir = staticDir;
	}
	async renderToString(req,resp){
		//寻找路由
		var routerResult = await routerRender(this.routeInstance,req.url);
		if( routerResult.status == 500 ){
			resp.status(500).send(routerResult.msg);
			return null;
		}else if( routerResult.status == 302 ){
			resp.redirect(302,routerResult.msg);
			return null;
		}else if( routerResult.status == 404 ){
			resp.status(404).send(routerResult.msg);
			return null;
		}else{
			//首次渲染获取数据
			var ModelProvider = Model.Provider;
			var model = new Model.Store();
			model.setServerRequest(req);

			var renderProps = routerResult.msg;
			var serverHandler = [];
			ReactDOM.renderToString(
				<ModelProvider model={model} serverHandler={serverHandler}>
					<RoutingContext {...renderProps}/>
				</ModelProvider>
			);
			for( var i in serverHandler ){
				if( !serverHandler[i].onServerCreate ) 
					continue;
				await serverHandler[i].onServerCreate();
			}
			var data = model.serialize();
			for( var i in serverHandler ){
				if( !serverHandler[i].onServerClose ) 
					continue;
				await serverHandler[i].onServerClose();
			}

			//二次渲染获取html
			var DocumentHeadProvider = DocumentHead.Provider;
			var documentHead = new DocumentHead.DocumentHead();

			var routerResult = await routerRender(this.routeInstance,req.url);
			var renderProps = routerResult.msg;
			var html = ReactDOM.renderToString(
				<DocumentHeadProvider documentHead={documentHead}>
					<ModelProvider model={model}>
						<RoutingContext {...renderProps}/>
					</ModelProvider>
				</DocumentHeadProvider>
			);

			//生成stylesheet
			var style = StyleSheet.renderToString(html);

			var result = (
`<!DOCTYPE>
<html>
    <head>
       	${documentHead.renderMetaString()}
       	${documentHead.renderTitleString()}
       	${documentHead.renderBaseString()}
       	${documentHead.renderLinkString()}
       	${style}
    </head>
    <body>
        <div id="body">${html}</div>
        <script>window.__INIT_STATE__=${data}</script>
        ${documentHead.renderScriptString()}
    </body>
</html>
`
);
			resp.send(result);
		}
	}
	getMiddleware(){
		var self = this;
		var middleware = async (req,resp,next)=>{
			try{
		        await self.renderToString(req,resp);
		    }catch(e){
		        resp.status(500).send('nodejs server error');
		        console.error(e.stack);
		    }
		}
		return middleware.bind(this);
	}
	run(){
		var self = this;
		var requireReload = RequireReload(require,{noLibrary:true});
		var app = new Express();
		var port = this.port;
		var compiler = Webpack(this.webpackConfig);
		app.use(Compress());
		app.set('etag',true);
		app.set('etag','strong');
		if( this.staticDir ){
			app.use(Express.static(this.staticDir));
		}
		app.use(WebpackMiddleware(compiler,{
			hot:true,
			stats: {
				colors: true
			}
		}));
		app.use(async (req,resp,next)=>{
			try{
				var routeInstance = requireReload(self.route);
				routeInstance = routeInstance && routeInstance.__esModule ? routeInstance : { default: routeInstance }; 
				self.routeInstance = routeInstance.default;
				await self.renderToString(req,resp,next);
			}catch(e){
				resp.status(500).send('nodejs server error');
		        console.error(e.stack);
			}
		});
		app.listen(port, function(error) {
		  	if (error) {
		    	console.error(error);
		  	}else{
		    	console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
		  	}
		});
	}
}

export default MvcServer;