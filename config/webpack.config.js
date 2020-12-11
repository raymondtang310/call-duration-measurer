const { HotModuleReplacementPlugin, NamedModulesPlugin } = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { resolve } = require('path');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name]-[hash].js',
    hotUpdateChunkFilename: 'hot-update.[hash:6].js',
    hotUpdateMainFilename: 'hot-update.[hash:6].json',
    path: resolve(__dirname, '..', 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: [['@babel/env']],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new LodashModuleReplacementPlugin({
      paths: true,
    }),
    new NamedModulesPlugin(),
  ],
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.mjs', '.js'],
    alias: {
      src: resolve(__dirname, '../src'),
    },
  },
  stats: {
    assetsSort: '!size',
    children: false,
    chunks: false,
    colors: true,
    entrypoints: false,
    modules: false,
  },
  target: 'node',
};
