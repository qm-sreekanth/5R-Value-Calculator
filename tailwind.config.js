/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f77b4',
        secondary: '#2ca02c',
        accent: '#ff7f0e',
        warning: '#d62728',
        info: '#9467bd',
      },
    },
  },
  plugins: [],
}