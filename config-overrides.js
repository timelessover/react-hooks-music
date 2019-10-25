const { injectBabelPlugin } = require('react-app-rewired');
const rewireCssModules = require('react-app-rewire-css-modules');
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}


module.exports = function override(config, env) {
    // do stuff with the webpack config...

    //启用ES7的修改器语法（babel 7）
    config = injectBabelPlugin(['@babel/plugin-proposal-decorators', { "legacy": true }], config)   //{ "legacy": true }一定不能掉，否则报错

    //按需加载
    config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);

    //配置别名
    config.resolve.alias = {
        '@': resolve('src'),
        'assets': resolve('src/assets'),
        'components': resolve('src/components')
    }

    //scss模块化 "react-app-rewired": "2.0.2-next.0"
    config = rewireCssModules(config, env);



    return config;
};
