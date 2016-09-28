var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var glob = require('glob');
var Bourbon = require('bourbon');
var config = require('./config');
var En = require('./src/i18n/en');
var Zh = require('./src/i18n/zh');

var i18n = {
  en: En,
  zh: Zh
}
var defaultLanguage = 'en'
var timeStamp = new Date()
var nconf = require('nconf');
nconf.env().argv();

const targetConfig = config[nconf.get('TARGET') || 'local'];
const __DEV__ = nconf.get('NODE_ENV') !== 'production'
const webpackConfig = {
  entry: {
    app: [
      './src/main.js'
    ],
    vendor: config.vendor
  },
  module: {
    loaders: [
      {
        test: /\.jade$/,
        loader: 'jade',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loaders: ['babel', 'eslint'],
        exclude: '/node_modules/'
      },
      {
        test: /\.json$/,
        loader: 'json',
        exclude: '/node_modules/'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
      { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
      { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
      { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
      { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
    ]
  },
  output: {
    path: './dist',
    filename: '[name].[hash].js'
  },
  plugins: [
    new ExtractTextPlugin('main.[contenthash].css'),
    new webpack.DefinePlugin(targetConfig)
  ],
  sassLoader: {
    includePaths: Bourbon.includePaths
  },
  eslint: {
    emitWarning: __DEV__
  }
};

if (nconf.get('TARGET') === 'local') {
  webpackConfig.entry.app = [
    "webpack-dev-server/client?http://localhost:8080/",
    "webpack/hot/dev-server"
  ].concat(webpackConfig.entry.app);
}
if (nconf.get('NODE_ENV') === 'production') {
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  );
} else {
  webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
}
// ------------------------------------
// Plugins
// ------------------------------------

// glob.sync('./src/views/**/*.jade').map(file => {
//   webpackConfig.plugins.push(
//     new HtmlWebpackPlugin({
//       template: file,
//       filename: path.basename(file, '.jade') + '.html',
//       inject: 'body',
//       favicon: path.resolve(__dirname, 'src/static/favicon.ico'),
//       bughd_token: targetConfig['__BUGHD_TOKEN__'],
//       locale: defaultLanguage,
//       language: i18n[defaultLanguage]
//     })
//   );
// });

glob.sync('./src/views/**/*.jade').map(file => {
  const baseName = path.basename(file, '.jade')
  if (!__DEV__) {
    var supports = Object.keys(i18n)
    supports.map((locale) => {
      webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
          template: file,
          filename: locale + '/' + baseName + '.html',
          inject: 'body',
          favicon: path.resolve(__dirname, 'src/static/favicon.ico'),
          bughd_token: targetConfig['__BUGHD_TOKEN__'],
          locale: locale,
          last_modify: timeStamp.toISOString(),
          language: i18n[locale]
        })
      );
    })
  }
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: file,
      filename: baseName + '.html',
      inject: 'body',
      favicon: path.resolve(__dirname, 'src/static/favicon.ico'),
      bughd_token: targetConfig['__BUGHD_TOKEN__'],
      locale: defaultLanguage,
      last_modify: timeStamp.toISOString(),
      language: i18n[defaultLanguage]
    })
  );
});
module.exports = webpackConfig;

