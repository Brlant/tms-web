const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

// 代理的目标地址集合
const proxyTargets = {
  sh: "https://sh-tms.cdcerp.cn", // 测试环境
  lxr: "http://192.168.5.10:8081", // 先锐本地
  yj: "http://127.0.0.1:8015", // 本地
  xwc:'http://192.168.5.213:8081'  // 夏文超
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
