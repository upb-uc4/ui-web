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
        },
    },
    variants: {
        opacity: ["responsive", "hover", "focus", "disabled"],
        backgroundColor: ["responsive", "hover", "focus", "disabled"],
        cursor: ["responsive", "disabled"],
        tableLayout: ["responsive", "hover", "focus"],
    },
    plugins: [require("@tailwindcss/custom-forms")],
};
