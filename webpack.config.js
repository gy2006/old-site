var path = require('path');
var webpack = require('webpack');
var cssnano = require('cssnano');
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
var defaultLanguage = 'zh'
var timeStamp = new Date()
var nconf = require('nconf');
nconf.env().argv();

const targetConfig = config[nconf.get('TARGET') || 'local'];
const __DEV__ = nconf.get('NODE_ENV') !== 'production'
const __PROD__ = nconf.get('NODE_ENV') === 'production'
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
        loaders: [
          'style',
          'css?sourceMap&-minimize',
          'postcss',
          'sass?sourceMap'
        ]
      },
      { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[hash].[ext]&limit=100&mimetype=application/font-woff' },
      { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[hash].[ext]&limit=100&mimetype=application/font-woff2' },
      { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[hash].[ext]&limit=100&mimetype=font/opentype' },
      { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[hash].[ext]&limit=100&mimetype=application/octet-stream' },
      { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[hash].[ext]' },
      { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[hash].[ext]&limit=10000&mimetype=image/svg+xml' },
      { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
    ]
  },
  output: {
    path: 'dist',
    filename: '[name].[hash].js',
    publicPath: __PROD__ ? '/' : 'http://localhost:8080/'
  },
  plugins: [
    new webpack.DefinePlugin(targetConfig)
  ],
  sassLoader: {
    includePaths: Bourbon.includePaths
  },
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions', '> 5%', 'not ie < 10']
      },
      discardComments: {
        removeAll: true
      },
      safe: true,
      sourcemap: true
    })
  ],
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
if (!__DEV__) {
  webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const loaders = loader.loaders
    const first = loaders[0]
    const rest = []

    for (var i = 1, j = loaders.length; i < j; i++) {
      rest.push(loaders[i])
    }
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
  });

  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    })
  );
}

glob.sync('./src/views/**/*.jade').map(file => {
  const baseName = path.basename(file, '.jade')
  if (__PROD__) {
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

