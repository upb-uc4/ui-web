process.env.VUE_APP_VERSION = require("./package.json").version;

// do not add trailing forward slash
process.env.VUE_APP_API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://uc4.cs.uni-paderborn.de/api/production"
        : "https://uc4.cs.uni-paderborn.de/api/develop";

module.exports = {
    chainWebpack: (config) => {
        config.module.rule("eslint").use("eslint-loader").options({
            fix: false,
        });
        config.plugins.delete("prefetch");
    },
    publicPath: process.env.NODE_ENV === "production" ? "/deploy/" : "/",
};
