process.env.VUE_APP_VERSION = require("./package.json").version;
const fs = require("fs");

// do not add trailing forward slash
process.env.VUE_APP_API_BASE_URL = process.env.NODE_ENV === "production" ? "https://uc4.cs.uni-paderborn.de/api/production" : "/api";

const endpoint = "https://uc4.cs.uni-paderborn.de/api/experimental/";
// const endpoint = "https://uc4.cs.uni-paderborn.de/api/development/"

module.exports = {
    chainWebpack: (config) => {
        config.module.rule("eslint").use("eslint-loader").options({
            fix: false,
        });
        config.plugins.delete("prefetch");
    },
    publicPath: process.env.NODE_ENV === "production" ? "/deploy/" : "",
    devServer: {
        https: {
            key: fs.readFileSync("./certs/server-key.pem"),
            cert: fs.readFileSync("./certs/server-cert.pem"),
        },
        compress: true,
        proxy: {
            "/api/": {
                target: endpoint,
                pathRewrite: { "^/api": "" },
                changeOrigin: true,
            },
        },
    },
};
