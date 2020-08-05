module.exports = {
    extends: "@istanbuljs/nyc-config-typescript",
    all: false,
    extension: [".vue", ".ts"],
    reporter: ["lcov", "text", "text-summary"],
    include: ["src/**/*.{vue,ts}"],
};
