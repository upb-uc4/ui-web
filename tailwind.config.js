module.exports = {
    purge: ["./src/**/*.html", "./src/**/*.vue"],
    theme: {
        customForms: (theme) => ({
            default: {
                checkbox: {
                    "&:focus": {
                        boxShadow: undefined,
                        borderColor: undefined,
                    },
                },
                radio: {
                    "&:focus": {
                        boxShadow: undefined,
                        borderColor: undefined,
                    },
                },
            },
        }),
        extend: {
            spacing: {
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
        backgroundColor: ["responsive", "hover", "focus", "disabled"],
        cursor: ["responsive", "disabled"],
        tableLayout: ["responsive", "hover", "focus"],
    },
    plugins: [
        require("@tailwindcss/custom-forms"),
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
