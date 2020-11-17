const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const chalk = require("chalk");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env = {}) => {
    let endpoint = "https://uc4.cs.uni-paderborn.de/api/develop/";

    // do not add trailing forward slash
    switch (process.env.NODE_ENV) {
        case "production":
            process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/production";
            endpoint = "https://uc4.cs.uni-paderborn.de/api/production/";
            break;
        case "development":
            process.env.VUE_APP_API_BASE_URL = "/api1";
            endpoint = "https://uc4.cs.uni-paderborn.de/api/develop/";
            break;
        case "experimental":
            process.env.VUE_APP_API_BASE_URL = "/api2";
            endpoint = "https://uc4.cs.uni-paderborn.de/api/experimental/";
            break;
        default:
            process.env.VUE_APP_API_BASE_URL = env.WEBPACK_SERVE ? "api1" : "https://uc4.cs.uni-paderborn.de/api/production";
            endpoint = "https://uc4.cs.uni-paderborn.de/api/develop/";
            break;
    }

    process.env.VUE_APP_VERSION = require("./package.json").version;
    process.env.NODE_ENV = process.env.NODE_ENV || env.WEBPACK_SERVE ? "development" : "production";

    env.BASE_URL = "/deploy/";

    return {
        mode: env.prod ? "production" : "development",
        entry: path.resolve(__dirname, "./src/main.ts"),
        output: {
            path: path.resolve(__dirname, "./dist"),
            publicPath: env.BASE_URL,
        },
        resolve: {
            extensions: [".ts", ".js", ".vue", ".json"],
            fallback: {
                // path polyfill for cypress file upload
                path: require.resolve("path-browserify"),
            },
            alias: {
                // this isn't technically needed, since the default `vue` entry for bundlers
                // is a simple `export * from '@vue/runtime-dom`. However having this
                // extra re-export somehow causes webpack to always invalidate the module
                // on the first HMR update and causes the page to reload.
                vue: "@vue/runtime-dom",
            },
            plugins: [new TsconfigPathsPlugin()],
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "vue-loader",
                            options: {
                                hotReload: true,
                            },
                        },
                        "eslint-loader",
                    ],
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        "babel-loader",
                        {
                            loader: "ts-loader",

                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                                transpileOnly: true,
                            },
                        },
                        "eslint-loader",
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: "file-loader",
                                    options: {
                                        name: "img/[name].[hash:8].[ext]",
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", { loader: "css-loader", options: { importLoaders: 1 } }, "postcss-loader"],
                },
                {
                    test: /\.svg$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "img/[name].[hash:8].[ext]",
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 4096,
                                fallback: {
                                    loader: "file-loader",
                                    options: {
                                        name: "img/[name].[hash:8].[ext]",
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false,
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
                    VUE_APP_VERSION: JSON.stringify(process.env.VUE_APP_VERSION || '"undefined"'),
                    BASE_URL: '"/deploy/"',
                    VUE_APP_API_BASE_URL: JSON.stringify(process.env.VUE_APP_API_BASE_URL),
                },
            }),
            new ProgressBarPlugin({
                format: "  build [:bar] " + chalk.green.bold(":percent") + " (:elapsed seconds)",
                clear: false,
            }),
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    enabled: true,
                    files: "./src/**/*.{ts,tsx,js,jsx,vue}",
                },
                typescript: {
                    extensions: {
                        vue: {
                            enabled: true,
                            compiler: "@vue/compiler-sfc",
                        },
                    },
                    diagnosticOptions: {
                        semantic: true,
                        syntactic: false,
                    },
                },
            }),
            new HtmlWebpackPlugin({
                title: "ui-web",
                template: "./public/index.html",
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "public"),
                        to: path.resolve(__dirname, "dist"),
                        toType: "dir",
                        globOptions: {
                            dot: true,
                            ignore: ["**/index.html"],
                        },
                    },
                ],
            }),
        ],
        devServer: {
            clientLogLevel: "debug",
            port: 443,
            publicPath: "/deploy/",
            https: {
                key: fs.readFileSync("./certs/server-key.pem"),
                cert: fs.readFileSync("./certs/server-cert.pem"),
            },
            compress: true,
            proxy: {
                "/api1/": {
                    target: endpoint,
                    pathRewrite: { "^/api1": "" },
                    changeOrigin: true,
                },
                "/api2/": {
                    target: endpoint,
                    pathRewrite: { "^/api2": "" },
                    changeOrigin: true,
                },
            },
            inline: true,
            hot: true,
            stats: "minimal",
            contentBase: path.resolve(__dirname, "dist"),
            overlay: true,
            historyApiFallback: {
                index: "/deploy/index.html",
            },
        },
    };
};
