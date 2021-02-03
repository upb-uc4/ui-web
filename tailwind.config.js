const colors = require("tailwindcss/colors");

module.exports = {
    purge: {
        enabled: true,
        preserveHtmlElements: false,
        content: ["./src/**/*.html", "./src/**/*.vue"],
        options: {
            safelist: ["dark:bg-night-black"],
        },
    },
    darkMode: "class",
    theme: {
        colors: {
            transparent: "transparent",
            white: colors.white,
            bluegray: colors.blueGray,
            black: colors.black,
            gray: colors.coolGray,
            red: colors.red,
            blue: colors.lightBlue,
            yellow: colors.amber,
            green: colors.green,
            lime: colors.lime,
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
                140: "35rem",
                160: "40rem",
                180: "45rem",
            },
            minHeight: {
                20: "5rem",
                80: "20rem",
            },
            opacity: {
                90: ".9",
            },
            maxHeight: {
                50: "50vh",
                60: "60vh",
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
    plugins: [],
};
