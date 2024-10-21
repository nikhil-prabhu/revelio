const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
        fontFamily: {
            "sans": ["Montserrat", "sans"],
            "mono": ["Martian Mono", "monospace"],
        },
    },
    darkMode: "class",
    plugins: [nextui()],
}

