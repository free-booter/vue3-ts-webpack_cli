import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
import DotenvPlugin from "dotenv-webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const isProd = process.env.NODE_ENV === "production";

const config = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  // 配置入口
  entry: "./src/main.ts",
  devtool: "eval-cheap-module-source-map",
  // 配置出口
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name]_[chunkhash:8].js",
    assetModuleFilename: "assets/[hash][ext][query]",
    chunkFilename: "js/[name]_[chunkhash:8].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/], //这行很重要，用于处理 Vue 文件中的 TypeScript
            transpileOnly: true,
          },
        },
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
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
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
      {
        test: /\.(mp3|wav)$/,
        type: "asset/resource",
        generator: {
          filename: "audio/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".vue", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
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
    new DotenvPlugin({
      path: `./.env.${process.env.NODE_ENV || "development"}`,
      systemvars: true,
    }),
    isProd &&
      new MiniCssExtractPlugin({
        filename: "css/[name]_[chunkhash:8].css",
        chunkFilename: "css/[name]_[id].[contenthash:8].css",
      }),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial",
        },
        common: {
          name: "common",
          minChunks: 2,
          priority: -20,
          chunks: "initial",
          reuseExistingChunk: true,
        },
        routeComponents: {
          name(module: any) {
            const match = module
              .identifier()
              .match(/src[\\/]views[\\/]([^\\/]+)\.vue$/);
            return match ? match[1].toLowerCase() : "route";
          },
          test: /[\\/]src[\\/]views[\\/].*\.vue$/,
          chunks: "async",
          priority: -5,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
};

export default config;
