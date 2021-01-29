const { NamedModulesPlugin } = require('webpack');
const { resolve } = require('path');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
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
    modules: ['node_modules', 'src'],
    extensions: ['.js'],
    alias: {
      src: resolve(__dirname, 'src'),
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
