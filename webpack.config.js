const webpack = require("webpack");

const definePlugin = new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
});

module.exports = {
  plugins: [definePlugin],
  output: {
    libraryTarget: "commonjs"
  },
  externals: {
    react: "react",
    "prop-types": "prop-types"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
