/** @type {import('tailwindcss').Config} */


const spacingValues = {
  'px': '0.0625rem', // 1px
  '0.125': '0.125rem', // 2px
  '0.25': '0.25rem', // 4px
  '0.5': '0.5rem', // 8px
  '0.75': '0.75rem', // 12px
  '1': '1rem', // 16px
  '1.25': '1.25rem', // 20px
  '1.5': '1.5rem', // 24px
  '1.75': '1.75rem', // 28px
  '2': '2rem', // 32px
  '2.25': '2.25rem', // 36px
  '2.5': '2.5rem', // 40px
  '2.75': '2.75rem', // 44px
  '3': '3rem', // 48px
  '3.5': '3.5rem', // 56px
  '3.75': '3.75rem', // 60px
  '4': '4rem', // 64px
  '4.5': '4.5rem', // 72px
  '5': '5rem', // 80px
  '5.5': '5.5rem', // 96px
  '6': '6rem', // 96px
  '7': '7rem', // 112px
  '8': '8rem', // 128px
  '9': '9rem', // 144px
  '10': '10rem', // 160px
  '11': '11rem', // 176px
  '12': '12rem', // 192px
  '14': '14rem', // 224px
  '16': '16rem', // 256px
  '20': '20rem', // 320px
  '24': '24rem', // 384px
  '28': '28rem', // 448px
  '32': '32rem', // 512px
  '36': '36rem', // 576px
  '40': '40rem', // 640px
  '44': '44rem', // 704px
  '48': '48rem', // 768px
  '52': '52rem', // 832px
  '56': '56rem', // 896px
  '60': '60rem', // 960px
  '64': '64rem', // 1024px
  '72': '72rem', // 1152px
  '80': '80rem', // 1280px
  '96': '96rem', // 1408px
  '100': '100rem', // 1600px
}

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
      spacing: spacingValues,
      colors: {
        textPrimary: "#1a1a1a",
        textSecondary: " rgb(162, 162, 162)",
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
