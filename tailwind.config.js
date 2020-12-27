const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./src/**/*.html", "./src/**/*.vue"],
    darkMode: "class",
    theme: {
        colors: {
            transparent: "transparent",
            white: colors.white,
            black: colors.black,
            gray: colors.coolGray,
            red: colors.red,
            blue: colors.lightBlue,
            yellow: colors.amber,
            green: colors.green,
            lime: colors.lime,
            grayalt: "#24292e",
            normalgray: colors.gray,
            night: {
                black: "#121212",
                base: "#181818",
                light: "#242424",
            },
        },
        extend: {
            colors: {
                normalgray: {
                    850: "#24242A",
                },
            },
            spacing: {
                0.5: ".125rem",
                9: "2.25rem",
                18: "4.5rem",
                80: "20rem",
                108: "27rem",
                160: "40rem",
                180: "45rem",
            },
            minHeight: {
                20: "5rem",
            },
            opacity: {
                90: ".9",
            },
            maxHeight: {
                50: "50vh",
            },
        },
    },
    variants: {
        opacity: ["responsive", "hover", "focus", "disabled"],
        backgroundColor: ["responsive", "hover", "focus", "disabled", "dark"],
        cursor: ["responsive", "disabled"],
        tableLayout: ["responsive", "hover", "focus"],
        ringColor: ["responsive", "focus", "dark"],
    },
    plugins: [
        require("tailwind-heropatterns")({
            // as per tailwind docs you can pass variants
            variants: [],

            // the list of patterns you want to generate a class for
            // the names must be in kebab-case
            // an empty array will generate all 87 patterns
            patterns: ["circuit-board"],

            // The foreground colors of the pattern
            colors: {
                "default": "#9C92AC",
                "blue-dark": "#000044", //also works with rgb(0,0,205)
            },

            // The foreground opacity
            opacity: {
                default: "0.05",
                100: "1.0",
            },
        }),
    ],
};
