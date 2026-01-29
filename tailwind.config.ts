import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Phoneme category colors
        phoneme: {
          'short-vowel': '#FF6B6B',
          'long-vowel': '#4ECDC4',
          consonant: '#45B7D1',
          digraph: '#96CEB4',
          blend: '#FFEAA7',
          diphthong: '#DDA0DD',
          'r-controlled': '#F39C12',
        },
        // Game theme colors
        game: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#F59E0B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          xp: '#FFD700',
        },
        // World theme colors
        world: {
          'letters-land': '#A78BFA',
          'word-city': '#34D399',
          'sentence-station': '#60A5FA',
          'story-kingdom': '#F472B6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
