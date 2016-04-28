var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var glob = require('glob');
var Bourbon = require('bourbon');
var config = require('./config');

var nconf = require('nconf');
nconf.env().argv();

const targetConfig = config[nconf.get('TARGET') || 'local'];

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

glob.sync('./src/views/**/*.jade').map(file => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: file,
      filename: path.basename(file, '.jade') + '.html',
      inject: 'body',
      favicon: path.resolve(__dirname, 'src/static/favicon.ico'),
      bughd_token: targetConfig['__BUGHD_TOKEN__']
    })
  );
});
glob.sync('./src/views/**/*.html').map(file => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: file,
      filename: path.basename(file),
      inject: false
    })
  );
});
module.exports = webpackConfig;

