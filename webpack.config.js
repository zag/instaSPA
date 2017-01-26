
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src/');
var DEV = process.env.DEV || 'false';

var config = {

  devServer: {
    port: 8080,
    contentBase: 'build',
    historyApiFallback: true,
    proxy: {
      '/api*': {
        target: 'http://localhost:5000',
      }
    }
  },
    entry: "./src/main.jsx",
    output: {
            path: BUILD_DIR,
            filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, 
	    loader: ExtractTextPlugin.extract("style-loader", "css-loader")
	    },

             {test : /\.jsx?/,
             include : APP_DIR,
             loader : 'babel'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.css")
    ]
};

module.exports = config;
