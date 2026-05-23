import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#03293d",
          teal: "#075f75",
          sky: "#a9d3ef",
          light: "#f0f8fc",
          cream: "#fffbf7",
          gold: "#f5c84b",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        sm: ["13px", { lineHeight: "18px", fontWeight: "500" }],
        base: ["14px", { lineHeight: "20px", fontWeight: "500" }],
        lg: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        xl: ["18px", { lineHeight: "28px", fontWeight: "600" }],
        "2xl": ["20px", { lineHeight: "28px", fontWeight: "700" }],
        "3xl": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "4xl": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "5xl": ["40px", { lineHeight: "48px", fontWeight: "800" }],
      },
      fontWeight: {
        regular: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(3, 41, 61, 0.08)",
        md: "0 8px 24px rgba(3, 41, 61, 0.12)",
        lg: "0 12px 32px rgba(3, 41, 61, 0.16)",
        xl: "0 16px 48px rgba(3, 41, 61, 0.18)",
        "2xl": "0 20px 64px rgba(3, 41, 61, 0.20)",
        glow: "0 0 20px rgba(169, 211, 239, 0.4)",
        "glow-soft": "0 0 12px rgba(169, 211, 239, 0.2)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-down": "slide-down 0.4s ease-out",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        17: "4.25rem",
        18: "4.5rem",
      },
      maxWidth: {
        container: "1280px",
        card: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
