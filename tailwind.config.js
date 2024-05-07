/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        screens: {
            // Match breakpoints to Angular Material
            xs: { max: "599px" },
            sm: { min: "600px", max: "959px" },
            md: { min: "960px", max: "1279px" },
            lg: { min: "1280px", max: "1919px" },
            xl: { min: "1920px" },
            // Device breakpoints
            tablet: { min: "600px" },
            laptop: { min: "960px" },
            desktop: { min: "1280px" },
        },
        container: {
            center: true,
        },
        extend: {},
    },
    plugins: [],
};
