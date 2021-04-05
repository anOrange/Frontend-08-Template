module.exports = {
  entry: './main.js',
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [['@babel/plugin-transform-react-jsx', {pragma: 'createElement'}]]
        }
      }
    }, {
      test: /\.(ts|tsx)$/,
      use: {
        loader: 'ts-loader',
      }
    }]
  },
  mode: "development"
}