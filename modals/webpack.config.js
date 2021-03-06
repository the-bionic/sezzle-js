const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const sass = require('node-sass');
module.exports = {
  entry: './index.js',
  output: {
    filename: `main.js`,
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: './index.html' }),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(process.env.VERSION),
        LANGUAGE: JSON.stringify(process.env.LANGUAGE)
      },
    }),
    new CopyWebpackPlugin([
      { from: './modals-*/**.html' },
      {
        from: './modals-*/modal.scss',
        transform (content, path) {
          const result = sass.renderSync({
            file: path
          });
          return result.css.toString();
        },
      }
    ]),
  ],
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8081
  }
};
