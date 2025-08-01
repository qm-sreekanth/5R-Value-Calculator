# 5R Value Calculator

A Next.js application for calculating medical benefit drug savings using the 5R strategy (Right Drug, Right Patient, Right Site, Right Dose, Right Duration).

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/qm-sreekanth/5R-Value-Calculator.git
   cd 5R-Value-Calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Important Notes

- **CSS/Tailwind Issues:** If styles are not loading properly, make sure you:
  1. Run `npm install` to install all dependencies
  2. Restart the development server (`npm run dev`)
  3. Clear your browser cache

- **Configuration Files:** The following files are essential for the app to work:
  - `tailwind.config.js` - Tailwind CSS configuration
  - `postcss.config.js` - PostCSS configuration for Tailwind
  - `next.config.js` - Next.js configuration

## Technology Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS v3
- **Language:** TypeScript
- **Package Manager:** npm

## Project Structure

```
├── components/          # React components
├── pages/              # Next.js pages
├── styles/             # CSS files
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── public/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

If you encounter styling issues:

1. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Verify Tailwind CSS is working:**
   - Check that `tailwind.config.js` exists
   - Verify `@tailwind` directives are in `styles/globals.css`
