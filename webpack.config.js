var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Bourbon = require('bourbon');
var glob = require('glob');
var config = require('./config');
var nconf = require('nconf');
nconf.file('./config/index.json');

const webpackConfig = {
  entry: {
    app: [
      "webpack-dev-server/client?http://localhost:8080/",
      "webpack/hot/dev-server",
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


// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins.push(new ExtractTextPlugin('main.css'));

nconf.env().argv();
webpackConfig.plugins.push(new webpack.DefinePlugin(nconf.get(nconf.get('NODE_ENV'))));

glob.sync('./src/views/**/*.jade').map(file => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: file,
      filename: path.basename(file, '.jade') + '.html',
      inject: 'body'
    })
  );
})

module.exports = webpackConfig;

