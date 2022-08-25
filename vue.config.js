const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

// 代理的目标地址集合
const proxyTargets = {
  hw: "https://hw-test-tms.cdcerp.cn",  // 华为云环境
  sh: "https://sh-tms.cdcerp.cn",       // sh环境
  lxr: "http://192.168.5.10:8081",      // 先锐本地
  yj: "http://localhost:8081",      // 本地
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
        target: proxyTargets.sh,
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
