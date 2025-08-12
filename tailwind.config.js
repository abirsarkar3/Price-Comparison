/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Dark mode with class strategy
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // ✅ For Next.js App Router
    "./pages/**/*.{js,ts,jsx,tsx}",     // ✅ For Pages Router (if any)
    "./components/**/*.{js,ts,jsx,tsx}",// ✅ For Components
    "./src/**/*.{js,ts,jsx,tsx}",       // ✅ For src directory (if used)
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6B00", // ✅ Price Comparison Brand Orange
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#1E293B",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280"
        }
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem"
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-in-out"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),    // ✅ Animations
    require("@tailwindcss/forms"),     // ✅ Better form elements
    require("@tailwindcss/typography") // ✅ Rich text styling
  ]
};
