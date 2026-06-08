import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:   '#4E342E',
          coffee: '#6D4C41',
          sand:   '#D7CCC8',
          beige:  '#EFEBE9',
          cream:  '#F5F5DC',
          gold:   '#C8A97E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(78,52,46,0.12)',
        card:  '0 2px 16px 0 rgba(78,52,46,0.08)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
}
export default config