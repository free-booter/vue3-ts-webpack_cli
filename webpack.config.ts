import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
import { DefinePlugin } from "webpack";

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
      {
        test: /\.vue$/,
        use: "vue-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
          "sass-loader",
        ],
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
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(false), // 是否开启 Options API（Vue2 风格）
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // 生产环境是否开启 devtools 支持
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // SSR hydration mismatch 报错详情
    }),
  ],
};

export default config;
