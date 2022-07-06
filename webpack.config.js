const { resolve } = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const tsRule = {
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: "ts-loader",
};

const cssRule = {
  test: /\.css$/i,
  exclude: /node_modules/,
  use: [MiniCssExtractPlugin.loader, "css-loader"],
};

const plugins = [
  new HTMLWebpackPlugin({
    template: "src/popup.html",
    filename: "popup.html",
    chunk: ["popup.html"],
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: "public", to: "." }],
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
];

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: "./src/popup.tsx",
    contentscript: "./src/contentscript.js",
    background: "./src/background.js",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [tsRule, cssRule],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins,
};
