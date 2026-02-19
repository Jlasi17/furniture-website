import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'rosewood-primary': '#3E2723',
                'rosewood-secondary': '#5D4037',
                'rosewood-accent': '#D4AF37',
                'rosewood-bg': '#FAF8F5',
                'rosewood-surface': '#FFFFFF',
                'rosewood-text': '#2D2D2D',
                'rosewood-muted': '#6B6B6B',
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
