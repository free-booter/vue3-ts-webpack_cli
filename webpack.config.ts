import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  mode: "development",
  // 配置入口
  entry: "./src/main.ts",
  // 配置出口
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name]_[chunkhash:8].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".vue", ".json"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    open: true,
    port: 9000,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

export default config;
