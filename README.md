# 简介
pilipa 中心运营系统，主要由react+redux+stylus+webpack+antd+typescript构成

# 安装
- npm install tyarn -g
- tyarn install

# 启动
npm run dev || node build/server.js
```
重启 pm2 restart agent  // ([app-name|id])
关闭 pm2 stop agent
删除 pm2 delete agetnt
日志 pm2 logs agent
```

# 测试
```
npm run test:watch(监测模式)
npm run test
```

# 打包
npm run build
打包之后会再当目录生成一个dist文件夹  index.html就是入口文件

# src项目结构描述
* actions 存储redux的Action
* components 存储组件
* containers 容器,调用组件组织页面
* imgs 存储图片
* pages 存储对应路由的页面
* plugins 插件
* reducers 存储redux的reducer
* router 路由配置
* stylus stylus存储目录
* app.js 入口js
* index.html 入口html页面

# babel
* babel-preset-env(推荐) 替代了 babel-preset-es2015

# 其他
* react 中文官网 [http://www.react-cn.com/](http://www.react-cn.com/)
* 使用antd为了减少项目大小，使用 babel-plugin-import [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)
* stylus参考网址 [http://stylus-lang.com/](http://stylus-lang.com/)
* antdesign参考网址 [https://ant.design/index-cn](https://ant.design/index-cn)
* redux中文文档 [http://www.redux.org.cn/](http://www.redux.org.cn/)
* react-router参考网址 [https://reacttraining.com/react-router/web/guides/quick-start](https://reacttraining.com/react-router/web/guides/quick-start)
* react-router v4中文地址 [https://reacttraining.cn](https://reacttraining.cn)
* redux-actions [https://github.com/acdlite/redux-actions](https://github.com/acdlite/redux-actions)
* webpack中文文档地址 [https://doc.webpack-china.org](https://doc.webpack-china.org/)
* ant design mobile [https://mobile.ant.design/index-cn](https://mobile.ant.design/index-cn)
* [antd mobile 0.8 以上版本「高清」方案设置](https://github.com/ant-design/ant-design-mobile/wiki/antd-mobile-0.8-%E4%BB%A5%E4%B8%8A%E7%89%88%E6%9C%AC%E3%80%8C%E9%AB%98%E6%B8%85%E3%80%8D%E6%96%B9%E6%A1%88%E8%AE%BE%E7%BD%AE)
* mui 文档 [http://dev.dcloud.net.cn/mui/](http://dev.dcloud.net.cn/mui/)
* h5+ native.js文档 [http://ask.dcloud.net.cn/docs/](http://ask.dcloud.net.cn/docs/)
* tslint文档 [https://palantir.github.io/tslint/](https://palantir.github.io/tslint/)
* jest单元测试 [http://facebook.github.io/jest/](http://facebook.github.io/jest/)

# issue
* [typescript]  <font color="red">Cannot find name 'PropertyKey'</font>
```
在es2015中才有propertyKey数据类型 在tsconfig.json配置文件compilerOptions添加lib
"lib": [
  "es2015",
  "dom"
]
```
