/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Brand Colors
        primary: "#065f46", // Dark Emerald Green
        "on-primary": "#ffffff",
        secondary: "#475569", // Slate
        "on-secondary": "#ffffff",
        
        // Backgrounds & Surfaces
        background: "#f8fafc",
        surface: "#ffffff",
        "surface-container-low": "#f1f5f9",
        "surface-container": "#e2e8f0",
        "secondary-container": "#e2e8f0",
        
        // Text & Outlines
        "on-surface": "#0f172a",
        "on-surface-variant": "#334155",
        "outline": "#cbd5e1",
        "outline-variant": "#e2e8f0",
      },
      fontFamily: {
        "headline": ["Outfit", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "price-display": ["Plus Jakarta Sans"],
        "label-bold": ["Manrope"],
        "h1": ["Plus Jakarta Sans"],
        "h2": ["Plus Jakarta Sans"],
        "h3": ["Plus Jakarta Sans"],
        "body-md": ["Manrope"],
        "body-lg": ["Manrope"],
      },
      fontSize: {
        "price-display": ["24px", {"lineHeight": "1", "letterSpacing": "-0.01em", "fontWeight": "700"}],
        "label-bold": ["14px", {"lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "h1": ["64px", {"lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "800"}],
        "h2": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.03em", "fontWeight": "700"}],
        "h3": ["32px", {"lineHeight": "1.3", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-md": ["16px", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
