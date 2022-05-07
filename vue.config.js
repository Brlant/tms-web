const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const targets = [
  'https://hw-test-tms.cdcerp.cn',
  'http://localhost:8081',
];

module.exports = {
  devServer: {
    open: true,
    port: '8014',
    https: false,
    hotOnly: false, disableHostCheck: true, proxy: {
      '/api': {
        target: targets[0],
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
