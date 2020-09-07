const { initPlugin } = require("cypress-plugin-snapshots/plugin");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: any, config: any) => {
    // on('file:preprocessor', webpack({
    //  webpackOptions: require('@vue/cli-service/webpack.config'),
    //  watchOptions: {}
    // }))
    require("@cypress/code-coverage/task")(on, config);
    initPlugin(on, config);
    return config;
};
