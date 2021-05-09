const HtmlWebPackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});
module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: "/",
    filename: "dist/bundle.js"
  },
  plugins: [
    htmlPlugin,
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },

    ]
  },
  // watch: true,
};
