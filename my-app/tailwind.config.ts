import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages//*.{js,ts,jsx,tsx,mdx}',
    './src/components//.{js,ts,jsx,tsx,mdx}',
    './src/app/**/.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'moon-bg': "url('https://imgur.com/YVk5FyS')",
        'hero': "url('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2676')",
      },
      backgroundColor: {
        'transparent': 'transparent', // Adding a transparent background color utility
      },
    },
  },
  plugins: [],
}
export default config
