import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-100": "#C2DCFF",
        "primary-700": "#15202E",
        "neutral-50": "#F9FAFB",
        "neutral-100": "#F2F2F3",
        black: "#1E1E1E",
        "gray-light": "#B3B3B3",
        "gray-icon": "#ADB2BC",
      },
      width: {
        150: "37.5rem",
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "50%": { transform: "translateX(10px)" },
          "75%": { transform: "translateX(-10px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        custom: {
          primary: "#213147",
          neutral: colors.neutral[200],
        },
      },
    ],
  },
} satisfies Config;
