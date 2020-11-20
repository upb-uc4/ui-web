process.env.VUE_APP_VERSION = require("./package.json").version;
const fs = require("fs");

let endpoint = "https://uc4.cs.uni-paderborn.de/api/experimental/";

// do not add trailing forward slash
switch (process.env.NODE_ENV) {
    case "production":
        process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/production";
        endpoint = "https://uc4.cs.uni-paderborn.de/api/production/";
        break;
    case "development":
        // Revert this comment before merging on develop
        // process.env.VUE_APP_API_BASE_URL = "/api1";
        // endpoint = "https://uc4.cs.uni-paderborn.de/api/develop/";
        process.env.VUE_APP_API_BASE_URL = "/api2";
        endpoint = "https://uc4.cs.uni-paderborn.de/api/experimental/";
        break;
    case "experimental":
        process.env.VUE_APP_API_BASE_URL = "/api2";
        endpoint = "https://uc4.cs.uni-paderborn.de/api/experimental/";
        break;
    default:
        process.env.VUE_APP_API_BASE_URL = "/api2";
        break;
}

module.exports = {
    chainWebpack: (config) => {
        config.module.rule("eslint").use("eslint-loader").options({
            fix: false,
        });
        config.plugins.delete("prefetch");
    },
    //publicPath: process.env.NODE_ENV === "production" ? "/deploy/" : "",
    publicPath: "/deploy/",

    devServer:
        process.env.NODE_ENV != "production"
            ? {
                  port: 443,
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
              }
            : {},
};
