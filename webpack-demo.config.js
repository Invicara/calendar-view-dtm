/**
 * generates the dist/index.html and dist/demo.js files
 * to demo the component.
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": process.env.NODE_ENV
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  entry: {
    demo: "./src/webpack-dev-server.js"
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "defaults",
                  include: [
                    "@babel/plugin-proposal-optional-chaining" // parsing fails on optional operator without this
                  ]
                }
              ],
              "@babel/preset-react"
            ]
          }
        }
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      "remote-component.config.js": path.resolve("./remote-component.config.js")
    }
  }
};
