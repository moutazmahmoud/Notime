/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./Navigation.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        mono: ["SpaceMono"],
      },
      filter: {
        dropShadowDark: "drop-shadow(0 1px 1px rgb(255 255 255 / 1))",
        dropShadowLight: "drop-shadow(0 1px 1px rgb(0 0 0 / 1))",
      },
      colors: {
        textPrimary: #1a1a1a,
        textSecondary: "#b3b3c0",
        border: "#1a332a",
        input: "#243f34",
        ring: "#274b36",
        background: "#0d1c11",
        foreground: "#a9ffea",
        primary: {
          '10': '#1443C3',
          '20': '#004481',
          '30': '#003357',
          '31': '#073763',
          '32': '#091a2b',
          '34': '#0a213c',
          '35': 'rgb(249, 249, 249)',
          '36': '#011f4b',
          '40': '#97CBDC',
          '60': '#DEE8F1',
          '80': 'hsl(184, 58.40%, 66.10%)',
          '100': 'hsl(214, 100%, 96%)',
      },
        secondary: {
          DEFAULT: "#1cd7a2",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#26a879",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1a1e19",
          foreground: "#b3b3c0",
        },
        accent: {
          DEFAULT: "#eaffff",
          foreground: "#1a1a1a",
        },
        popover: {
          DEFAULT: "#1c1e19",
          foreground: "#e4f3f4",
        },
        card: {
          DEFAULT: "#102314",
          foreground: "#e4f3f4",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {},
    },
  },
  plugins: [],
};
