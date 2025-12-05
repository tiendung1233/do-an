import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./hook/**/*.{js,ts,jsx,tsx,mdx}",
    "./ultils/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary - Indigo (Apple-like)
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        // Secondary - Slate (Neutral)
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Accent - Rose/Pink
        accent: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        // Success - Emerald
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Warning - Amber
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Error - Red
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Glass colors
        glass: {
          white: "rgba(255, 255, 255, 0.7)",
          "white-strong": "rgba(255, 255, 255, 0.85)",
          dark: "rgba(30, 41, 59, 0.7)",
          "dark-strong": "rgba(30, 41, 59, 0.85)",
          border: "rgba(255, 255, 255, 0.5)",
          "border-dark": "rgba(71, 85, 105, 0.5)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        display: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Fira Code",
          "Fira Mono",
          "Roboto Mono",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.16" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
        "7xl": ["4.5rem", { lineHeight: "1.05" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "7.5": "1.875rem",
        "8.5": "2.125rem",
        "9.5": "2.375rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "17": "4.25rem",
        "18": "4.5rem",
        "19": "4.75rem",
        "21": "5.25rem",
        "22": "5.5rem",
        "25": "6.25rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "46": "11.5rem",
        "50": "12.5rem",
        "54": "13.5rem",
        "58": "14.5rem",
        "62": "15.5rem",
        "66": "16.5rem",
        "70": "17.5rem",
        "74": "18.5rem",
        "78": "19.5rem",
        "82": "20.5rem",
        "86": "21.5rem",
        "90": "22.5rem",
        "94": "23.5rem",
        "98": "24.5rem",
        "100": "25rem",
        "104": "26rem",
        "108": "27rem",
        "112": "28rem",
        "116": "29rem",
        "120": "30rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      boxShadow: {
        // Glass shadows
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
        "glass-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
        "glass-xl": "0 35px 60px -15px rgba(0, 0, 0, 0.15)",
        // Glow effects
        "glow-sm": "0 0 15px rgba(99, 102, 241, 0.3)",
        glow: "0 0 20px rgba(99, 102, 241, 0.4)",
        "glow-lg": "0 0 30px rgba(99, 102, 241, 0.5)",
        "glow-xl": "0 0 50px rgba(99, 102, 241, 0.6)",
        // Primary shadows
        "primary-sm": "0 4px 14px rgba(99, 102, 241, 0.2)",
        primary: "0 8px 24px rgba(99, 102, 241, 0.3)",
        "primary-lg": "0 12px 36px rgba(99, 102, 241, 0.4)",
        // Card shadows
        "card-sm": "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08)",
        "card-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.08)",
        "card-xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.1)",
        // Inset
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
        "inner-glow-strong": "inset 0 2px 0 0 rgba(255, 255, 255, 0.9)",
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
      },
      keyframes: {
        // Fade animations
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Scale animations
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        // Bounce animations
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-in-bounce-right": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "33%": { opacity: "0.5", transform: "translateX(0%)" },
          "66%": { opacity: "0.7", transform: "translateX(20%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Float animation
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        // Pulse animations
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)" },
        },
        // Shimmer
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Liquid gradient
        "liquid-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // Spin slow
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Slide animations
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out-bottom": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        // Blur animations
        "blur-in": {
          "0%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
      },
      animation: {
        // Fade
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-in",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "fade-in-down": "fade-in-down 0.4s ease-out",
        "fade-in-left": "fade-in-left 0.4s ease-out",
        "fade-in-right": "fade-in-right 0.4s ease-out",
        // Scale
        "scale-in": "scale-in 0.3s ease-out",
        "scale-out": "scale-out 0.2s ease-in",
        // Bounce
        "bounce-in": "bounce-in 0.5s ease-out",
        "fade-in-bounce-right": "fade-in-bounce-right 0.8s ease-out",
        // Float
        float: "float 3s ease-in-out infinite",
        // Pulse
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        // Shimmer
        shimmer: "shimmer 2s linear infinite",
        // Liquid
        "liquid-flow": "liquid-flow 15s ease infinite",
        // Spin
        "spin-slow": "spin-slow 20s linear infinite",
        // Slide
        "slide-in-bottom": "slide-in-bottom 0.4s ease-out",
        "slide-out-bottom": "slide-out-bottom 0.3s ease-in",
        // Blur
        "blur-in": "blur-in 0.5s ease-out",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        "in-back": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
        "out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "in-out-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        spring: "cubic-bezier(0.21, 1.02, 0.73, 1)",
      },
      backgroundImage: {
        // Gradients
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Glass gradients
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
        "glass-gradient-dark":
          "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)",
        // Mesh gradients
        "mesh-gradient":
          "radial-gradient(at 40% 20%, hsla(248, 80%, 70%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(339, 80%, 70%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(199, 90%, 70%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(22, 90%, 70%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(180, 80%, 70%, 0.3) 0px, transparent 50%)",
        // Shimmer
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
        // Primary gradients
        "primary-gradient":
          "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        "primary-gradient-soft":
          "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
        // Accent gradients
        "accent-gradient": "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
        // Success gradient
        "success-gradient":
          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        // Liquid gradient
        "liquid-gradient":
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
