const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const webpack = require('./webpack.config');

webpack.optimization = {
  minimizer: [new OptimizeCSSAssetsPlugin({}), new UglifyJsPlugin()],
};
const newPlugins = [new CompressionPlugin(), new BrotliPlugin()];
webpack.plugins.push(...newPlugins);

module.exports = webpack;
