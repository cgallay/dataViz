const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // devServer: {
  //   historyApiFallback: true,
  //   hot: true,
  //   inline: true,
  //   progress: true,
  //   contentBase: '.',
  //   port: 8080
  // },
  entry: {
    app: './src/index.js'
  },
  //entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  watch: true,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
        // ExtractTextPlugin.extract({
        //   fallbackLoader: 'style-loader',
        //   loader: ['css-loader'],
        //   publicPath: '/build'
        // })
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: "styles.css"
    }),
    new HtmlWebpackPlugin({
      // minify: {
      //  collapseWhitespace: true
      // },
      template: './src/index.html'
    })
    
    //new OpenBrowserPlugin({url: 'http://localhost:8081'})
  ]
};
