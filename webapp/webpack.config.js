const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globImporter = require('node-sass-glob-importer');

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  mode: NODE_ENV,
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      Pages: path.resolve(__dirname, 'src/pages/'),
      Images: path.resolve(__dirname, 'assets/images/'),
    },
  },
  entry: ['./src/app.jsx', './dist/styles/application.scss'],

  output: {
    filename: NODE_ENV === 'development' ? 'index.js' : 'index-[contenthash].js',
    path: path.resolve(__dirname, './webapp-static'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        },
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        loader: 'file-loader',
        options: {
          name:
            NODE_ENV === 'development' ? '[path][name].[ext]' : '[path][name]-[contenthash].[ext]',
        },
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                importer: globImporter(),
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: NODE_ENV || 'development',
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || 'http://localhost:5000/graphql',
      REST_ENDPOINT: process.env.REST_ENDPOINT || 'http://localhost:5000',
    }),
    new MiniCssExtractPlugin({
      filename: NODE_ENV === 'development' ? 'index.css' : 'index-[contenthash].css',
      chunkFilename: NODE_ENV === 'development' ? '[id].css' : '[id]-[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: './dist/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};

module.exports = config;
