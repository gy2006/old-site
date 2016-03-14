var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var glob = require('glob');
var Bourbon = require('bourbon');
var config = require('./config');

var nconf = require('nconf');
nconf.env().argv();

const webpackConfig = {
  entry: {
    app: [
      './src/main.js'
    ],
    vendor: config.vendor
  },
  module: {
    loaders: []
  },
  output: {
    path: './dist',
    filename: '[name].[hash].js'
  },
  plugins: [],
  sassLoader: {
    includePaths: Bourbon.includePaths
  }
};

if (nconf.get('TARGET') === 'local') {
  webpackConfig.entry.app = [
    "webpack-dev-server/client?http://localhost:8080/",
    "webpack/hot/dev-server"
  ].concat(webpackConfig.entry.app);
}

// ------------------------------------
// Loaders
// ------------------------------------
webpackConfig.module.loaders.push({
  test: /\.jade$/,
  loader: 'jade',
  exclude: /node_modules/
});

webpackConfig.module.loaders.push({
  test: /\.js$/,
  loader: 'babel',
  exclude: '/node_modules/'
});

webpackConfig.module.loaders.push({
  test: /\.json$/,
  loader: 'json',
  exclude: '/node_modules/'
});

webpackConfig.module.loaders.push({
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract('style', 'css!sass')
});

webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
);

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins.push(new ExtractTextPlugin('main.css'));


webpackConfig.plugins.push(new webpack.DefinePlugin(config[nconf.get('TARGET')] || 'local'));

glob.sync('./src/views/**/*.jade').map(file => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: file,
      filename: path.basename(file, '.jade') + '.html',
      inject: 'body'
    })
  );
});

module.exports = webpackConfig;

