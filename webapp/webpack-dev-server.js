const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config.js');
const options = {
  contentBase: './assets',
  publicPath: config.output.publicPath,
  host: 'localhost',
  historyApiFallback: true,
  compress: true,
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: true,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: false,
    warnings: true,
    publicPath: false,
  },
  port: 3000,
  open: true,
  openPage: '',
};

webpackDevServer.addDevServerEntrypoints(config, options);

const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

// Serve the files on port 3000.
server.listen(options.port, '0.0.0.0', function() {
  console.log(`Listening on port ${options.port}`);
});
