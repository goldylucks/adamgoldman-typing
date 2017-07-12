import path from 'path'

import webpack from 'webpack'
// import HtmlWebpackPlugin from 'webpack-html-plugin'

const isProd = process.env.NODE_ENV === 'production'

export default {
  entry: path.resolve(__dirname, 'src', 'index'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', include: /src/ },
    ],
  },
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    port: 8000,
    hot: true,
    contentBase: path.resolve(__dirname, 'src'),
  },
}
