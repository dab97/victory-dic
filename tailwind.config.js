/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        highlight: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
      screens: {
        // Using min/max-width for more flexible responsive design
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Dynamic aspect ratio breakpoints
        'portrait': { raw: '(orientation: portrait)' },
        'landscape': { raw: '(orientation: landscape)' },
        // Height-based breakpoints
        'tall': { raw: '(min-height: 854px)' },
        'short': { raw: '(max-height: 853px)' },
      },
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
};
