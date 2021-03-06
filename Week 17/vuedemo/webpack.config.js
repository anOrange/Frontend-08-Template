const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  module: {
    rules: [{
      test: /\.vue$/,
      use: 'vue-loader'
    },{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }], 
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'demo',
      filename: '[name].html',
      template: './src/index.html',
    }),
  ]
}
