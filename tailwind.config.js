/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      sans: '"Roboto", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      mono: '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warn: "rgb(var(--color-warn) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        transparent: "transparent",
        current: "currentColor",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
