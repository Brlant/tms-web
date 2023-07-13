const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

// 代理的目标地址集合
const proxyTargets = {
  sh: "https://sh-tms.cdcerp.cn", // 测试环境
  un: "https://un-tms.cdcerp.cn", // 测试环境
  lxr: "http://192.168.5.10:8081", // 先锐本地
  local: "http://127.0.0.1:8081", // 本地
  xwc:'http://192.168.5.56:8081',  // 夏文超
  yj:'http://192.168.5.50:8081',  // 杨剑
  cjg:'http://192.168.5.29:8081'  // 陈金果
};

module.exports = {
  devServer: {
    open: true,
    port: '8014',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: proxyTargets.un,
        changOrigin: true
      }
    }
  },
  transpileDependencies: ['@dtop'],
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'static'), to: 'static',
          ignore: ['.*']
        }])
    ]
  }
};
