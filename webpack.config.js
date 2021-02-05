const { NamedModulesPlugin } = require('webpack');
const { resolve } = require('path');
const TSConfigPathPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: ['./src/index.ts'],
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          configFile: './babel.config.js',
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
  plugins: [new NamedModulesPlugin()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts'],
    modules: ['node_modules', 'src'],
    plugins: [new TSConfigPathPlugin({ configFile: './tsconfig.json' })],
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
