const tsconfig = require("./tsconfig.json");
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json",
        },
    },
    moduleNameMapper,
    moduleFileExtensions: ["js", "ts", "vue", "json", "jsx", "tsx", "node"],
    transform: {
        "^.+\\.vue$": "vue-jest",
        "^.+\\js$": "babel-jest",
    },
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    setupFiles: ["<rootDir>/.jest/env.ts"],
    testMatch: ["<rootDir>/tests/unit/**/*.spec.ts"],
    verbose: true,
    testPathIgnorePatterns: ["<rootDir>/tests/e2e/"],
};
