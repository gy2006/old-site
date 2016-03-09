var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Bourbon = require('bourbon');
var glob = require('glob');
var config = require('./config');

const webpackConfig = {
  entry: {
    app: ['./src/main.js']
  },
  module: {
    loaders: []
  },
  output: {
    path: './dist',
    filename: 'app.js'
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

webpackConfig.plugins.push(new webpack.DefinePlugin(config.globals));

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

