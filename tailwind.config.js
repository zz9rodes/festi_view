/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1a1a1a",
        foreground: "#f5f5f5",
        card: "#252525",
        "card-foreground": "#f5f5f5",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        secondary: "#374151",
        "secondary-foreground": "#f5f5f5",
        muted: "#2a2a2a",
        "muted-foreground": "#a1a1aa",
        accent: "#10b981",
        "accent-foreground": "#ffffff",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#3a3a3a",
        input: "#3a3a3a",
        ring: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
