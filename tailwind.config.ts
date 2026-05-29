import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    lineHeight: {
      none: "1.25",
      tight: "1.375",
      snug: "1.5",
      normal: "1.75",
      relaxed: "2",
      loose: "2.25",
      "3": ".9375rem",
      "4": "1.25rem",
      "5": "1.5rem",
      "6": "1.75rem",
      "7": "2.25rem",
      "8": "2.5rem",
      "9": "2.75rem",
      "10": "3.125rem",
      "5xl": "2",
    },
    extend: {
      fontFamily: {
        sans:        ["var(--font-sans)", "var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
        serif:       ["var(--font-serif)", "Georgia", "serif"],
        mono:        ["var(--font-mono)", "Menlo", "monospace"],
        googletitre: ["var(--font-nunito)", '"Nunito"', "sans-serif"],
        googletexte: ["var(--font-inter)", '"Inter"', "sans-serif"],
      },
      fontWeight: {
        light:     "300",
        normal:    "400",
        regular:   "500",
        medium:    "600",
        semibold:  "700",
        bold:      "800",
        extrabold: "900",
      },
      colors: {
        darkblue:       "#0e0e0c",
        mediumblue:     "#0e0e0c",
        regularblue:    "#2a2a26",
        lightblue:      "#2a2a26",
        extralightblue: "#ebe9e3",
        white:          "#FFFFFF",
        orange:         "#FF6B6B",
        coral:          "#FF6B6B",
        lightyellow:    "#F2E57E",
        paper:          "#ffffff",
        ink:            "#0e0e0c",
        vermilion:      "#d83a1a",
        /* ─── Design tokens « Édition Suisse » ───────────────
           Base éditoriale formalisée (papier / encre / règles).
           `action` = rouge vermilion, RÉSERVÉ aux éléments
           cliquables (boutons, liens). Ne pas l'utiliser pour
           du décoratif : labels, chiffres et badges restent en
           encre (ink / ink-2). */
        "paper-2":      "#ebe9e3",
        "ink-2":        "#2a2a26",
        rule:           "rgba(14, 14, 12, 0.18)",
        "rule-strong":  "rgba(14, 14, 12, 0.42)",
        action:         "#d83a1a",
        background:     "hsl(var(--background))",
        foreground:     "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar-background))",
          foreground:           "hsl(var(--sidebar-foreground))",
          primary:              "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--sidebar-border))",
          ring:                 "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg:  "0",
        md:  "0",
        sm:  "0",
        DEFAULT: "0",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
