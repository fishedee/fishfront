#0.1.0
0.1.0版本是在原来的BakeWeb框架上改的

想法很简单

让model层变成全局域的，新增controller的onServerCreate与onServerDestroy接口

从而实现服务器渲染，与model层的缓存

实现还算比较成功

但问题有如下几点

1.让controller层创建model，而且每个model与model的名字必须一一对应，不然序列化model时会出错，这个限制有点狠

2.router设置不灵活，像header，footer这种每个页面都有的数据，用现在的做法每次都是重新渲染，footer就不能做切换动画了。

3.router仍未达成按需异步加载的能力。例如现在只打开a页面，那么应该只拉a页面的代码。当用户切换到b页面时，才需要拉b页面的代码，而不需要首次打开就是一股脑的全部拉，造成首屏时间慢。

#0.2.0

更改为React-Router做路由器，大大提高了路由的灵活性，但同时也去掉了onResume,onPause的回调

model层在初始化时被全局生成，这样controller也不需要loadModel这样的写法了，同时也让首屏的打开也变慢了，例如打开a页面时，也会将b页面的数据加载进来。不过不是什么大问题，毕竟b页面的数据大多数都是空数组，或者null这类的数据，占用的空间很小。

仍未解决的问题为：

1.router的component没有达成按需加载的能力

#0.3.0

完成按需加载view的能力

仍未解决的问题为：

1.model层的数据虽然不多，但是代码还是很多的，model层的代码不能一次全部拉完，会影响首屏显示时间，需要增加按需加载model层的能力

2.view层的body数据已经纳入react管理，但像header，title这些数据仍然没有纳入react管理，会造成页面title在首次加载时显示不正常。

3.style层没有纳入首屏react显示

#0.3.5

完成model层的按需加载能力

剩余的问题有：

1.style层没有纳入首屏react显示管理

2.view层的body数据已经纳入react管理，但像header，title这些数据仍然没有纳入react管理，会造成页面title在首次加载时显示不正常。

#0.4.0

完成style层纳入首屏react显示管理

剩余问题：
1.isormic fetch，前后端统一的跨域ajax处理

2.view层的body数据已经纳入react管理，但像header，title这些数据仍然没有纳入react管理，会造成页面title在首次加载时显示不正常。

#0.5.0

完成document的header纳入react管理

fetch经过仔细思考后确认以model的mixin方式来引入，这样对用户来说更方便灵活。

剩余问题

1.controller层加入getSegment,getQuery，getHash的方法

2.model层加入获取server端的request的能力，以及多mixin的initialize合并操作

3.整体client包的大小评估，去除多余模块

4.加快webpack的编译效率以及易用性

5.提供可选的mvc-polyfill

#0.5.5
解决controller的获取location的接口，以及model层获取serverRequest的接口

剩余问题
1.整体client包的大小评估，去除多余模块

2.加快webpack的编译效率以及易用性

3.提供可选的mvc-polyfill，目标是IE8（包含且以上）的兼容性

#0.6.0

基础框架的原始大小是1.13mb，使用min版本后是307kb，gzip压缩后是87kb，client包的大小基本上是符合要求的。

webpack的编译效率是通过加入module.noParse和resolve的alias

同时使用webpack-dev-middleware以及nodejs的强制reload的能力，基本达成了快速debug编译的性能

剩余问题：

1.前端开发时需要开两个窗口，babel watch，以及后端服务器的watch

2.提供可选的mvc-polyfill，目标是IE8（包含且以上）的兼容性

#0.6.1

超加速webpack的编译效率，爽爽哒，而且只需要开单个窗口噢

剩余问题：
1.提供可选的mvc-polyfill，目标是IE8（包含且以上）的兼容性

#0.7.0
修复model层的序列与反序列化没有接入immutable的问题，以及todo sample

#0.7.1
增加前后端统一fetch的mixins

