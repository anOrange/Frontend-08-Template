const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: './main.js',
    // animationTest: './animationTest.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [['@babel/plugin-transform-react-jsx', {pragma: 'createElement'}]]
        }
      }
    }, {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
      }
    }]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title:'测试',
    //   filename: '[name].html',
    //   template: 'main.html',
    // }),
  ],
  mode: "development"
}
 