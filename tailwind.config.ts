import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        fontFamily: {
            nunito: ["nunito", "system-ui", "sans-serif"],
        },
    },
    plugins: [],
} satisfies Config;
