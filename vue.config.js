require("custom-env").env();

process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
    chainWebpack: (config) => {
        config.module.rule("eslint").use("eslint-loader").options({
            fix: false,
        });
    },
    //     /deploy/
    publicPath: process.env.NODE_ENV === "production" ? "$ENV_PUBLIC_PATH" : "/",
};
