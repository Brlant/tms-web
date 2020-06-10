const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  devServer: {
    open: true,
    port: '8014',
    https: false,
    hotOnly: false, disableHostCheck: true, proxy: {
      '/api': {
        target: 'https://dev-tms.cdcerp.cn',
        changOrigin: true
      }
    }
  },
  transpileDependencies: ['@dtop'],
  configureWebpack: {
    plugins: [new SentryWebpackPlugin({
      include: './dist/static/map',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules'],
      configFile: 'sentry.properties'
    }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'static'), to: 'static',
          ignore: ['.*']
        }])
    ]
  }
};
