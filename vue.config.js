process.env.VUE_APP_VERSION = require("./package.json").version;

// do not add trailing forward slash
process.env.VUE_APP_API_BASE_URL = process.env.NODE_ENV === "production" ? "https://uc4.cs.upb.de/api" : "http://localhost:9000";

module.exports = {
    chainWebpack: config => {
        config.module
          .rule('eslint')
          .use('eslint-loader')
          .options({
            fix: false,
        });
    },
    publicPath: process.env.NODE_ENV === "production" ? "/deploy/" : "/",
};
